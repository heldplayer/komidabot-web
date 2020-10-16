import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AppConfig, CONFIG_TOKEN} from './service-app-config/app-config.service';


const httpPostOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'my-auth-token'
  })
};

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(
    @Inject(CONFIG_TOKEN) private config: AppConfig,
    private http: HttpClient,
  ) {
  }

  subscriptionRemoved() {
    // Do anything special?
  }

  subscriptionCreated(subscription: PushSubscription): Observable<any> {
    console.log('Created subscription:', subscription);
    console.log(JSON.stringify(subscription.toJSON()));

    const subscriptionJson = subscription.toJSON();
    const data = {
      subscription: {
        endpoint: subscriptionJson.endpoint,
        keys: subscriptionJson.keys,
        days: [3, 3, 3, 3, 3]
      }
    };

    return this.http.post<any>(this.config.subscriptions_endpoint, data, httpPostOptions);
  }
}
