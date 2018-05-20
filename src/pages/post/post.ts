import { Component} from '@angular/core';
import { IonicPage, NavParams, Platform, NavController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api'
/**
 * Generated class for the PostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {
  post: any;
  comment = {content: ''};
    constructor(public apiProvider: ApiProvider, public params: NavParams,platform: Platform, public navCtrl: NavController) {
      let backAction =  platform.registerBackButtonAction(() => {
        console.log("second");
        this.navCtrl.pop();
        backAction();
      },2)
      this.post = params.get('post');
      console.log(this.post);
    }



    addComment(){
      let body = {content: this.comment.content, parent: this.post._id}
      console.log(JSON.stringify(this.comment.content))
      this.apiProvider.sendPost(body).then((result) => {

        console.log(result);

      }, (err) => {
        console.log(err);
      });
    }
}
