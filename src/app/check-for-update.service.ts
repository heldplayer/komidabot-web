import {ApplicationRef, Injectable} from '@angular/core';
import {SwUpdate} from '@angular/service-worker';
import {first, tap} from 'rxjs/operators';
import {concat, interval} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckForUpdateService {
  constructor(
    appRef: ApplicationRef,
    updates: SwUpdate
  ) {
    console.log('Starting CheckForUpdateService');

    if (updates.isEnabled) {
      // Allow the app to stabilize first, before starting polling for updates with `interval()`.
      const appIsStable$ = appRef.isStable.pipe(first(isStable => isStable));
      const everyHour$ = interval(60 * 60 * 1000); // Every hour
      const everyHourOnceAppIsStable$ = concat(appIsStable$, everyHour$);

      everyHourOnceAppIsStable$
        .pipe(
          tap(_ => console.log('Checking for updates'))
        )
        .subscribe(() => updates.checkForUpdate().then(available => {
          if (!available) {
            console.log('No update available')
          }
        }));

      updates.versionUpdates.subscribe(event => {
        if (event.type === 'VERSION_READY') {
          console.log('current version is', event.currentVersion);
          console.log('available version is', event.latestVersion);
        }
      });
    }
  }
}
