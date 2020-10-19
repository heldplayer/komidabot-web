import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {SubscriptionService} from '../service-subscription/subscription.service';
import {finalize} from 'rxjs/operators';
import {CHANNEL_DAILY_MENUS} from '../service-subscription/channels';

@Component({
  selector: 'app-subscription-button',
  templateUrl: './subscription-button.component.html',
  styleUrls: ['./subscription-button.component.scss']
})
export class SubscriptionButtonComponent {

  subscriptionState$: Observable<{ subscribed: boolean, subscribable: boolean }>;

  constructor(
    private subscriptionService: SubscriptionService,
  ) {

    this.subscriptionState$ = this.subscriptionService.getChannelSubscriptionState(CHANNEL_DAILY_MENUS);
  }

  unsubscribe() {
    this.subscriptionService.unsubscribeChannel(CHANNEL_DAILY_MENUS)
      .pipe(
        finalize(() => console.log('Unsubscribe done!'))
      )
      .subscribe();
  }

  subscribe() {
    this.subscriptionService.subscribeChannel(CHANNEL_DAILY_MENUS)
      .pipe(
        finalize(() => console.log('Subscribe done!'))
      )
      .subscribe();
  }
}
