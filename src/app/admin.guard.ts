import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AppConfig, AppConfigService} from './service-app-config/app-config.service';
import {catchError, concatMap, map} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {SecureApiResponse} from './entities';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private configService: AppConfigService,
    private translate: TranslateService,
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.configService.config.pipe(
      concatMap((config) => {
        return new Observable<AppConfig>(subscriber => {
          const frame = document.createElement('iframe');
          frame.setAttribute('csp', `default-src 'self'; style-src 'self' 'unsafe-inline'`);
          frame.style.position = 'absolute';
          frame.style.left = '-1000px';
          frame.style.top = '-1000px';
          frame.style.width = '1px';
          frame.style.height = '1px';
          frame.addEventListener('load', () => {
            const response = frame.contentDocument?.documentElement.innerText;
            frame.remove();

            if (response) {
              try {
                const parsed = JSON.parse(response) as SecureApiResponse;
                console.log(parsed);
                if (parsed.status === 200) {
                  subscriber.next(config);
                  subscriber.complete();
                  return;
                }
              } catch (e) {
              }
            }
            subscriber.error();
            subscriber.complete();
          });
          frame.src = `${config.api_secure_endpoint}authorized?ngsw-bypass`;

          document.body.appendChild(frame);
        });
      }),
      map((_) => true),
      catchError((_) => {
        alert(this.translate.instant('ADMIN.ACCESS_DENIED'));
        return [false];
      })
    );
  }
}
