import { Component } from '@angular/core'
import { ModalController, NavController, AlertController, Platform } from 'ionic-angular'
import { Storage } from '@ionic/storage';

import { PostPage } from '../post/post'
import { ApiProvider } from '../../providers/api/api'
import { AddPostPage } from '../add-post/add-post'
import { AuthService } from '../../providers/auth-service/auth-service'
import { UserController } from '../../providers/api/userController'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  comments: any;
  posts: any[];
  message = {
    content: ''
  }
  val = 10;
  // colors: Array<string> = ['#d5e5ff', '#ffd5ee', '#d5ffe6', '#d5e5ff', '#d5fff7']

  constructor(public modalCtrl: ModalController,
              public navCtrl: NavController,
              public apiProvider: ApiProvider,
              public userController: UserController,
              public alertCtrl: AlertController,
              public storage: Storage,
              public auth: AuthService,
              platform: Platform) {
    platform.registerBackButtonAction(() => {
      //console.log("backPressed 1");
    }, 1);
  }

  ionViewWillEnter(){
    this.doRefresh(null);
  }

  delete(post) {
    this.apiProvider.deletePostById(post._id)
    .then(data => {
      console.log("deletePostById said: " + data);
    })
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.getPosts();
    setTimeout(() => {
      if (refresher) refresher.complete();
    }, 100);
  }

  getPosts() {
    this.apiProvider.getPosts()
      .then((data:any) => {
        this.posts = this.apiProvider.setRandomColors(data);
      })
  }

  //PostDetails push
  pushParams(post) {
    this.navCtrl.push(PostPage, { 'post': post });
  }

  pushAddPost() {
    this.navCtrl.push(AddPostPage);
  }

  addPost() {
    let addPostmodal = this.modalCtrl.create(AddPostPage)
    addPostmodal.onDidDismiss(() => {
      this.getPosts();
    })
    addPostmodal.present()
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
            this.doRefresh(null);
            console.log('Post deleted');
          }
        }
      ]
    });
    alert.present();
  }

  getComments() {
    this.apiProvider.getComments()
      .then(data => {
        this.comments = data;
      });
  }

  sendPost() {
    this.apiProvider.sendPost(this.message).then((result:any) => {
      this.apiProvider.pushAncestors(result, result.body.ancestors).then((abc) => {
      })
    }, (err) => {
      Promise.reject(new Error("Error sending post: " + err.message));
    });
  }

  incrementLike(post) {
    this.apiProvider.incrementLike(post._id).then((result:any) => {
      post.likes = result.body.likes;
      // this.posts.find(x => x._id === post._id).likes = result.body.likes;
    }, (err) => {
      Promise.reject(new Error("Error incremending like: " + err.message));
    });
  }

  incrementDislike(post) {
    this.apiProvider.incrementDislike(post._id).then((result:any) => {
        post.dislikes = result.body.dislikes;
      // this.posts.find(x => x._id === post._id).dislikes = result.body.dislikes;
    }, (err) => {
      Promise.reject(new Error("Error incremending dislike: " + err.message));
    });
  }
}
