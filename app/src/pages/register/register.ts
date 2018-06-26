
import { Component } from '@angular/core';
import { NavController, AlertController, IonicPage } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  createSuccess = false;
  registerCredentials = { username: '', password: '' };

  constructor(private nav: NavController, private auth: AuthService, private alertCtrl: AlertController) { }


  /**
    Sends register credentials to the operating function.
    Popping a message box with the success information.
   */
  public register() {
    this.auth.register(this.registerCredentials).then(success => {
      if (success) {
        this.createSuccess = true;
        this.showPopup("Success", "Account created.");
      } else {
        this.showPopup("Error", "Problem creating account.");
      }
    },
      error => {
        this.showPopup("Error", error);
      });
  }

  /**
    Creates a new alert with the given params.
    Redirecting to login page, if the register was successful.
    @param title title of the pop up message
    @param text text of the pop up message
   */
  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            if (this.createSuccess) {
              //this.nav.popToRoot();
              this.nav.setRoot('LoginPage');
            }
          }
        }
      ]
    });
    alert.present();
  }
}
