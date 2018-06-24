import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserController } from '../api/userController';

export class User {
  _id: any;
  username: string;

  constructor(name: any, username: string) {
    this._id = name;
    this.username = username;
  }
}

@Injectable()
export class AuthService {
  currentUser: User;
  exists:Boolean;
  user = localStorage.getItem('username');
  pw = localStorage.getItem('pw');

  constructor(public http: HttpClient, public userController: UserController) {
  }

  public login(credentials) {
    if (credentials.username === null || credentials.password === null) {
      //return Observable.throw("Please insert credentials");
      return Promise.reject(new Error("Please insert credentials"));
    } else {
      return new Promise((resolve, reject) => {
        this.userController.login(credentials.username,credentials.password)
          .then((data:any) => {
            if(data.success) {
              this.storeSession(data.token);
              resolve(true);
            }
            reject(false);
          })
      })
      }
  }

  public register(credentials) {
    return new Promise((resolve, reject) => {
      if (credentials.username === null || credentials.password === null) {
        reject(new Error("Please insert credentials"));
      }
      this.userExists(credentials.username)
        .then(data => {
          if(data != true){
            if (credentials.password.length < 8) {
              reject(new Error("Password needs a minimum length of 8."));
            }
            resolve(this.userController.createUser(credentials));
          } else {
            reject(new Error("Username already in use."));
          }
        })
        .catch(err => {
          reject(new Error("Error signing up: " + err.message));
        });
    })
  }

  public getUserInfo(){
    return this.currentUser;
  }

  public setUserInfo(user){
    return new Promise((resolve, reject)=>{
      if(user){
        this.userController.getUserByUsername(user)
          .then((data:any) => {
            this.currentUser = new User(data._id,data.username);
            resolve(true);
          })
          .catch(err => {
            reject(new Error("Error setting current user: " + err.message));
          })
      }
    })
  }

  public logout() {
    return new Promise((resolve) => {
      this.currentUser = null;
      resolve(true);
    })
  }

  public userExists(username:String):Promise<Boolean>{
    return this.userController.getUserByUsername(username)
      .then(data => {
        if(data != null){
          return true;
        } else {
          return false;
        }
      })
      .catch(err => {
        return Promise.reject(new Error("User exists: " + err.message));
      })
  }

  storeSession(token){
    localStorage.setItem('tokenId', token);
    //localStorage.setItem('user', authResult.user);
  }
}
