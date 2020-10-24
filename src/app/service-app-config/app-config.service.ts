import {Injectable, InjectionToken} from '@angular/core';
import {default as configJsonDev} from './config-dev.json';
import {default as configJson} from './config.json';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  private appConfig: AppConfig;

  constructor() {
    const config = (environment.production ? configJson : configJsonDev) as AppConfig;

    console.log('App config:', config);

    this.appConfig = config;
  }

  get(): AppConfig {
    return this.appConfig;
  }
}

export const CONFIG_TOKEN = new InjectionToken<AppConfig>('App Configuration');

export interface AppConfig {
  fb_appId: string;
  vapid_publicKey: string;
  subscriptions_endpoint: string;
  api_endpoint: string;
  api: {
    authorized_endpoint: string;
    login_endpoint: string;
    subscription_endpoint: string;
  };
}
