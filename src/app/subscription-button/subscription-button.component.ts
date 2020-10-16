import {Component, Inject, OnInit} from '@angular/core';
import {merge, Observable, of} from 'rxjs';
import {AppConfig, CONFIG_TOKEN} from '../service-app-config/app-config.service';
import {SubscriptionService} from '../subscription.service';
import {SwPush} from '@angular/service-worker';
import {catchError, map, take} from 'rxjs/operators';

@Component({
  selector: 'app-subscription-button',
  templateUrl: './subscription-button.component.html',
  styleUrls: ['./subscription-button.component.scss']
})
export class SubscriptionButtonComponent implements OnInit {

  VAPID_PUBLIC_KEY: string | null = null;

  subscriptionState: Observable<{ subscribed: boolean, subscribable: boolean }>;

  constructor(
    @Inject(CONFIG_TOKEN) private config: AppConfig,
    private subscriptionService: SubscriptionService,
    private swPush: SwPush,
  ) {
  }

  ngOnInit(): void {
    this.VAPID_PUBLIC_KEY = this.config.vapid_publicKey

    this.subscriptionState = merge(
      of({subscribed: false, subscribable: false}),
      this.swPush.subscription.pipe(
        map(subscription => {
          return {subscribed: subscription !== null, subscribable: true}
        }),
        catchError((err) => {
          console.log('Caught error', err);
          return [{subscribed: false, subscribable: false}];
        })
      )
    );
  }

  unsubscribe() {
    this.swPush.unsubscribe()
      .then(() => this.subscriptionService.subscriptionRemoved())
      .catch(err => console.error('Could not unsubscribe from notifications', err))
  }

  subscribeToNotifications() {
    console.log('VAPID key:', this.VAPID_PUBLIC_KEY);
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY as string
    }).then(sub => this.subscriptionService.subscriptionCreated(sub).pipe(take(1)).subscribe())
      .catch(err => console.error('Could not subscribe to notifications', err));
  }
}
