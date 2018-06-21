import { Component } from '@angular/core';
import { IonicPage, NavParams, Platform, NavController, ModalController, AlertController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api'
import { AddPostPage } from '../add-post/add-post'

@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {
  post: any = [];
  comment = { content: '' };
  comments: Array<any> = [];
  id;

  constructor(public apiProvider: ApiProvider, public params: NavParams, platform: Platform, public navCtrl: NavController, public modalCtrl: ModalController, public alertCtrl: AlertController) {
    //console.log(params.get('post'))
    this.id = params.get('post')
    this.getPostById(this.id);
    let backAction = platform.registerBackButtonAction(() => {
      //console.log("second");
      this.navCtrl.pop();
      backAction();
    }, 2)

  }

  ionViewWillEnter(){
    this.doRefresh(null);
  }

  doRefresh(refresher) {
    this.getComments()
    this.getPostById(this.id)
    setTimeout(() => {
      if(refresher) refresher.complete()
    }, 100);
  }

  delete(post) {
    this.apiProvider.deletePostById(post._id).then(data => {
      this.getPosts();
      this.doRefresh(null);
      console.log("deletePostById said");
      console.log(data);
    })
  }
  getPostById(id){
  this.apiProvider.getCommentById(id)
    .then(data => {
      this.post = this.apiProvider.setRandomColor(data);
      this.getComments();
    },  (err) => {
      console.log("getPostById error: " + err) });
    }

  getPosts() {
    this.apiProvider.getPosts()
      .then(data => {
        this.post = this.apiProvider.setRandomColor(data);
      })
  }

  addComment() {
    console.log("Add comment")
    this.apiProvider.sendPost(this.comment).then((result) => {
      this.apiProvider.pushAncestors(result, this.post.ancestors).then((x) => {
        console.log(this.post.ancestors);
      })
    }, (err) => {
      console.log("Error adding comment: " + err.message);
    });
  }

  incrementLike(comment) {
    this.apiProvider.incrementLike(comment._id).then((result:any) => {
      //console.log("increment : " + JSON.stringify(result))
      // this.post.likes = result.body.likes;
      comment.likes = result.body.likes;
    }, (err) => {
      console.log("Error incremending like: " + err.message);
    });
  }

  incrementDislike(comment) {
    this.apiProvider.incrementDislike(comment._id).then((result:any) => {
      //console.log("increment : " + JSON.stringify(result))
      comment.dislikes = result.body.dislikes;
    }, (err) => {
      console.log("Error incremending like: " + err.message);
    });
    // this.getPosts();
  }

  getComments(){
    this.apiProvider.getAllChildrenByParent(this.post._id)
      .then(data => {
        //console.log(data)
        this.comments = this.apiProvider.setRandomColors(data);
      });
  }

  addPost() {
    let addPostmodal = this.modalCtrl.create(AddPostPage)
    addPostmodal.onDidDismiss(() => {
      this.getPosts();
    })
    addPostmodal.present()
  }

  pushParams(post) {
    //console.log(JSON.stringify(post))
    this.navCtrl.push(PostPage, { 'post': post });
  }

  pushAddPost(ancestors) {
    this.navCtrl.push(AddPostPage, { 'ancestors': ancestors });
  }

  //delete confirm alert
  presendDelete(post) {
    let alert = this.alertCtrl.create({
      title: 'Confirm delete',
      message: 'Do you want to delete this?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.delete(post);
            if(post._id == this.id){
              this.navCtrl.pop();
            }
            console.log('Post deleted');
          }
        }
      ]
    });
    alert.present();
  }
}
