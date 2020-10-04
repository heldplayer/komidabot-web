import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CampusListComponent} from './campus-list.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {LanguageLoader} from '../service-settings/language-loader';
import {RouterTestingModule} from '@angular/router/testing';

describe('CampusListComponent', () => {
  let component: CampusListComponent;
  let fixture: ComponentFixture<CampusListComponent>;

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
      declarations: [
        CampusListComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
