import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {AppConfig, CONFIG_TOKEN} from '../service-app-config/app-config.service';
import {Subject, timer} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  constructor(
    @Inject(CONFIG_TOKEN) private config: AppConfig,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    const base = new URL(window.location.protocol + '//' + window.location.host);
    console.log('Base URL:', base.toString());
    const next = new URL(this.route.snapshot.queryParamMap.get('next') || '/', base);
    console.log('Next URL:', next.toString());

    const redirectUrl = new URL(this.config.api.login_endpoint, base);

    if (next.host !== base.host || next.protocol !== base.protocol) {
      console.error('Next URL is not on the same domain!');
    } else {
      redirectUrl.searchParams.set('next', next.pathname + next.search + next.hash);
    }

    console.log('Redirect URL:', redirectUrl.toString());

    timer(500).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      window.location.replace(redirectUrl.toString());
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
