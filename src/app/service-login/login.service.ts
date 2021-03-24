import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AppConfig, CONFIG_TOKEN} from '../service-app-config/app-config.service';
import {HttpClient} from '@angular/common/http';
import {BaseApiResponse} from '../entities';
import {catchError, map} from 'rxjs/operators';

const httpGetOptions = {};

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient,
    @Inject(CONFIG_TOKEN) private config: AppConfig,
  ) {
  }

  isLoggedIn(): Observable<boolean> {
    return this.http.get<AuthorizedApiResponse>(`${this.config.api.authorized_endpoint}`, httpGetOptions)
      .pipe(
        map((response) => response.status === 200),
        catchError((_) => [false])
      );
  }

  getLogin(): Observable<Login> {
    return this.http.get<AuthorizedApiResponse>(`${this.config.api.authorized_endpoint}`, httpGetOptions)
      .pipe(
        map((response) => ({loggedIn: response.status === 200, roles: response.roles || []})),
        catchError((_) => [{loggedIn: false, roles: []}])
      );
  }

  rolesRequired(...roles: string[]): Observable<boolean> {
    return this.http.get<AuthorizedApiResponse>(`${this.config.api.authorized_endpoint}`, httpGetOptions)
      .pipe(
        map((response) => {
          if ('roles' in response && response.roles) {
            for (const role of roles) {
              if (!(role in response.roles)) {
                return false
              }
            }
            return true;
          }
          return false;
        }),
        catchError((_) => [false])
      );
  }
}

export interface Login {
  loggedIn: boolean;
  roles: string[];
}

interface AuthorizedApiResponse extends BaseApiResponse {
  roles?: string[];
}
