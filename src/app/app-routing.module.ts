import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { DemoComponent } from './demo/demo.component';
import { DesignComponent } from './design/design.component';
import { HomeComponent } from './home/home.component';
import { LinksComponent } from './links/links.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RegisterComponent } from './register/register.component';
import { SettingsComponent } from './settings/settings.component';
import { AuthGuard } from './_shared/auth.guard';
import { AdminActive } from './_shared/admin.guard';
import { RegisterVerifyComponent } from './register-verify/register-verify.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'links', component: LinksComponent, canActivate: [AuthGuard] },
  { path: 'design', component: DesignComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'register-verify/:code', component: RegisterVerifyComponent },
  { path: 'create-profile', component: CreateProfileComponent },
  { path: 'update_password_token', component: ChangePasswordComponent },
  { path: 'demo/:short_bio', component: DemoComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AdminActive] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
