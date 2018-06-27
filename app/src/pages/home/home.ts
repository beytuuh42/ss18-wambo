import { Component } from '@angular/core'
import { ModalController, NavController, AlertController, Platform } from 'ionic-angular'
import { Storage } from '@ionic/storage';
import { verifyToken } from '../../utilities/verifyToken'
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
  userId:number;
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

    }, 1);
  }

  /**
    Runs when the page is about to enter and become the active page.
    Verifing the token and fetching the username of it, also fetching posts.
  **/
  ionViewWillEnter(){
    verifyToken(this);
    this.doRefresh(null);
  }

  /**
    Deleting the given post.
    @param post post data
   */
  delete(post) {
    this.apiProvider.deletePostById(post._id)
    .then(data => {
    })
  }

  /**
    Fetching posts.
    @param refresher refresher event object
  **/
  doRefresh(refresher) {
    this.getPosts();
    setTimeout(() => {
      if (refresher) refresher.complete();
    }, 100);
  }

  /**
    Fetching posts, coloring and saving them in the post object.
  **/
  getPosts() {
    this.apiProvider.getPosts()
      .then((data:any) => {
        this.posts = this.apiProvider.setRandomColors(data);
      })
  }

  /**
    Pushing the clicked post into the post page, for rendering as the parent.
    @param post post object
  **/
  pushParams(post) {
    this.navCtrl.push(PostPage, { 'post': post });
  }

  /**
    Displaying add post page.
  **/
  pushAddPost() {
    this.navCtrl.push(AddPostPage);
  }

  /**
    Popping a message box and fetching posts.
  **/
  addPost() {
    let addPostmodal = this.modalCtrl.create(AddPostPage)
    addPostmodal.onDidDismiss(() => {
      this.getPosts();
    })
    addPostmodal.present()
  }

  /**
    Displaying message boxes.
    1. If user is sure to delete the post
    2. That the user can only delete his own post.
    @param post post object
  **/
  presendDelete(post) {
    let alert = this.alertCtrl.create({
      title: 'Confirm delete',
      message: 'Do you want to delete this?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            if(post.author == this.auth.currentUser._id){
              this.delete(post);
              this.doRefresh(null);
            } else {
              let innerAlert = this.alertCtrl.create({
                title: 'Fail',
                subTitle: "You can only delete your own posts",
                buttons: ['OK']
              });
              innerAlert.present();
            }
          }
        }
      ]
    });
    alert.present();
  }

  /**
    Fetching comments and saving in the comments object.
  **/
  getComments() {
    this.apiProvider.getComments()
      .then(data => {
        this.comments = data;
      });
  }

  /**
    Creating a new post and pushing it's ancestors.
  **/
  sendPost() {
    this.apiProvider.sendPost(this.message).then((result:any) => {
      this.apiProvider.pushAncestors(result, result.body.ancestors).then((abc) => {
      })
    }, (err) => {
      Promise.reject(new Error("Error sending post: " + err.message));
    });
  }

  /**
    Incrementing the likes of a post.
    @param post post object
  **/
  incrementLike(post) {
    this.apiProvider.incrementLike(post._id, this.userId).then((result:any) => {
      post.likes = result.body.likes;

      // this.posts.find(x => x._id === post._id).likes = result.body.likes;
    }, (err) => {
      Promise.reject(new Error("Error incremending like: " + err.message));
    });
  }

  /**
    Incrementing the dilikes of a post.
    @param post post object
  **/
  incrementDislike(post) {
    this.apiProvider.incrementDislike(post._id, this.userId).then((result:any) => {
        post.dislikes = result.body.dislikes;
      // this.posts.find(x => x._id === post._id).dislikes = result.body.dislikes;
    }, (err) => {
      Promise.reject(new Error("Error incremending dislike: " + err.message));
    });
  }

}
