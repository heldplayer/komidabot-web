import {ApplicationRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {MessengerStateInvalid, MessengerStateValid} from '../../lib/facebook-messenger';
import {SwUpdate} from '@angular/service-worker';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss']
})
export class DebugComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  title = 'komidabot-web';

  constructor(
    private app: ApplicationRef,
    private updates: SwUpdate
  ) {
  }

  ngOnInit(): void {
    // subscription = this.updates.activated.subscribe();

    // subscription = interval(1000)
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe(() => this.changeDetector.markForCheck());
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  get location(): string {
    return window.location.pathname + window.location.search + window.location.hash;
  }

  get serviceWorkerStatus(): string {
    return this.updates.isEnabled ? 'ENABLED' : 'DISABLED';
  }

  getStateAsValid(): MessengerStateValid | null {
    return null;
  }

  getStateAsInvalid(): MessengerStateInvalid | null {
    return null;
  }
}
