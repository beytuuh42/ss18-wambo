import { Component } from '@angular/core';
import { IonicPage, NavParams, Platform, NavController, ModalController, AlertController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api'
import { UserController } from '../../providers/api/userController'
import { AddPostPage } from '../add-post/add-post'
import { AuthService } from '../../providers/auth-service/auth-service'
import { verifyToken } from '../../utilities/verifyToken'

@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {
  post: any = [];
  user: String = ""
  comment = { content: '' };
  comments: Array<any> = [];
  id:String;
  userId:number

  constructor(public apiProvider: ApiProvider, public params: NavParams, platform: Platform, public navCtrl: NavController, public modalCtrl: ModalController, public alertCtrl: AlertController,
  public userController: UserController, public auth: AuthService) {
    this.id = params.get('post');
    // this.getPostById(this.id);
    let backAction = platform.registerBackButtonAction(() => {
      this.navCtrl.pop();
      backAction();
    }, 2)

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
    Fetching post by ID.
    @param refresher refresher event object
  **/
  doRefresh(refresher) {
    this.getPostById(this.id);
    setTimeout(() => {
      if(refresher) refresher.complete()
    }, 100);
  }

  /**
    Deleting posts by ID and refreshing posts.
    @param post post object
  **/
  delete(post) {
    this.apiProvider.deletePostById(post._id).then(data => {
      this.getPosts();
      this.doRefresh(null);
    })
  }

  /**
    Fetching post by id and the author for displaying the creator of the post.
    Refreshing post and comments object.
    @param id id of the post
  **/
  getPostById(id){
  this.apiProvider.getCommentById(id)
    .then((data:any) => {
      this.getUsernameById(data.author).then(userdata => {
        data.username = userdata;
      });
      this.post = this.apiProvider.setRandomColor(data);
      this.getComments();
    },  (err) => {
      Promise.reject(new Error("Error fetching post by ID: " + err.message));
    });

  }

  /**
    Fetching posts.
  **/
  getPosts() {
    this.apiProvider.getPosts()
      .then(data => {
        this.post = this.apiProvider.setRandomColor(data);
      })
  }

  /**
    Creating a comment and pushing it's ancestors.
  **/
  addComment() {
    this.apiProvider.sendPost(this.comment).then((result) => {
      this.apiProvider.pushAncestors(result, this.post.ancestors).then((x) => {
      })
    }, (err) => {
      Promise.reject(new Error("Error adding comment: " + err.message));
    });
  }

  /**
    Incrementing the likes of a comment.
    @param comment comment object
  **/
  incrementLike(comment) {
    this.apiProvider.incrementLike(comment._id, this.userId).then((result:any) => {
      comment.likes = result.body.likes;
    }, (err) => {
      Promise.reject(new Error("Error incremending like: " + err.message));
    });
  }

  /**
    Incrementing the likes of a comment.
    @param comment comment object
  **/
  incrementDislike(comment) {
    this.apiProvider.incrementDislike(comment._id, this.userId).then((result:any) => {
      comment.dislikes = result.body.dislikes;
    }, (err) => {
      Promise.reject(new Error("Error incremending dilike: " + err.message));
    });
  }

  getComments(){
    this.apiProvider.getAllChildrenByParent(this.post._id)
      .then((data:any) => {
        data.forEach((x: any) => {
          this.getUsernameById(x.author).then(userdata => {
            x.username = userdata;
          });
        });
        this.comments = this.apiProvider.setRandomColors(data);
      })
      .catch(err => {
        Promise.reject(new Error("Error fetching comments: " + err.message));
      });
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
    Pushing the clicked post into the post page, for rendering as the parent.
    @param post post object
  **/
  pushParams(post) {
    this.navCtrl.push(PostPage, { 'post': post });
  }

  /**
    Displaying add post page.
  **/
  pushAddPost(ancestors) {
    this.navCtrl.push(AddPostPage, { 'ancestors': ancestors });
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
            if(post.author == this.userId){
              this.delete(post);
              // console.log('Post deleted');
              this.doRefresh(null);
            } else {
              let innerAlert = this.alertCtrl.create({
                title: 'Fail',
                subTitle: "You can only delete your own posts",
                buttons: ['OK']
              });
              innerAlert.present();
              this.doRefresh(null);
            }
            if(post._id == this.id){
              this.navCtrl.pop();
            }
            // console.log('Post deleted');
          }
        }
      ]
    });
    alert.present();
  }

  /**
    Fetching username by the user id.
    @param id id object
  **/
  public getUsernameById(id):Promise<String>{
    return this.userController.getUserById(id)
      .then((data:any) => {
        return data.username;
      }, (err) => {
        return Promise.reject(new Error("Error fetching username by ID: " + err.message));
      });
  }
}
