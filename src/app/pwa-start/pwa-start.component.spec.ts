import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {PwaStartComponent} from './pwa-start.component';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {LanguageLoader} from '../service-settings/language-loader';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('PwaStartComponent', () => {
  let component: PwaStartComponent;
  let fixture: ComponentFixture<PwaStartComponent>;

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
        HttpClientTestingModule
      ],
      declarations: [PwaStartComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PwaStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
