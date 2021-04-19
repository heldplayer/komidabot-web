import {TestBed, waitForAsync} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {DebugComponent} from './debug.component';
import {ServiceWorkerModule} from '@angular/service-worker';

describe('DebugComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ServiceWorkerModule.register('ngsw-worker.js', {enabled: false})
      ],
      declarations: [
        DebugComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(DebugComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'komidabot-web'`, () => {
    const fixture = TestBed.createComponent(DebugComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('komidabot-web');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(DebugComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain('komidabot-web app is running!');
  });
});
