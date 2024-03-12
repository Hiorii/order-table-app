import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { IsLoginGuard } from './guards/is-login.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [IsLoginGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [IsLoginGuard] },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule {}
