import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TabbedContainerComponent} from './tabbed-container.component';

describe('TabbedContainerComponent', () => {
  let component: TabbedContainerComponent;
  let fixture: ComponentFixture<TabbedContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabbedContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabbedContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
