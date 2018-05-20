import { Component } from '@angular/core'
import { ModalController, NavController, AlertController, Platform } from 'ionic-angular'
import { Storage } from '@ionic/storage';


import { PostPage } from '../post/post'
import { ApiProvider } from '../../providers/api/api'
import { AddPostPage } from '../add-post/add-post'


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',

})
export class HomePage {
  comments: any
  posts: any
  // colors: Array<string> = ['#d5e5ff', '#ffd5ee', '#d5ffe6', '#d5e5ff', '#d5fff7']

  constructor(public modalCtrl: ModalController, public navCtrl: NavController, public apiProvider: ApiProvider,
     public alertCtrl: AlertController,public storage: Storage, platform: Platform) {
       platform.registerBackButtonAction(() => {
         console.log("backPressed 1");
       },1);

    this.getPosts();

}

  delete(post) {
    this.apiProvider.deletePostById(post._id).subscribe((response) => {
    this.getPosts()
    console.log("deletePostById said: "+response);
  });
  }

  doRefresh(refresher) {
     console.log('Begin async operation', refresher);
     this.getPosts();
     setTimeout(() => {
       console.log('Async operation has ended');
       refresher.complete();
     }, 100);
   }

  //get only Posts
  getPosts() {
    this.posts = [];
    this.apiProvider.getComments()
      .then(data => {
        this.comments = data;
        this.comments.forEach((x: any) => {
          if (x.parent == null) {
            x.color=this.getRandomColor();
            this.posts.push(x);
            console.log("get post:"+ JSON.stringify(x));
          }
        })
      })
  }

//PostDetails push
  pushParams(post) {
      console.log(post);
        this.navCtrl.push(PostPage, { 'post': post });
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
              console.log('Post deleted');
            }
          }
        ]
      });
      alert.present();
    }

  getRandomColor() {
    let randomColor = "hsl(" + 360 * Math.random() + ',' +
                 (20 + 70 * Math.random()) + '%,' +
                 (73 + 10 * Math.random()) + '%)';
    return(randomColor)
}
  }
