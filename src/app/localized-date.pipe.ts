import {Pipe, PipeTransform} from '@angular/core';
import {DateTranslationService} from './date-translation.service';

@Pipe({
  name: 'localizedDate'
})
export class LocalizedDatePipe implements PipeTransform {

  constructor(
    private service: DateTranslationService,
  ) {
  }

  transform(value: any, capitalize?: boolean, pattern?: string): string | null {
    return this.service.transform(value, capitalize, pattern);
  }
}
