import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PasswordHandler } from '../../utils/passwordHandler';

let url = "proxy/";
let prefixUsers = "users/";
let prefixUsernames = "usernames/";
let suffixLikes = "/likes/"
let suffixDislikes = "/dislikes/"
let suffixComments = "/comments/"
let path = "";
let jsonHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

@Injectable()
export class UserController {
pwHandler:PasswordHandler

  constructor(public http: HttpClient) { }

  getUserById(id) {
    path = url + prefixUsers + id;
    return new Promise((resolve,reject) => {
      this.http.get<any[]>(path).subscribe(data => {
        resolve(data);
      }, err => {
        reject(new Error("Error fetching user by username: " + err.message));
      });
    });
  }

  getUserTotalReceivedLikes(id){
    path = url + prefixUsers + id + suffixLikes;
    return new Promise((resolve,reject) => {
      this.http.get(path).subscribe(data => {
        resolve(data);
      }, err => {
        reject(new Error("Error fetching like amount: " + err.message));
      });
    });
  }

  getUserTotalReceivedDislikes(id){
    path = url + prefixUsers + id + suffixDislikes;
    return new Promise((resolve, reject) => {
      this.http.get(path).subscribe(data => {
        resolve(data);
      }, err => {
        reject(new Error("Error fetching dislike amount: " + err.message));
      });
    });
  }

  getUserTotalComments(id){
    path = url + prefixUsers + id + suffixComments;
    return new Promise((resolve, reject) => {
      this.http.get(path).subscribe(data => {
        resolve(data);
      }, err => {
        reject(new Error("Error fetching comment amount: " + err.message));
      })
    })
  }

  getUserByUsername(username) {
    path = url + prefixUsernames + username;
    return new Promise((resolve,reject) => {
      this.http.get<any[]>(path).subscribe(data => {
        resolve(data);
      }, err => {
        reject(new Error("Error fetching user by username: " + err.message));
      });
    });
  }

  createUser(data) {
    this.pwHandler = new PasswordHandler(data.password, null);
    data.password = this.pwHandler.encryptPassword();
    path = url + prefixUsers;
    return new Promise((resolve, reject) => {
      return this.http.post(path, data, {
        headers: jsonHeader,
        observe: 'response'
      })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(new Error("Error creating user: " + err.message));
        });
    });
  }

}
