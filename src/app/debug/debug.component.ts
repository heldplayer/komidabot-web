import {ApplicationRef, Component} from '@angular/core';
import {SwUpdate} from '@angular/service-worker';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss']
})
export class DebugComponent {
  title = 'komidabot-web';

  constructor(
    private app: ApplicationRef,
    private updates: SwUpdate
  ) {
  }

  get location(): string {
    return window.location.pathname + window.location.search + window.location.hash;
  }

  get serviceWorkerStatus(): string {
    return this.updates.isEnabled ? 'ENABLED' : 'DISABLED';
  }
}
