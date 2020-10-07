import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ApiResponse, ClosingDay, courseIcons, CourseSubType, CourseType, MenuItem} from '../entities';
import {combineLatest, Observable, of, ReplaySubject, Subject} from 'rxjs';
import {distinctUntilChanged, map, startWith, switchMap, takeUntil} from 'rxjs/operators';
import {CampusService} from '../campus.service';
import * as moment from 'moment';
import {dayToIso, getClosedDisplay, getNextWeekDay, getPreviousWeekDay} from '../utils';
import {TranslateService} from '@ngx-translate/core';
import {SeoCompatible, SeoProvider} from '../seo.service';
import {NavigationTabInfo} from '../tabbed-container/tabbed-container.component';
import {DateTranslationService} from '../date-translation.service';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-campus-day-menu',
  templateUrl: './campus-day-menu.component.html',
  styleUrls: ['./campus-day-menu.component.scss']
})
export class CampusDayMenuComponent implements OnInit, OnDestroy, SeoCompatible {
  private unsubscribe$ = new Subject<void>();

  menuInfo$: Observable<ApiResponse<MenuInfo>>;
  campusName$: Observable<string>;

  weekStart: moment.Moment;
  previousDay: moment.Moment;
  nextDay: moment.Moment | null;

  // INPUT: campus
  private campusSubject = new ReplaySubject<string>(1);
  private _campus: string;

  @Input()
  set campus(value: string) {
    this._campus = value;
    this.campusSubject.next(value);
  }

  get campus(): string {
    return this._campus;
  }

  // INPUT: day
  private daySubject = new ReplaySubject<moment.Moment>(1);
  private _day: moment.Moment;

  @Input()
  set day(value: moment.Moment) {
    this.weekStart = value.clone().startOf('isoWeek');

    this._day = value.clone();
    this.previousDay = getPreviousWeekDay(this._day);
    if (this.weekStart > moment() && this._day.isoWeekday() >= 5) {
      this.nextDay = null;
    } else {
      this.nextDay = getNextWeekDay(this._day);
    }

    this.daySubject.next(this._day);
  }

  get day(): moment.Moment {
    return this._day;
  }

  get language() {
    return this.translate.currentLang;
  }

  constructor(
    private route: ActivatedRoute,
    private campusService: CampusService,
    private translate: TranslateService,
    private dateTranslation: DateTranslationService,
  ) {
    this.menuInfo$ = combineLatest([this.campusSubject.asObservable(), this.daySubject.asObservable()])
      .pipe(
        distinctUntilChanged((p, n) => p[0] === n[0] && p[1].isSame(n[1], 'day')),
        switchMap(data => {
          const campus: string = data[0];
          const day: moment.Moment = data[1];

          return ApiResponse.combineLatest([
            this.campusService.getMenuForDay(day, campus),
            this.campusService.getCampusClosed(day, campus)
          ]);
        }),
        ApiResponse.pipe(
          map(data => {
            const menu: MenuItem[] = data[0];
            const closed: ClosingDay | null = data[1];

            return {
              menu,
              closed
            };
          })
        )
      );

    this.campusName$ = this.campusSubject.asObservable()
      .pipe(
        switchMap(campus => this.campusService.getCampus(campus)
          .pipe(
            ApiResponse.awaitReady(),
            map(campusInfo => campusInfo.name),
            startWith(campus),
          )
        ),
      );
  }

  ngOnInit() {
    this.route.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params: Params) => {
        this.campus = params.campus;
        this.day = moment(params.date);
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  get displayTabInfo(): NavigationTabInfo {
    const title = this.dateTranslation.transform(this.day.toDate(), true);
    return {
      previous: {
        url: ['/campus', this.campus, 'd', dayToIso(this.previousDay as moment.Moment)],
        description: this.translate.get('MENU.PREVIOUS_DAY.LABEL')
      },
      next: {
        url: this.nextDay ? ['/campus', this.campus, 'd', dayToIso(this.nextDay as moment.Moment)] : undefined,
        description: this.translate.get('MENU.NEXT_DAY.LABEL')
      },
      title: title !== '' ? of(title) : undefined,
      titleDescription: title !== '' ? this.translate.get('MENU.DESCRIPTION', {date: title}) : undefined
    };
  }

  getIconURL(item: MenuItem): string {
    return courseIcons[item.course_type as CourseType][item.course_sub_type as CourseSubType];
  }

  getIconDescription(item: MenuItem): string {
    return `COURSE_ICON.DESCRIPTION.${item.course_type}.${item.course_sub_type}`
  }

  getTranslation(item: MenuItem): string {
    if (this.translate.currentLang === 'nl') {
      return item.translation.nl || 'Missing translation';
    } else {
      return item.translation.en || item.translation.nl || 'Missing translation';
    }
  }

  getPriceDisplay(item: MenuItem): string {
    if (item.price_students) {
      if (item.price_staff) {
        return `${item.price_students}\xa0/\xa0${item.price_staff}`;
      }
      return `${item.price_students}`;
    } else {
      return '';
    }
  }

  getPriceDescription(item: MenuItem): string {
    if (item.price_students) {
      if (item.price_staff) {
        return 'COURSE.PRICE.DESCRIPTION.STUDENTS_AND_STAFF';
      }
      return 'COURSE.PRICE.DESCRIPTION.STUDENTS_ONLY';
    } else {
      return 'COURSE.PRICE.DESCRIPTION.NONE';
    }
  }

  getClosedDisplay(menuInfo: MenuInfo): string {
    return getClosedDisplay(this.translate, menuInfo.closed, true);
  }

  get isMenuProvisional(): boolean {
    const now = moment();
    return this.weekStart > now && now.isoWeekday() <= 4;
  }

  get seoProvider(): SeoProvider {
    return {
      title: this.campusName$.pipe(
        switchMap((campusName) =>
          this.day != null ?
            this.translate.get('BROWSER.TITLE.MENU', {
              campus: campusName,
              date: this.dateTranslation.transform(this.day.toDate(), true)
            }) : of(null)
        )
      ),
      description: of(undefined),
    };
  }
}

interface MenuInfo {
  menu: MenuItem[];
  closed: ClosingDay | null;
}
