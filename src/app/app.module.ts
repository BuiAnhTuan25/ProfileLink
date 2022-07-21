import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LinksComponent } from './links/links.component';
import { DesignComponent } from './design/design.component';
import { SettingsComponent } from './settings/settings.component';
import { RegisterComponent } from './register/register.component';
import { DemoComponent } from './demo/demo.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { NgZorroAntdModule } from './ng-zorro-antd.module';
import { HomeComponent } from './home/home.component';
import { AuthInterceptor } from './_helpers/auth.interceptor';
import { SocialsComponent } from './socials/socials.component';
import { ThemesComponent } from './themes/themes.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LinksComponent,
    PageNotFoundComponent,
    RegisterComponent,
    DesignComponent,
    DemoComponent,
    SettingsComponent,
    HomeComponent,
    SocialsComponent,
    ThemesComponent,
    ChangePasswordComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    NgZorroAntdModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
