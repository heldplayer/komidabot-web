import {Injectable, OnDestroy} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, of, ReplaySubject, Subject} from 'rxjs';
import {switchMap, takeUntil} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class SeoService implements OnDestroy {
  private unsubscribe$ = new Subject<void>();

  private provider = new ReplaySubject<SeoProvider | undefined>(0);

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private title: Title,
    private meta: Meta,
    private translate: TranslateService,
  ) {

    const appConfig$ = this.provider.asObservable()
      .pipe(
        takeUntil(this.unsubscribe$)
      );

    appConfig$
      .pipe(
        switchMap((provider: SeoProvider | undefined) => provider?.title || of(undefined))
      )
      .subscribe((pageTitle: string | undefined) => {
        this.updateTitle(pageTitle);
      });

    appConfig$
      .pipe(
        switchMap((provider: SeoProvider | undefined) => provider?.description || of(undefined))
      )
      .subscribe((description: string | undefined) => {
        this.updateDescription(description);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  setActiveComponent(component: unknown) {
    console.log(component);
    if (isSeoCompatible(component)) {
      this.provider.next(component.seoProvider);
    } else {
      this.provider.next(undefined);
    }
  }

  updateTitle(title?: string) {
    console.log('Setting title to ', title);
    if (title) {
      this.title.setTitle(title);
    } else {
      this.title.setTitle(this.translate.instant('BROWSER.TITLE.DEFAULT'));
    }
  }

  updateDescription(description?: string) {
    console.log('Setting description to ', description);
    if (description) {
      this.meta.updateTag({name: 'description', content: description});
    } else {
      // this.meta.removeTag('name="description"');
      this.meta.updateTag({name: 'description', content: this.translate.instant('BROWSER.DESCRIPTION.DEFAULT')});
    }
  }
}

function isSeoCompatible(component: any): component is SeoCompatible {
  return 'seoProvider' in component;
}

export interface SeoCompatible {
  seoProvider: SeoProvider;
}

export interface SeoProvider {
  title: Observable<string | undefined>;
  description: Observable<string | undefined>;
}
