import { Component } from '@angular/core';
import { IonicPage, NavParams, Platform, NavController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api'

@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {
  post: any;
  comment = { content: '' };
  comments: Array<any> = [];
  constructor(public apiProvider: ApiProvider, public params: NavParams, platform: Platform, public navCtrl: NavController) {
    let backAction = platform.registerBackButtonAction(() => {
      console.log("second");
      this.navCtrl.pop();
      backAction();
    }, 2)
    this.post = params.get('post');
    this.getComments();
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.getComments();
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 100);
  }

  addComment() {
    this.apiProvider.sendPost(this.comment).then((result) => {
      this.apiProvider.pushAncestors(result, this.post.ancestors).then((x) => {
        console.log(result);
      })
    }, (err) => {
      console.log("Error adding comment: " + err.message);
    });
  }

  incrementLike(comment) {
    this.apiProvider.incrementLike(comment._id);
  }

  incrementDislike(comment) {
    this.apiProvider.incrementDislike(comment._id);
  }

  getComments(){
    this.apiProvider.getAllChildrenByParent(this.post._id)
      .then(data => {
        this.comments = this.apiProvider.setRandomColors(data);
      });
  }

  pushParams(comment) {
    this.navCtrl.push(PostPage, { 'post': comment });
  }
}
