import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AppConfigService} from './service-app-config/app-config.service';
import {catchError, concatMap, map} from 'rxjs/operators';
import {SecureApiResponse} from './entities';
import {TranslateService} from '@ngx-translate/core';

const httpGetOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private http: HttpClient,
    private configService: AppConfigService,
    private translate: TranslateService,
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.configService.config.pipe(
      concatMap(config => {
        return this.http.get<SecureApiResponse>(`${config.api_secure_endpoint}authorized?ngsw-bypass`, httpGetOptions);
      }),
      map((_) => true),
      catchError((_) => {
        alert(this.translate.instant('ADMIN.ACCESS_DENIED'));
        return [false];
      })
    );
  }
}
