import {Injectable, OnDestroy} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Observable, of, ReplaySubject, Subject} from 'rxjs';
import {map, takeUntil, tap} from 'rxjs/operators';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService implements OnDestroy {
  private unsubscribe$ = new Subject<void>();

  constructor(
    private translate: TranslateService,
  ) {
    this.translate.setDefaultLang('nl');

    this.language$
      .pipe(
        tap(value => {
          console.log('Language:', value);
          document.documentElement.setAttribute('lang', value);
        }),
        takeUntil(this.unsubscribe$),
      )
      .subscribe(language => this.translate.use(language));

    this.setCookiesAcknowledged(localStorage.getItem('preferences.cookiesAcknowledged') === '1');
    this.setLanguage(localStorage.getItem('preferences.language') || 'nl');
    this.setStartup(localStorage.getItem('preferences.startup') === '1');

    this.setCampusMonday(SettingsService.parseIntSafe(localStorage.getItem('preferences.campus1')));
    this.setCampusTuesday(SettingsService.parseIntSafe(localStorage.getItem('preferences.campus2')));
    this.setCampusWednesday(SettingsService.parseIntSafe(localStorage.getItem('preferences.campus3')));
    this.setCampusThursday(SettingsService.parseIntSafe(localStorage.getItem('preferences.campus4')));
    this.setCampusFriday(SettingsService.parseIntSafe(localStorage.getItem('preferences.campus5')));

    try {
      this.setSubscriptions(JSON.parse(localStorage.getItem('preferences.subscriptions') || '{}'));
    } catch (e) {
      this.setSubscriptions({});
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getCampusForToday(): Observable<number | null> {
    switch (moment().isoWeekday()) {
      case 1:
        return this.campus1$;
      case 2:
        return this.campus2$;
      case 3:
        return this.campus3$;
      case 4:
        return this.campus4$;
      case 5:
        return this.campus5$;
    }
    return of(null);
  }

  private static parseIntSafe(value: string | null): number | null {
    if (value === null) {
      return null;
    }
    return parseInt(value, 10);
  }

  private static intToStringSafe(value: number | null): string | null {
    if (value === null) {
      return null;
    }
    return value.toString();
  }

  private static setOption(key: string, value: string | null) {
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, value);
    }
  }

  // ==================================================
  // Cookies acknowledged
  // ==================================================

  private cookiesAcknowledgedBehaviour = new ReplaySubject<boolean>(1);
  private cookiesAcknowledged$ = this.cookiesAcknowledgedBehaviour.asObservable();

  getCookiesAcknowledged(): Observable<boolean> {
    return this.cookiesAcknowledged$;
  }

  setCookiesAcknowledged(cookiesAcknowledged: boolean) {
    SettingsService.setOption('preferences.cookiesAcknowledged', cookiesAcknowledged ? '1' : '0');
    this.cookiesAcknowledgedBehaviour.next(cookiesAcknowledged);
  }

  // ==================================================
  // Language
  // ==================================================

  private languageBehaviour = new ReplaySubject<string>(1);
  private language$ = this.languageBehaviour.asObservable();

  getLanguage(): Observable<string> {
    return this.language$;
  }

  setLanguage(language: string) {
    SettingsService.setOption('preferences.language', language);
    this.languageBehaviour.next(language);
  }

  // ==================================================
  // Startup preferences
  // ==================================================

  private startupBehaviour = new ReplaySubject<boolean>(1);
  private startup$ = this.startupBehaviour.asObservable();

  getStartup(): Observable<boolean> {
    return this.startup$;
  }

  setStartup(startup: boolean) {
    SettingsService.setOption('preferences.startup', startup ? '1' : '0');
    this.startupBehaviour.next(startup);
  }

  // ==================================================
  // Campus Monday
  // ==================================================

  private campus1Behaviour = new ReplaySubject<number | null>(1);
  private campus1$ = this.campus1Behaviour.asObservable();

  getCampusMonday(): Observable<number | null> {
    return this.campus1$;
  }

  setCampusMonday(campus1: number | null) {
    SettingsService.setOption('preferences.campus1', SettingsService.intToStringSafe(campus1));
    this.campus1Behaviour.next(campus1);
  }

  // ==================================================
  // Campus Tuesday
  // ==================================================

  private campus2Behaviour = new ReplaySubject<number | null>(1);
  private campus2$ = this.campus2Behaviour.asObservable();

  getCampusTuesday(): Observable<number | null> {
    return this.campus2$;
  }

  setCampusTuesday(campus2: number | null) {
    SettingsService.setOption('preferences.campus2', SettingsService.intToStringSafe(campus2));
    this.campus2Behaviour.next(campus2);
  }

  // ==================================================
  // Campus Wednesday
  // ==================================================

  private campus3Behaviour = new ReplaySubject<number | null>(1);
  private campus3$ = this.campus3Behaviour.asObservable();

  getCampusWednesday(): Observable<number | null> {
    return this.campus3$;
  }

  setCampusWednesday(campus3: number | null) {
    SettingsService.setOption('preferences.campus3', SettingsService.intToStringSafe(campus3));
    this.campus3Behaviour.next(campus3);
  }

  // ==================================================
  // Campus Thursday
  // ==================================================

  private campus4Behaviour = new ReplaySubject<number | null>(1);
  private campus4$ = this.campus4Behaviour.asObservable();

  getCampusThursday(): Observable<number | null> {
    return this.campus4$;
  }

  setCampusThursday(campus4: number | null) {
    SettingsService.setOption('preferences.campus4', SettingsService.intToStringSafe(campus4));
    this.campus4Behaviour.next(campus4);
  }

  // ==================================================
  // Campus Friday
  // ==================================================

  private campus5Behaviour = new ReplaySubject<number | null>(1);
  private campus5$ = this.campus5Behaviour.asObservable();

  getCampusFriday(): Observable<number | null> {
    return this.campus5$;
  }

  setCampusFriday(campus5: number | null) {
    SettingsService.setOption('preferences.campus5', SettingsService.intToStringSafe(campus5));
    this.campus5Behaviour.next(campus5);
  }

  // ==================================================
  // Subscription settings
  // ==================================================

  private subscriptionsBehaviour = new ReplaySubject<SubscriptionSettings>(1);
  private subscriptions$ = this.subscriptionsBehaviour.asObservable().pipe(
    map((value) => Object.assign({}, value)) // XXX: Make sure changes to the returned value by subscribers does not have side effects
  );

  getSubscriptions(): Observable<SubscriptionSettings> {
    return this.subscriptions$;
  }

  // NOTE: Unless you know what you're doing, don't call this method yourself, instead use the API in SubscriptionService.
  setSubscriptions(subscriptions: SubscriptionSettings) {
    SettingsService.setOption('preferences.subscriptions', JSON.stringify(subscriptions));
    this.subscriptionsBehaviour.next(subscriptions);
  }
}

export type SubscriptionSettings = Record<string, { enabled: boolean, data: unknown }>;
