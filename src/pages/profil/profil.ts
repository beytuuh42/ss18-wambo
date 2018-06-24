import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service'
import { UserController } from '../../providers/api/userController'
import { LoginPage } from '../login/login'

@Component({
  selector: 'page-profil',
  templateUrl: 'profil.html'
})

export class ProfilPage {
likes:number;
dislikes:number;
author:number;
comments:number;
info:any;

  constructor(public navCtrl: NavController, private auth: AuthService, public userController:UserController) {

  }

  ionViewWillEnter(){
    this.doRefresh(null);
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.auth.setUserInfo().then(loaded => {
      if(loaded){
        this.info = this.auth.getUserInfo();
        this.refreshData(this.info._id);
      }
    });
    setTimeout(() => {
      if (refresher) refresher.complete();
    }, 100);
  }

  public logout() {
    this.auth.logout().then(succ => {
      localStorage.removeItem("username");
      localStorage.removeItem("pw");
      this.navCtrl.popToRoot();
      this.navCtrl.push(LoginPage);
    });
  }

  public getLikesAmount(author){
    this.userController.getUserTotalReceivedLikes(author)
      .then((data:any) => {
        if(data.length > 0) {
          this.likes = data[0].total;
        } else {
          this.likes = 0;
        }
      });
  }

  public getDislikesAmount(author){
    this.userController.getUserTotalReceivedDislikes(author)
      .then((data:any) => {
        if(data.length > 0) {
          this.dislikes = data[0].total;
        } else {
          this.dislikes = 0;
        }
      })
  }

  public getCommentsAmount(author){
    this.userController.getUserTotalComments(author)
      .then((data:any) => {
        if(data.length > 0) {
          this.comments = data[0].total;
        } else {
          this.comments = 0;
        }
      })
  }

  refreshData(id){
    this.getLikesAmount(id);
    this.getDislikesAmount(id);
    this.getCommentsAmount(id);
  }

}
