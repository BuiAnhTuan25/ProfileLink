import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DemoComponent } from './demo/demo.component';
import { DesignComponent } from './design/design.component';
import { HomeComponent } from './home/home.component';
import { LinksComponent } from './links/links.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RegisterComponent } from './register/register.component';
import { SettingsComponent } from './settings/settings.component';
import { AuthGuard } from './_shared/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'links', component: LinksComponent, canActivate: [AuthGuard] },
  { path: 'design', component: DesignComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'demo/:short_bio', component: DemoComponent},
  { path: 'home', component: HomeComponent , canActivate: [AuthGuard]},
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
