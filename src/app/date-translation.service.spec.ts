import {TestBed} from '@angular/core/testing';

import {DateTranslationService} from './date-translation.service';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {LanguageLoader} from './service-settings/language-loader';

describe('DateTranslationService', () => {
  let service: DateTranslationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          defaultLanguage: 'nl',
          loader: {
            provide: TranslateLoader,
            useClass: LanguageLoader
          },
        })
      ],
    });
    service = TestBed.inject(DateTranslationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
