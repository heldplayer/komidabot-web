import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AppConfigService} from '../service-app-config/app-config.service';
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
    private configService: AppConfigService,
  ) {
  }

  doLogin(username: string, password: string): Observable<boolean> {
    console.log('Login', username, password);

    const body = {username, password};

    return this.http.post<SecureApiResponse>(`${this.configService.get().api_secure.login_endpoint}?ngsw-bypass`, body, httpPostOptions)
      .pipe(
        map((response) => response.status === 200),
        catchError((_) => [false])
      );
  }

  isLoggedIn(): Observable<boolean> {
    return this.http.get<SecureApiResponse>(`${this.configService.get().api_secure.authorized_endpoint}?ngsw-bypass`, httpGetOptions)
      .pipe(
        map((response) => response.status === 200),
        catchError((_) => [false])
      );
  }
}
