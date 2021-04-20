import {Component} from '@angular/core';
import {SettingsService} from '../service-settings/settings.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-cookie-banner',
  templateUrl: './cookie-banner.component.html',
  styleUrls: ['./cookie-banner.component.scss']
})
export class CookieBannerComponent {

  acknowledged$: Observable<boolean>;

  constructor(
    private settings: SettingsService,
  ) {
    this.acknowledged$ = this.settings.getCookiesAcknowledged();
  }

  acknowledgeCookies() {
    this.settings.setCookiesAcknowledged(true);
  }

}
