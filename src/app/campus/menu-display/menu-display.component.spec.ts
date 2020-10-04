import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MenuDisplayComponent} from './menu-display.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {LanguageLoader} from '../../service-settings/language-loader';
import {RouterTestingModule} from '@angular/router/testing';
import {LocalizedDatePipe} from '../../localized-date.pipe';
import {ServiceWorkerModule} from '@angular/service-worker';

describe('MenuDisplayComponent', () => {
  let component: MenuDisplayComponent;
  let fixture: ComponentFixture<MenuDisplayComponent>;

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
        MenuDisplayComponent,
        LocalizedDatePipe
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
