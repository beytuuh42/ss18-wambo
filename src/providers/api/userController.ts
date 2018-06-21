import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PasswordHandler } from '../../utils/passwordHandler';

let url = "proxy/";
let prefixUsers = "users/";
let prefixEmails = "emails/";
let suffixLikes = "/likes/"
let suffixDislikes = "/dislikes/"
let suffixComments = "/comments/"
let path = "";
let jsonHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

@Injectable()
export class UserController {
pwHandler:PasswordHandler

  constructor(public http: HttpClient) { }

  getUserTotalReceivedLikes(id){
    path = url + prefixUsers + id + suffixLikes;
    return new Promise((resolve,reject) => {
      this.http.get(path).subscribe(data => {
        resolve(data);
      }, err => {
        console.log("Error fetching like amount: " + err.message);
        reject(err);
      });
    });
  }

  getUserTotalReceivedDislikes(id){
    path = url + prefixUsers + id + suffixDislikes;
    return new Promise((resolve, reject) => {
      this.http.get(path).subscribe(data => {
        resolve(data);
      }, err => {
        console.log("Error fetching dislike amount: " + err.message);
        reject(err);
      });
    });
  }

  getUserTotalComments(id){
    path = url + prefixUsers + id + suffixComments;
    return new Promise((resolve, reject) => {
      this.http.get(path).subscribe(data => {
        resolve(data);
      }, err => {
        console.log("Error fetching comment amount: " + err.message);
        reject(err);
      })
    })
  }

  getUserByEmail(email) {
    path = url + prefixEmails + email;
    return new Promise((resolve,reject) => {
      this.http.get<any[]>(path).subscribe(data => {
        resolve(data);
      }, err => {
        console.log("Error fetching user by Email: " + err.message);
        reject(err);
      });
    });
  }

  createUser(data) {
    this.pwHandler = new PasswordHandler(data.password, null);
    data.password = this.pwHandler.encryptPassword();
    console.log(data.password);
    path = url + prefixUsers;
    return new Promise((resolve, reject) => {
      return this.http.post(path, data, {
        headers: jsonHeader,
        observe: 'response'
      })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          console.log("Error creating user: " + err.message);
          reject(err);
        });
    });
  }

}
