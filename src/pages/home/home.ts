import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';


import { PostPage } from '../post/post';
import { ApiProvider } from '../../providers/api/api';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',

})
export class HomePage {
  comments: any;
  posts: any[] = [];
  message = { content: '' }

  onRemovePost(post) {
    this.apiProvider.deletePostById(post._id).subscribe((response) => {
    console.log("deleted");
  });
  }

  getComments() {
    this.apiProvider.getComments()
      .then(data => {
        this.comments = data;
      });
  }

  doRefresh(refresher) {
     console.log('Begin async operation', refresher);
     this.getPosts();
     setTimeout(() => {
       console.log('Async operation has ended');
       refresher.complete();
     }, 1000);
   }


  //get only Posts
  getPosts() {
    this.apiProvider.getComments()
      .then(data => {
        this.comments = data;
        this.comments.forEach((x: any) => {
          if (x.parent == null) {
            this.posts.push(x);
            console.log("get post:"+ x);
          }
        })
      })
  }

  sendPost() {
    console.log(this.message);
    this.apiProvider.sendPost(this.message).then((result) => {
      console.log(result);
    }, (err) => {
      console.log(err);
    });
  }


  pushParams(post) {
      console.log(post);
        this.navCtrl.push(PostPage, { 'post': post });
      }




  constructor(public navCtrl: NavController, public apiProvider: ApiProvider) {
    this.getPosts();
}
  }
