
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http'


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ProfilPage } from '../pages/profil/profil';
import { TabsPage } from '../pages/tabs-page/tabs-page';
import { PostPage } from '../pages/post/post';
import { HomePageModule} from '../pages/home/home.module'
import { PostPageModule} from '../pages/post/post.module'
import { ApiProvider } from '../providers/api/api';


@NgModule({
  declarations: [
    MyApp,
    ProfilPage,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    BrowserModule,
    HttpModule,
    HomePageModule,
    PostPageModule,
    HttpClientModule

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ProfilPage,
    TabsPage,
    PostPage,
  ],
  providers: [
    SplashScreen,
    StatusBar,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiProvider]
})
export class AppModule {}
