import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DaysDisplayComponent} from './days-display.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {LanguageLoader} from '../../service-settings/language-loader';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {LocalizedDatePipe} from '../../localized-date.pipe';
import {ServiceWorkerModule} from '@angular/service-worker';

describe('DaysDisplayComponent', () => {
  let component: DaysDisplayComponent;
  let fixture: ComponentFixture<DaysDisplayComponent>;

  beforeEach(async(() => {
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
        DaysDisplayComponent,
        LocalizedDatePipe
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaysDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
