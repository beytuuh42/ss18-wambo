import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserController } from '../api/userController';
import { PasswordHandler } from '../../utils/passwordHandler';

import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/map';

export class User {
  _id: any;
  email: string;

  constructor(name: any, email: string) {
    this._id = name;
    this.email = email;
  }
}

let url = "proxy/";
let prefixUsers = "users";
let path = "";
let jsonHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

@Injectable()
export class AuthService {
  currentUser: User;
  pwHandler:PasswordHandler;

  constructor(public http: HttpClient, public userController: UserController) {
  }

  public login(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
        this.userController.getUserByEmail(credentials.email)
          .then((data:any) => {
            if(data == null){
              return false;
            } else {
              this.pwHandler = new PasswordHandler(credentials.password, data.password);
              let access = this.pwHandler.isValidPassword();
              this.currentUser = new User(data._id, data.email);
              console.log(this.currentUser);
              return access;
            }
          })
          .then(access => {
            observer.next(access);
            observer.complete();
          });
      });
    }
  }

  public register(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      if (!this.isEmail(credentials.email)) {
        return Observable.throw("Please insert valid credentials.\n Correct E-Mail format: 'random@email.de'.");
      }
      if (credentials.password.length < 8) {
        return Observable.throw("Please insert valid credentials.\n Password needs a length of minimum 8.");
      }
      return Observable.create(observer => {
        this.userController.createUser(credentials);
        observer.next(true);
        observer.complete();
      });
    }
  }

  public getUserInfo(): User {
    return this.currentUser;
  }

  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }

  public isEmail(email: string) {
    var re = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
    return re.test(email);
  }
}
