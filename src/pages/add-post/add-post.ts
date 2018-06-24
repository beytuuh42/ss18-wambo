import { Component } from '@angular/core';
import { IonicPage, AlertController, NavController, NavParams, Platform } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api'

@IonicPage()
@Component({
  selector: 'page-add-post',
  templateUrl: 'add-post.html',
})
export class AddPostPage {
  message = { content: ''}
  ancestors: Array<any> = [];

  constructor(public navCtrl: NavController, public params: NavParams, public apiProvider: ApiProvider, platform: Platform, public alertCtrl: AlertController) {
    this.ancestors = params.get('ancestors')
    let backAction = platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
      backAction();
    }, 2)
  }

  sendPost() {
    if(this.message.content == ''){
      this.showError();
    } else {
      this.apiProvider.sendPost(this.message).then((result) => {
        this.apiProvider.pushAncestors(result, this.ancestors).then((x) => {
          this.navCtrl.pop();
        })
      }, (err) => {
        Promise.reject(new Error("Error sending post: " + err.message));
      });
    }

  }

  showError() {
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: "Please enter a message",
      buttons: ['OK']
    });
    alert.present();
  }
}
