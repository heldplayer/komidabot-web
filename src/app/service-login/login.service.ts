import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AppConfig, CONFIG_TOKEN} from '../service-app-config/app-config.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {SecureApiResponse} from '../entities';
import {catchError, map} from 'rxjs/operators';

const httpGetOptions = {};
const httpPostOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient,
    @Inject(CONFIG_TOKEN) private config: AppConfig,
  ) {
  }

  doLogin(username: string, password: string): Observable<boolean> {
    const body = {username, password};

    return this.http.post<SecureApiResponse>(`${this.config.api_secure.login_endpoint}?ngsw-bypass`, body, httpPostOptions)
      .pipe(
        map((response) => response.status === 200),
        catchError((_) => [false])
      );
  }

  isLoggedIn(): Observable<boolean> {
    return this.http.get<SecureApiResponse>(`${this.config.api_secure.authorized_endpoint}?ngsw-bypass`, httpGetOptions)
      .pipe(
        map((response) => response.status === 200),
        catchError((_) => [false])
      );
  }
}
