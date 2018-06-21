
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http'
import { IonicStorageModule } from '@ionic/storage';


import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { ProfilPage } from '../pages/profil/profil';
import { TabsPage } from '../pages/tabs-page/tabs-page';
import { PostPage } from '../pages/post/post';
import { AddPostPage } from '../pages/add-post/add-post';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';

import { HomePageModule } from '../pages/home/home.module'
import { PostPageModule } from '../pages/post/post.module'
import { LoginPageModule } from '../pages/login/login.module';
import { ProfilPageModule } from '../pages/profil/profil.module';
import { AddPostPageModule } from '../pages/add-post/add-post.module';
import { RegisterPageModule } from '../pages/register/register.module';
import { TabsPageModule } from '../pages/tabs-page/tabs-page.module';

import { ApiProvider } from '../providers/api/api'
import { UserController } from '../providers/api/userController'
import { AuthService } from '../providers/auth-service/auth-service';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: true,
      tabsPlacement: 'top',
      platforms: {
        ios: {
          tabsPlacement: 'bottom'
        }
      }
    }),
    BrowserModule,
    HttpModule,
    HomePageModule,
    PostPageModule,
    ProfilPageModule,
    LoginPageModule,
    AddPostPageModule,
    RegisterPageModule,
    TabsPageModule,
    HttpClientModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ProfilPage,
    TabsPage,
    PostPage,
    AddPostPage,
    LoginPage,
    RegisterPage
  ],
  providers: [
    SplashScreen,
    StatusBar,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ApiProvider,
    UserController,
    AuthService
  ]
})
export class AppModule { }
