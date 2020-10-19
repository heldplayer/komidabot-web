import {Injectable, InjectionToken} from '@angular/core';
import {default as configJsonDev} from './config-dev.json';
import {default as configJson} from './config.json';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  private appConfig: AppConfig;

  constructor() {
  }

  loadAppConfig(): Promise<any> {
    const queryParams = getQueryParams();
    const isDev = queryParams.has('dev') && queryParams.get('dev') === 'true';

    const config = (isDev ? configJsonDev : configJson) as AppConfig;

    console.log('App config:', config);

    this.appConfig = config;

    return Promise.resolve(this.appConfig);
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

function getQueryParams(): Map<string, string> {
  const result = new Map<string, string>();
  const query = window.location.search;
  const pairs = (query[0] === '?' ? query.substring(1) : query).split('&');

  pairs.forEach(value => {
    const pair = value.split('=', 2);
    result.set(decodeURIComponent(pair[0]), decodeURIComponent(pair[1] || ''));
  });

  return result;
}
