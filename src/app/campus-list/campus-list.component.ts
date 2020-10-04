import {Component} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ApiResponse, Campus, ClosingDay, DayClosings} from '../entities';
import {CampusService} from '../campus.service';
import * as moment from 'moment';
import {map, shareReplay, tap} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {dayToIso, getClosedDisplay} from '../utils';
import {SeoCompatible, SeoProvider} from '../seo.service';

@Component({
  selector: 'app-campus-list',
  templateUrl: './campus-list.component.html',
  styleUrls: ['./campus-list.component.scss']
})
export class CampusListComponent implements SeoCompatible {

  campuses$: Observable<ApiResponse<Campus[]>>;
  closingDays$: Observable<ApiResponse<DayClosings>>;

  campusInfo$: Observable<ApiResponse<CampusInfo[]>>;

  constructor(
    private campusService: CampusService,
    private translate: TranslateService,
  ) {
    this.campuses$ = this.campusService.getAllCampuses();

    this.closingDays$ = this.campusService.getClosedCampuses(moment())
      .pipe(
        ApiResponse.startWith(new Map())
      );

    this.campusInfo$ = ApiResponse.combineLatest([
      this.campuses$,
      this.closingDays$
    ])
      .pipe(
        tap(value => console.log('Campus list data:', value)),
        ApiResponse.pipe(
          map(data => {
            const campuses = data[0] as Campus[];
            const closingDays = data[1] as DayClosings;

            return campuses.map(value => ({
              campus: value,
              closed_info: closingDays.get(value.short_name) || null,
            }));
          })
        ),
        shareReplay(1)
      );
  }

  isCampusClosed(campusInfo: CampusInfo) {
    return 'closed_info' in campusInfo && campusInfo.closed_info;
  }

  getCampusSubscript(campusInfo: CampusInfo): string {
    if (this.isCampusClosed(campusInfo)) {
      return getClosedDisplay(this.translate, campusInfo.closed_info, true);
    }
    // return 'Open from 11:45 to 13:45';
    // return 'Open from Monday to Friday';
    // TODO: Opening hours
    return '';
  }

  dayForUrl(day: moment.Moment): string {
    return dayToIso(day);
  }

  translateInformation(campus: CampusInfo): object {
    return {
      campus: campus.campus.name
    };
  }

  get today(): moment.Moment {
    return moment();
  }

  get displayTodayButton(): boolean {
    return moment().isoWeekday() <= 5;
  }

  get seoProvider(): SeoProvider {
    return {
      title: this.translate.get('BROWSER.TITLE.CAMPUS_LIST'),
      description: of(undefined),
    };
  }
}

interface CampusInfo {
  campus: Campus;
  closed_info: ClosingDay | null;
}
