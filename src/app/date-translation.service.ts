import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DatePipe} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DateTranslationService {
  private datePipe: DatePipe;

  constructor(
    private translateService: TranslateService,
  ) {
    this.datePipe = new DatePipe(this.translateService.currentLang);
    this.translateService.onLangChange.subscribe(() => {
      this.datePipe = new DatePipe(this.translateService.currentLang);
    })
  }

  transform(value: Date, capitalize?: boolean, pattern?: string): string {
    if (!pattern) {
      pattern = 'EEEE d MMMM';
    }

    let result = this.datePipe.transform(value, pattern);
    if (capitalize && result) {
      result = result.charAt(0).toUpperCase() + result.slice(1);
    }
    return result || '';
  }
}
