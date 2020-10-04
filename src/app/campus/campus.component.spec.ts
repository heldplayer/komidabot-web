import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CampusComponent} from './campus.component';
import {RouterTestingModule} from '@angular/router/testing';
import {ServiceWorkerModule} from '@angular/service-worker';

describe('CampusComponent', () => {
  let component: CampusComponent;
  let fixture: ComponentFixture<CampusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ServiceWorkerModule.register('ngsw-worker.js', {enabled: false})
      ],
      declarations: [CampusComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
