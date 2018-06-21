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

  constructor(public navCtrl: NavController, private auth: AuthService, public userController:UserController) {
    let info = this.auth.getUserInfo();
    this.getLikesAmount(info._id);
    this.getDislikesAmount(info._id);
    this.getCommentsAmount(info._id);
  }

  public logout() {
    this.auth.logout().subscribe(succ => {
      this.navCtrl.popToRoot();
      this.navCtrl.push(LoginPage);
    });
  }

  public getLikesAmount(author){
    this.userController.getUserTotalReceivedLikes(author)
      .then((data:any) => {
        console.log(data[0].total);
        this.likes = data[0].total;
      });
  }

  public getDislikesAmount(author){
    this.userController.getUserTotalReceivedDislikes(author)
      .then((data:any) => {
        console.log(data[0].total);
        this.dislikes = data[0].total;
      })
  }

  public getCommentsAmount(author){
    this.userController.getUserTotalComments(author)
      .then((data:any) => {
        console.log(data[0].total);
        this.comments = data[0].total;
      })
  }

}
