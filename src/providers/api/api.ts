import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
/*
  Ge*nerated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

let url = "proxy/"

@Injectable()
export class ApiProvider {

  constructor(public http: HttpClient) { }

  getComments() {

    return new Promise(resolve => {
    this.http.get(url + 'comments').subscribe(data => {
      resolve(data);
    }, err => {
      console.log(err);
    });
  });
  }

  sendPost(data){
    let headers = new Headers({'Content-Type': 'application/JSON'});
    console.log(data);
    return new Promise((resolve, reject) => {
    return this.http.post(url + "comments", data, {
    headers: new HttpHeaders({'Content-Type': 'application/json'}),
    observe: 'response'
    })
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
      });
  }

  deletePostById(_id){
    let headers = new Headers({'Content-Type': 'application/JSON'});
    console.log(_id);
  return this.http
  .delete(url + 'comments/' + _id,{
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  observe: 'response'
  })


  }


  // getPosts() {
  //
  //   return new Promise(resolve => {
  //   this.http.get('proxy/posts').subscribe(data => {
  //     resolve(data);
  //   }, err => {
  //     console.log(err);
  //   });
  // });
  // }

// addComment(){
//   return new Promise(resolve => {
//     this.data.response = data["_content"];
//     }, error => {
//     console.log("Oooops!");
//   });
// };
}
