import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {CampusDayMenuComponent} from './campus-day-menu.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {LanguageLoader} from '../service-settings/language-loader';
import {RouterTestingModule} from '@angular/router/testing';
import {LocalizedDatePipe} from '../localized-date.pipe';
import {ServiceWorkerModule} from '@angular/service-worker';

describe('CampusDayMenuComponent', () => {
  let component: CampusDayMenuComponent;
  let fixture: ComponentFixture<CampusDayMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          defaultLanguage: 'nl',
          loader: {
            provide: TranslateLoader,
            useClass: LanguageLoader
          },
        }),
        RouterTestingModule,
        HttpClientTestingModule,
        ServiceWorkerModule.register('ngsw-worker.js', {enabled: false})
      ],
      declarations: [
        CampusDayMenuComponent,
        LocalizedDatePipe
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampusDayMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
