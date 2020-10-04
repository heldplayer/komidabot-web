import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {DebugComponent} from './debug/debug.component';
import {AppComponent} from './app.component';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {ErrorPageComponent} from './error-page/error-page.component';
import {AppConfigService} from './service-app-config/app-config.service';
import {HttpClientModule} from '@angular/common/http';
import {CampusComponent} from './campus/campus.component';
import {SplashScreenComponent} from './splash-screen/splash-screen.component';
import {PwaStartComponent} from './pwa-start/pwa-start.component';
import {CampusListComponent} from './campus-list/campus-list.component';
import {SubscriptionButtonComponent} from './subscription-button/subscription-button.component';
import {DaysDisplayComponent} from './campus/days-display/days-display.component';
import {MenuDisplayComponent} from './campus/menu-display/menu-display.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {registerLocaleData} from '@angular/common';
import localeEn from '@angular/common/locales/en';
import localeFr from '@angular/common/locales/fr';
import localeNl from '@angular/common/locales/nl';
import {LocalizedDatePipe} from './localized-date.pipe';
import {ImageListComponent} from './image-list/image-list.component';
import {SettingsComponent} from './settings/settings.component';
import {MenuOverviewComponent} from './menu-overview/menu-overview.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {LanguageLoader} from './service-settings/language-loader';


registerLocaleData(localeEn, 'en');
registerLocaleData(localeFr, 'fr');
registerLocaleData(localeNl, 'nl');

@NgModule({
  declarations: [
    AppComponent,
    DebugComponent,
    ErrorPageComponent,
    MenuDisplayComponent,
    CampusComponent,
    SplashScreenComponent,
    PwaStartComponent,
    CampusListComponent,
    SubscriptionButtonComponent,
    DaysDisplayComponent,
    LocalizedDatePipe,
    ImageListComponent,
    SettingsComponent,
    MenuOverviewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    TranslateModule.forRoot({
      defaultLanguage: 'nl',
      loader: {
        provide: TranslateLoader,
        useClass: LanguageLoader
      },
    }),
    FontAwesomeModule,
  ],
  providers: [
    // FacebookMessengerService,
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [AppConfigService],
      useFactory: (configService: AppConfigService) => {
        return () => {
          return configService.loadAppConfig();
        }
      }
    },
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
