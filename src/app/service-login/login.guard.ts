import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {LoginService} from './login.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private router: Router,
    private loginService: LoginService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    const loginData = route.data.login || {};

    return this.loginService.getLogin().pipe(
      map((login) => {
        if (!login.loggedIn) {
          return this.router.createUrlTree(['/login'], {queryParams: {next: getResolvedUrl(route)}});
        }
        for (const role of (loginData.roles || [])) {
          if (!login.roles.includes(role)) {
            return this.router.createUrlTree(['/login', 'no_permission']);
          }
        }
        return true;
      })
    );
  }
}

function getResolvedUrl(route: ActivatedRouteSnapshot): string {
  return route.pathFromRoot
    .map(v => v.url.map(segment => segment.toString()).filter(value => value !== '').join('/'))
    .join('/');
}
