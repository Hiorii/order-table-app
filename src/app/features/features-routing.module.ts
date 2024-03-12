import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './authentication/guards/auth.guard';

const routes: Routes = [
  {
    path: 'authentication',
    loadChildren: () => import('./authentication/authentication.module').then((m) => m.AuthenticationModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then((m) => m.SettingsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'cat-facts',
    loadChildren: () => import('./cat-facts/cat-facts.module').then((m) => m.CatFactsModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'cat-facts'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeaturesRoutingModule {}
