import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AppConfigService} from '../service-app-config/app-config.service';
import {map} from 'rxjs/operators';
import {LoginService} from './login.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private router: Router,
    private configService: AppConfigService,
    private loginService: LoginService,
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.loginService.isLoggedIn().pipe(
      map((value) => {
        if (value) {
          return true;
        }
        return this.router.createUrlTree(['/login'], {queryParams: {next: getResolvedUrl(route)}});
      })
    );
  }
}

function getResolvedUrl(route: ActivatedRouteSnapshot): string {
  return route.pathFromRoot
    .map(v => v.url.map(segment => segment.toString()).filter(value => value !== '').join('/'))
    .join('/');
}
