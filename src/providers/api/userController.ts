import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';


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

  constructor(public http: HttpClient) { }

  /**
   * Making an http get request to the url in the path variable for retrieving
   * the user.
   * @param id userid
   * @returns promise object
   */
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

  /**
   * Making an http get request to the url in the path variable for retrieving
   * the total likes amount of the user.
   * @param id userid
   * @returns promise object
   */
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

  /**
   * Making an http get request to the url in the path variable for retrieving
   * the total dislikes amount of the user.
   * @param id userid
   * @returns promise object
   */
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

  /**
   * Making an http get request to the url in the path variable for retrieving
   * the total comments amount of the user.
   * @param id userid
   * @returns promise object
   */
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

  /**
   * Making an http get request to the url in the path variable for retrieving
   * the user data by the username.
   * @param username username
   * @returns promise object
   */
  getUserByUsername(username) {
    path = url + prefixUsernames + username;
    return new Promise((resolve,reject) => {
      return this.http.get<any[]>(path, {
        headers:jsonHeader,
        observe: 'response',
        withCredentials: true
      })
        .subscribe(res => {
          resolve(res.body);
        }, (err) => {
          reject(new Error("Error creating user: " + err.message));
        });
    });
  }

  /**
   * Making an http post request to the url in the path variable for retrieving
   * the authentification token.
   * @param username username
   * @param password password
   * @returns promise object
   */
  login(username:string,password:string){
    path = url + "auth/login";
    return new Promise((resolve, reject) => {
      return this.http.post<any>(path,{username,password})
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(new Error("Error resolving login request: " + err.message));
        })
    })

  }

  /**
   * Making an http post request to the url in the path variable for creating
   * a new user.
   * @param data contains username and password
   * @returns promise object
   */
  createUser(data) {
    path = url + prefixUsers;
    return new Promise((resolve, reject) => {
      return this.http.post(path, data, {
        headers: jsonHeader,
        observe: 'response'
      })
        .subscribe(res => {
          console.log(res);
          resolve(res);
        }, (err) => {
          reject(new Error("Error creating user: " + err.message));
        });
    });
  }

}
