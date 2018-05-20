import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api'

@IonicPage()
@Component({
  selector: 'page-add-post',
  templateUrl: 'add-post.html',
})
export class AddPostPage {
  message = { content: '' }

  sendPost() {
    console.log(this.message);
    this.apiProvider.sendPost(this.message).then((result) => {
      this.navCtrl.pop();
      console.log(result);

    }, (err) => {
      console.log(err);
    });
  }


  constructor(public navCtrl: NavController, public navParams: NavParams, public apiProvider: ApiProvider) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPostPage');
  }

}
