import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ActivatedRoute, ParamMap} from '@angular/router';

@Component({
  selector: 'app-login-error',
  templateUrl: './login-error.component.html',
  styleUrls: ['./login-error.component.scss']
})
export class LoginErrorComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.route.paramMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params: ParamMap) => {
        const error = params.get('error');
        if (error) {
          this.errorMessage = 'LOGIN.ERROR.' + error.toUpperCase();
        } else {
          this.errorMessage = '';
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
