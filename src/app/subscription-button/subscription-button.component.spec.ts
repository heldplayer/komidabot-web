import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SubscriptionButtonComponent} from './subscription-button.component';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ServiceWorkerModule} from '@angular/service-worker';

describe('SubscriptionButtonComponent', () => {
  let component: SubscriptionButtonComponent;
  let fixture: ComponentFixture<SubscriptionButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ServiceWorkerModule.register('ngsw-worker.js', {enabled: false})
      ],
      declarations: [SubscriptionButtonComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
