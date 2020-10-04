import {TranslateLoader} from '@ngx-translate/core';
import {Observable, of, throwError} from 'rxjs';
import {default as langEn} from './i18n/en.json';
import {default as langNl} from './i18n/nl.json';
import {default as langFr} from './i18n/fr.json';


export class LanguageLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    switch (lang) {
      case 'en':
        return of(langEn);
      case 'nl':
        return of(langNl);
      case 'fr':
        return of(langFr);
      default:
        return throwError(`Missing translation for language "${lang}"`);
    }
  }
}
