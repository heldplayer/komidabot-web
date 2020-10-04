import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MenuOverviewComponent} from './menu-overview.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {LanguageLoader} from '../service-settings/language-loader';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('MenuOverviewComponent', () => {
  let component: MenuOverviewComponent;
  let fixture: ComponentFixture<MenuOverviewComponent>;

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
        HttpClientTestingModule
      ],
      declarations: [ MenuOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
