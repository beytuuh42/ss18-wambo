import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs-page/tabs-page';



@Component({
  selector: 'app',
  templateUrl: 'app.template.html'
})
export class MyApp {
  token = localStorage.getItem('tokenId');

  rootPage:any = (this.token) ? TabsPage : LoginPage;
  //rootPage:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {

      // if(this.user && this.pw) {
      //   this.rootPage = TabsPage;
      // } else {
      //   this.rootPage = LoginPage
      // }

      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
