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
import {SplashScreenComponent} from './splash-screen/splash-screen.component';
import {PwaStartComponent} from './pwa-start/pwa-start.component';
import {CampusListComponent} from './campus-list/campus-list.component';
import {SubscriptionButtonComponent} from './subscription-button/subscription-button.component';
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
import {TabbedContainerComponent} from './tabbed-container/tabbed-container.component';
import {CampusDayMenuComponent} from './campus-day-menu/campus-day-menu.component';
import {CampusDaysListComponent} from './campus-days-list/campus-days-list.component';
import {AdminPanelComponent} from './admin-panel/admin-panel.component';


registerLocaleData(localeEn, 'en');
registerLocaleData(localeFr, 'fr');
registerLocaleData(localeNl, 'nl');

@NgModule({
  declarations: [
    AdminPanelComponent,
    AppComponent,
    CampusDayMenuComponent,
    CampusDaysListComponent,
    CampusListComponent,
    DebugComponent,
    ErrorPageComponent,
    ImageListComponent,
    LocalizedDatePipe,
    MenuOverviewComponent,
    PwaStartComponent,
    SettingsComponent,
    SplashScreenComponent,
    SubscriptionButtonComponent,
    TabbedContainerComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FontAwesomeModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    TranslateModule.forRoot({
      defaultLanguage: 'nl',
      loader: {
        provide: TranslateLoader,
        useClass: LanguageLoader
      },
    }),
  ],
  providers: [
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
