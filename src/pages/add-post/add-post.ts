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

  /**
    Retrieving the ancestors parameter which was send when this view has been created.
    Popping the view when clicking on the back button.
  **/
  constructor(public navCtrl: NavController, public params: NavParams, public apiProvider: ApiProvider, platform: Platform, public alertCtrl: AlertController) {
    this.ancestors = params.get('ancestors')
    let backAction = platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
      backAction();
    }, 2)
  }


  /**
    Creating a new comment with the message content and the ancestor array, Popping
    the view from the stack afterwards.
    Checks if the message is empty and pops a message box if so.
    @param title title of the pop up message
    @param text text of the pop up message
   */
  sendPost() {
    if(this.message.content == ''){
      this.showError('Fail', 'Please enter a message');
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

  /**
    Creates a new alert with the given params.
    @param title title of the pop up message
    @param text text of the pop up message
   */
  showError(title,text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }
}
