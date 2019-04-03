import { Routes } from '@angular/router';
import { AuthGuard } from './admin/services';

export const appRoutes: Routes = [
  {
    path: 'admin', loadChildren: './admin/admin.module#AdminModule'
  }, {
    path: '',
    loadChildren: './dashboard/dashboard.module#DashboardModule',
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/' }
];
