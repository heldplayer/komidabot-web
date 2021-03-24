import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AboutComponent} from './about/about.component';
import {AdminPanelComponent} from './admin-panel/admin-panel.component';
import {CampusDaysListComponent} from './campus-days-list/campus-days-list.component';
import {CampusDayMenuComponent} from './campus-day-menu/campus-day-menu.component';
import {CampusListComponent} from './campus-list/campus-list.component';
import {DebugComponent} from './debug/debug.component';
import {ErrorPageComponent} from './error-page/error-page.component';
import {ImageListComponent} from './image-list/image-list.component';
import {LoginComponent} from './login/login.component';
import {LoginErrorComponent} from './login/error/login-error.component';
import {LoginGuard} from './service-login/login.guard';
import {MenuOverviewComponent} from './menu-overview/menu-overview.component';
import {PwaStartComponent} from './pwa-start/pwa-start.component';
import {SettingsComponent} from './settings/settings.component';


const routes: Routes = [
  {path: '', component: CampusListComponent, pathMatch: 'full'},
  {path: 'pwa_start', component: PwaStartComponent, pathMatch: 'full'},
  {path: 'debug', component: DebugComponent},
  {path: 'about', component: AboutComponent},
  // {path: 'error-page', component: ErrorPageComponent},
  {path: 'images', component: ImageListComponent},
  {path: 'settings', component: SettingsComponent},
  {path: 'overview/:date', component: MenuOverviewComponent},
  {path: 'campus/:campus/d/:date', component: CampusDayMenuComponent},
  {path: 'campus/:campus/w/:week', component: CampusDaysListComponent},
  {path: 'campus/:campus', component: CampusDaysListComponent},
  {path: 'login/:error', component: LoginErrorComponent},
  {path: 'login', component: LoginComponent},
  {path: 'admin', component: AdminPanelComponent, canActivate: [LoginGuard], data: {login: {roles: ['admin']}}},
  {path: '**', component: ErrorPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
