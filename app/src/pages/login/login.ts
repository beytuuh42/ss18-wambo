import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, IonicPage } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service'
import { TabsPage } from '../tabs-page/tabs-page'
import { RegisterPage } from '../register/register'

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loading: Loading;
  registerCredentials = { username: '', password: '' };
  constructor(private nav: NavController, private auth: AuthService, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {

  }

  /**
    Redirecting to the register page.
  **/
  public createAccount() {
    this.nav.push(RegisterPage);
  }
  /**
    Showing a loading animation while checking if the credentials were correct.
    On success, redirecting to the home page, if not popping an alert.
  **/
  public login() {
    this.showLoading()
    this.auth.login(this.registerCredentials).then(allowed => {
      if (allowed) {
        this.nav.setRoot(TabsPage);
      } else {
        this.showError("Error", "Wrong credentials.");
      }
    },
      error => {
        this.showError("Error", "Wrong credentials.");
      });
  }

  /**
    Creating a loading animation.
  **/
  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  /**
    Dismissing the loading animation
    Creates a new alert with the given params.
    Redirecting to login page, if the register was successful.
    @param title title of the pop up message
    @param text text of the pop up message
   */
  showError(title, text) {
    this.loading.dismiss();

    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }
}
