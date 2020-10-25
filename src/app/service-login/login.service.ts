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
    return this.http.get<BaseApiResponse>(`${this.config.api.authorized_endpoint}`, httpGetOptions)
      .pipe(
        map((response) => response.status === 200),
        catchError((_) => [false])
      );
  }
}
