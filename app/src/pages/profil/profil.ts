import { Component } from '@angular/core';
import { App, NavController } from 'ionic-angular';
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
user:string = this.auth.currentUser.username;

  constructor(public navCtrl: NavController, private auth: AuthService, public userController:UserController, public appCtrl: App) {

  }

  /**
    Runs when the page is about to enter and become the active page.
  **/
  ionViewWillEnter(){
    this.doRefresh(null);
  }

  /**
    Current user information is set and profile information are being loaded.
    @param refresher refresher event object
  **/
  doRefresh(refresher) {
    // console.log('Begin async operation', refresher);
    this.info = this.auth.getUserInfo();
    this.refreshData(this.info._id);

    setTimeout(() => {
      if (refresher) refresher.complete();
    }, 100);
  }

  /**
    Performing a logout by removing the token from the localstorage and redirecting
    to the loginpage.
  **/
  public logout() {
    this.auth.logout().then(_ => {
      localStorage.removeItem("tokenId");
      this.appCtrl.getRootNav().push(LoginPage);
    });
  }

  /**
    Retrieving the total likes amount of the current user for displaying on then
    view.
    @param author user id
  **/
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

  /**
    Retrieving the total diuslikes amount of the current user for displaying on then
    view.
    @param author user id
  **/
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

  /**
    Retrieving the total comments amount of the current user for displaying on then
    view.
    @param author user id
  **/
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

  /**
    Executing the functions for retrieving the profil informations.
  **/
  refreshData(id){
    this.getLikesAmount(id);
    this.getDislikesAmount(id);
    this.getCommentsAmount(id);
  }

}
