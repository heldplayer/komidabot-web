import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SplashScreenComponent} from './splash-screen.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {LanguageLoader} from '../service-settings/language-loader';

describe('SplashScreenComponent', () => {
  let component: SplashScreenComponent;
  let fixture: ComponentFixture<SplashScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          defaultLanguage: 'nl',
          loader: {
            provide: TranslateLoader,
            useClass: LanguageLoader
          },
        })
      ],
      declarations: [SplashScreenComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SplashScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
