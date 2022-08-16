import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { QRCodeModule } from 'angularx-qrcode';
import { AgmCoreModule } from '@agm/core';

import {
  FacebookLoginProvider,
  SocialLoginModule,
  SocialAuthServiceConfig,
  GoogleLoginProvider,
} from 'angularx-social-login';

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
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { StatisticComponent } from './statistic/statistic.component';
import { AdminComponent } from './admin/admin.component';
import { DrawerDesignComponent } from './drawer-design/drawer-design.component';
import { ListDesignComponent } from './list-design/list-design.component';
import { RegisterVerifyComponent } from './register-verify/register-verify.component';

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
    CreateProfileComponent,
    StatisticComponent,
    AdminComponent,
    DrawerDesignComponent,
    ListDesignComponent,
    RegisterVerifyComponent,
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
    QRCodeModule,
    SocialLoginModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyDWTx7bREpM5B6JKdbzOvMW-RRlhkukmVE",
      libraries: ["places", "geometry"]
  }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }, 
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('744716950059120'),
          },
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('716469277461-al1ds3lmgi6r7s9lm5ggs2idaqfpjp6r.apps.googleusercontent.com',
            {
              scope:'email',
              plugin_name:'google'
             })
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
