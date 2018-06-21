import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api'

@IonicPage()
@Component({
  selector: 'page-add-post',
  templateUrl: 'add-post.html',
})
export class AddPostPage {
  message = { content: ''}
  ancestors: Array<any> = [];

  constructor(public navCtrl: NavController, public params: NavParams, public apiProvider: ApiProvider, platform: Platform) {
    this.ancestors = params.get('ancestors')
    let backAction = platform.registerBackButtonAction(() => {
      console.log("second");
      this.navCtrl.pop();
      backAction();
    }, 2)
  }

  sendPost() {
    //console.log(JSON.stringify(this.message) + "  sendposttest mit ancestor jo  " + this.params.get('ancestor'))
    this.apiProvider.sendPost(this.message).then((result) => {
      this.apiProvider.pushAncestors(result, this.ancestors).then((x) => {
        this.navCtrl.pop();
      })
    }, (err) => {
      console.log("Error sending post");
      console.log(err.message);
    });
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad AddPostPage');
  }
}
