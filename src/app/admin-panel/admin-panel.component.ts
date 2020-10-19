import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {SubscriptionService} from '../service-subscription/subscription.service';
import {finalize} from 'rxjs/operators';
import {CHANNEL_ADMINISTRATION} from '../service-subscription/channels';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent {

  subscriptionState$: Observable<{ subscribed: boolean, subscribable: boolean }>;

  constructor(
    private subscriptionService: SubscriptionService,
  ) {
    this.subscriptionState$ = this.subscriptionService.getChannelSubscriptionState(CHANNEL_ADMINISTRATION);
  }

  unsubscribe() {
    this.subscriptionService.unsubscribeChannel(CHANNEL_ADMINISTRATION)
      .pipe(
        finalize(() => console.log('Unsubscribe done!'))
      )
      .subscribe(value => console.log('Unsubscribe result:', value));
  }

  subscribe() {
    this.subscriptionService.subscribeChannel(CHANNEL_ADMINISTRATION)
      .pipe(
        finalize(() => console.log('Subscribe done!'))
      )
      .subscribe(value => console.log('Subscribe result:', value));
  }
}
