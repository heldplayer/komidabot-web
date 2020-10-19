import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {combineLatest, concat, from, Observable, of, throwError, zip} from 'rxjs';
import {AppConfig, CONFIG_TOKEN} from '../service-app-config/app-config.service';
import {catchError, distinctUntilChanged, finalize, map, switchMap, take, tap} from 'rxjs/operators';
import {SwPush} from '@angular/service-worker';
import {SettingsService, SubscriptionSettings} from '../service-settings/settings.service';
import {BaseApiResponse} from '../entities';
import {AdministrationChannel, DailyMenuChannel, SubscriptionChannel} from './channels';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

/*
 * New or modified channel subscription:
 * POST /api/subscribe
 * {
 *   endpoint: '...'
 *   keys: [...]
 *   channel: '...'
 *   data: ...
 * }
 *
 * Delete channel subscription:
 * DELETE /api/subscribe
 * {
 *   endpoint: '...'
 *   channel: '...'
 * }
 *
 * Replace subscription endpoint and keys:
 * PUT /api/subscribe
 * {
 *   old_endpoint: '...'
 *   endpoint: '...'
 *   keys: [...]
 * }
 *
 */

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  private subscriptionChannels: Record<string, SubscriptionChannel<unknown>> = {};

  private readonly subscriptionState$: Observable<{ subscribed: boolean, subscribable: boolean }>;
  private readonly subscription$: Observable<{ endpoint: string; keys: Record<string, string>; } | null>;

  constructor(
    private http: HttpClient,
    private swPush: SwPush,
    @Inject(CONFIG_TOKEN) private config: AppConfig,
    private settings: SettingsService,
  ) {

    this.addSubscriptionChannel(new DailyMenuChannel());
    this.addSubscriptionChannel(new AdministrationChannel());

    console.log('Push enabled:', this.swPush.isEnabled);

    this.subscription$ = this.swPush.subscription.pipe(
      map(SubscriptionService.pushToObject),
      catchError((_) => [null]),
    );

    this.subscriptionState$ = concat(
      of({subscribed: false, subscribable: false}),
      this.swPush.subscription.pipe(
        map((push) => {
          return {subscribed: push !== null, subscribable: true}
        }),
        catchError((err) => {
          console.error(err);
          return [{subscribed: false, subscribable: false}];
        }),
      )
    ).pipe(
      distinctUntilChanged((a, b) => {
        console.log('distinctUntilChanged', a, b);
        return a.subscribed === b.subscribed && a.subscribable === b.subscribable;
      }),
      tap((value) => console.log('subscriptionState$', value))
    );

    // Recreate subscriptions object to ensure it conforms
    // This mostly just means we add all required keys to the object in case they weren't there yet
    this.settings.getSubscriptions().pipe(
      take(1),
    ).subscribe(subscriptions => {
      const newObject: SubscriptionSettings = {};

      Object.values(this.subscriptionChannels).forEach(channelObj => {
        if (channelObj.name in subscriptions) {
          newObject[channelObj.name] = subscriptions[channelObj.name];
        } else {
          newObject[channelObj.name] = {enabled: false, data: channelObj.defaultData};
        }
      });

      this.settings.setSubscriptions(newObject);
    });
  }

  private static pushToObject(push: PushSubscription | null) {
    if (push === null) {
      return null;
    }
    const subscriptionJson = push.toJSON();
    if (!('endpoint' in subscriptionJson) || !('keys' in subscriptionJson)) {
      return null;
    }
    const endpoint = subscriptionJson.endpoint as string;
    const keys = subscriptionJson.keys as Record<string, string>;

    return {endpoint, keys};
  }

  private addSubscriptionChannel(channel: SubscriptionChannel<unknown>) {
    this.subscriptionChannels[channel.name] = channel;
  }

  getChannel(channel: string): SubscriptionChannel<unknown> | null {
    return channel in this.subscriptionChannels ? this.subscriptionChannels[channel] : null;
  }

  getChannelData<T>(channel: SubscriptionChannel<T>): Observable<T> {
    return this.settings.getSubscriptions().pipe(
      map(subscriptions => subscriptions[channel.name].data as T),
    );
  }

  setChannelData<T>(channel: SubscriptionChannel<T>, data: T): Observable<void> {
    return this.settings.getSubscriptions().pipe(
      take(1),
      map(subscriptions => {
        subscriptions[channel.name].data = data;

        this.settings.setSubscriptions(subscriptions);
        return;
      }),
    );
  }

  getChannelEnabled(channel: SubscriptionChannel<unknown>): Observable<boolean> {
    return this.settings.getSubscriptions().pipe(
      map(subscriptions => subscriptions[channel.name].enabled),
    );
  }

  setChannelEnabled(channel: SubscriptionChannel<unknown>, enabled: boolean): Observable<void> {
    return this.settings.getSubscriptions().pipe(
      take(1),
      map(subscriptions => {
        subscriptions[channel.name].enabled = enabled;

        this.settings.setSubscriptions(subscriptions);
        return;
      }),
    );
  }

  getChannelSubscriptionState(channel: string): Observable<{ subscribed: boolean, subscribable: boolean }> {
    const channelObj = this.getChannel(channel);
    if (channelObj === null) {
      return of({subscribed: false, subscribable: false});
    }

    return combineLatest([this.subscriptionState$, this.getChannelEnabled(channelObj)]).pipe(
      tap(([state]) => console.log('===', channel, 'pre', state)),
      map(([state, enabled]) => {
        if (state.subscribed) {
          return {subscribed: enabled, subscribable: true};
        }
        return state;
      }),
      tap(x => console.log('===', channel, 'post', x)),
      finalize(() => console.log('===', channel, 'finalize')),
    );
  }

  private sendAddChannel(channel: SubscriptionChannel<unknown>): Observable<boolean> {
    return zip(this.subscription$.pipe(
      take(1),
      switchMap((push) => {
        if (push === null) {
          return from(this.swPush.requestSubscription({serverPublicKey: this.config.vapid_publicKey})).pipe(
            map(SubscriptionService.pushToObject),
          );
        }
        return of(push);
      }),
    ), this.getChannelData(channel)).pipe(
      take(1),
      switchMap(([push, data]) => {
        console.log('Subscription is', push);

        if (push === null) {
          return throwError('Subscription is null');
        }

        const message: AddSubscriptionMessage = {
          endpoint: push.endpoint,
          keys: push.keys,
          channel: channel.name,
          data,
        };

        return this.http.post<BaseApiResponse>(this.config.api.subscription_endpoint, message, httpOptions);
      }),
      tap((value) => console.log('sendAddChannel tap', value)),
      map((response) => response.status === 200),
      catchError((_) => [false]),
    );
  }

  private sendDeleteChannel(channel: SubscriptionChannel<unknown>): Observable<boolean> {
    return this.subscription$.pipe(
      take(1),
      switchMap((push) => {
        if (push === null) {
          return throwError('Subscription is null');
        }

        const data: DeleteSubscriptionMessage = {
          endpoint: push.endpoint,
          channel: channel.name
        };

        const options = Object.assign({}, httpOptions) as any;
        options.body = data;

        return this.http.request<BaseApiResponse>('DELETE', this.config.api.subscription_endpoint, options);
      }),
      map((value) => value as unknown as BaseApiResponse),
      tap((value) => console.log('sendDeleteChannel tap', value)),
      map((response) => response.status === 200),
      catchError((_) => [false]),
    );
  }

  subscribeChannel(channel: string): Observable<boolean> {
    const channelObj = this.getChannel(channel);
    if (channelObj === null) {
      return of(false);
    }

    return this.sendAddChannel(channelObj).pipe(
      switchMap((success) => {
        if (success) {
          return this.setChannelEnabled(channelObj, true).pipe(
            map((_) => success),
          );
        }
        return of(success);
      }),
    );
  }

  unsubscribeChannel(channel: string): Observable<boolean> {
    const channelObj = this.getChannel(channel);
    if (channelObj === null) {
      return of(false);
    }

    return this.sendDeleteChannel(channelObj).pipe(
      switchMap((success) => {
        if (success) {
          return this.setChannelEnabled(channelObj, false).pipe(
            map((_) => success),
          );
        }
        return of(success);
      }),
    );
  }
}

interface AddSubscriptionMessage {
  endpoint: string;
  keys: Record<string, string>;
  channel: string;
  data?: any;
}

interface DeleteSubscriptionMessage {
  endpoint: string;
  channel: string;
}

interface ReplaceSubscriptionMessage {
  old_endpoint: string;
  endpoint: string;
  keys: Record<string, string>;
}
