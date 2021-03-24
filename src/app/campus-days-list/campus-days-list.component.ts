import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import * as moment from 'moment';
import {CampusService} from '../campus.service';
import {combineLatest, Observable, of, ReplaySubject, Subject} from 'rxjs';
import {distinctUntilChanged, map, startWith, switchMap, takeUntil} from 'rxjs/operators';
import {ApiResponse, ClosingDay, ClosingDays} from '../entities';
import {dayToIso, getClosedDisplay} from '../utils';
import {TranslateService} from '@ngx-translate/core';
import {SeoProvider} from '../seo.service';
import {NavigationTabInfo} from '../tabbed-container/tabbed-container.component';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-days-display',
  templateUrl: './campus-days-list.component.html',
  styleUrls: ['./campus-days-list.component.scss']
})
export class CampusDaysListComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  days$: Observable<DayInfo[]>;
  campusName$: Observable<string>;

  previousWeek: moment.Moment;
  nextWeek: moment.Moment | null;

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

  // INPUT: weekStart
  private weekStartSubject = new ReplaySubject<moment.Moment>(1);
  private _weekStart: moment.Moment;

  @Input()
  set weekStart(value: moment.Moment) {
    this._weekStart = value.clone().startOf('isoWeek');
    this.previousWeek = this._weekStart.clone().subtract(1, 'week');
    if (this._weekStart > moment()) {
      this.nextWeek = null;
    } else {
      this.nextWeek = this._weekStart.clone().add(1, 'week');
    }

    this.weekStartSubject.next(this._weekStart);
  }

  get weekStart(): moment.Moment {
    return this._weekStart;
  }

  constructor(
    private route: ActivatedRoute,
    private campusService: CampusService,
    private translate: TranslateService,
  ) {
    this.days$ = combineLatest([this.campusSubject.asObservable(), this.weekStartSubject.asObservable()])
      .pipe(
        distinctUntilChanged((p, n) => p[0] === n[0] && p[1].isSame(n[1], 'week')),
        switchMap(data => {
          const campus: string = data[0];
          const weekStart: moment.Moment = data[1];

          return this.campusService.getWeekClosingDays(weekStart, campus)
            .pipe(
              ApiResponse.awaitReady<ClosingDays>(),
              startWith([null, null, null, null, null]),
            );
        }),
        map((days: ClosingDays) => days.map((closed, index) => ({
          closed, // shorthand for closed: closed
          day: this.weekStart.clone().add(index, 'days')
        }))),
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
        this.weekStart = 'week' in params ? moment(params.week) : moment().startOf('isoWeek');
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  get displayTabInfo(): NavigationTabInfo {
    return {
      previous: {
        url: ['/campus', this.campus, 'w', dayToIso(this.previousWeek)]
      },
      next: {
        url: this.nextWeek ? ['/campus', this.campus, 'w', dayToIso(this.nextWeek)] : undefined
      },
      title: this.weekDescription
    };
  }

  get days(): moment.Moment[] {
    const weekStart = this.weekStart.startOf('isoWeek');

    const days = [];
    for (let i = 0; i <= 4; i++) {
      days.push(weekStart.clone().add(i, 'days'));
    }

    return days;
  }

  get weekDescription(): Observable<string> | undefined {
    /*
     *                                  now
     *                     v             v             v
     *  ----------------------------------------------------------------------
     *  ^             ^             ^             ^             ^
     *  S PPrev week  S Prev week   S This week   S Next week   S NNext week
     */

    const now = moment();

    if (this.previousWeek <= now && now < this._weekStart) {
      return this.translate.get('WEEK.NEXT');
    }

    if (this.nextWeek === null) {
      return;
    }

    if (this._weekStart <= now && now < this.nextWeek) {
      return this.translate.get('WEEK.CURRENT');
    }

    const nextNextWeek = this.nextWeek.clone().add(1, 'week');

    if (this.nextWeek <= now && now < nextNextWeek) {
      return this.translate.get('WEEK.PREVIOUS');
    }

    return;
  }

  isCampusClosed(info: DayInfo): boolean {
    return info.closed !== null;
  }

  getDaySubscript(info: DayInfo): string {
    return getClosedDisplay(this.translate, info.closed, false);
  }

  dayForUrl(day: moment.Moment): string {
    return dayToIso(day);
  }

  // TODO: Doesn't work 100% correctly, need to look at this further
  get seoProvider(): SeoProvider {
    return {
      title: this.campusName$.pipe(
        switchMap((campusName) =>
          this.translate.get('BROWSER.TITLE.WEEK', {
            campus: campusName
          })
        )
      ),
      description: of(undefined),
    };
  }
}

interface DayInfo {
  day: moment.Moment;
  closed: ClosingDay | null;
}
