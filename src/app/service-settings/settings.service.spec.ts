import {TestBed} from '@angular/core/testing';

import {SettingsService} from './settings.service';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {LanguageLoader} from './language-loader';

describe('SettingsService', () => {
  let service: SettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          defaultLanguage: 'nl',
          loader: {
            provide: TranslateLoader,
            useClass: LanguageLoader
          },
        }),
      ]
    });
    service = TestBed.inject(SettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
