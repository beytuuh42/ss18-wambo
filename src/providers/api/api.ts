import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth-service/auth-service';
/*
  Ge*nerated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

let url = "proxy/";
let prefixComments = "comments/";
let prefixNested = "nested/";
let posts = [];
let comments = [];
let path = "";
let jsonHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

@Injectable()
export class ApiProvider {

  constructor(public http: HttpClient, public authService:AuthService) { }

  getLikeAmount() {

  }

  getComments() {
    path = url + prefixComments;
    return new Promise((resolve, reject) => {
      this.http.get<any[]>(path).subscribe(data => {
        data.forEach((x: any) => {
          if (x.ancestors.length > 1) {
            comments.push(x);
          }
        });
        resolve(comments);
      }, err => {
        reject(new Error("Error fetching comments: " + err.message));
      });
    });
  }

  getPosts() {
    path = url + prefixComments;
    posts = [];
    return new Promise((resolve, reject) => {
      this.http.get<any[]>(path).subscribe(data => {
        data.forEach((x: any) => {
          if (x.ancestors.length == 1) {
            posts.push(x);
          }
        });
        resolve(posts);
      }, err => {
        reject(new Error("Error fetching posts: " + err.message));
      });
    });
  }

  getCommentById(id) {
    path = url + prefixComments + id;
    return new Promise((resolve,reject) => {
      this.http.get<any[]>(path).subscribe(data => {
        resolve(data);
      }, err => {
        reject(new Error("Error fetching comment by ID: " + err.message));
      });
    });
  }

  sendPost(data) {
    return new Promise((resolve,reject) => {
      // this.authService.setUserInfo()
      //   .then(loaded => {
      //     if(loaded){
      //       return this.authService.getUserInfo()._id;
      //     }
      //   })
      //   .then(author => {
          data.author = this.authService.getUserInfo()._id;// author;
          path = url + prefixComments;

          return this.http.post(path, data, {
            headers: jsonHeader,
            observe: 'response'
          })
            .subscribe(res => {
              resolve(res);
            }, (err) => {
              reject(new Error("Error pushing new post (subscribing data): " + err.message));
            });
        })
    //     .catch(err => {
    //       reject(new Error("Error pushing new post (fetching author ID): " + err.message));
    //     })
    // })
  }

  pushAncestors(result, ancestors) {
    var data = result.body;
    var id = result.body._id;

    path = url + prefixComments + id;
    if (ancestors == null) {
      data.ancestors.push(id);
    } else {
      data.ancestors = ancestors;
      data.ancestors.push(id);
    }

    return new Promise((resolve, reject) => {
      return this.http.put<any[]>(path, data, {
        headers: jsonHeader,
        observe: 'response'
      })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(new Error("Error creating post: " + err.message));
        });
    });
  }

  incrementLike(commentId, userId) {
    path = url + prefixComments + commentId;
    return new Promise((resolve, reject) => {
      this.getCommentById(commentId).then((result: any) => {
        this.checkIfUserLikeExists(result,userId,"like").then(exists => {
          if(exists){
            return false;
          } else {
            result.liked_by.push(userId);
            result.likes += 1;
            console.log(result);
            return this.http.put<any[]>(path, result, {
              headers: jsonHeader,
              observe: 'response'
            })
              .subscribe(res => {
                resolve(res);
              }, (err) => {
                reject(new Error("Error incrementing like: " + err.message));
              });
          }
        })
      });
    });
  }

  incrementDislike(commentId, userId) {
    path = url + prefixComments + commentId;
    return new Promise((resolve, reject) => {
      this.getCommentById(commentId).then((result: any) => {
        this.checkIfUserLikeExists(result,userId,"dislike").then(exists => {
          if(exists){
            return false;
          } else {
            result.disliked_by.push(userId);
            result.dislikes += 1;
            return this.http.put<any[]>(path, result, {
              headers: jsonHeader,
              observe: 'response'
            })
              .subscribe(res => {
                resolve(res);
              }, (err) => {
                reject(new Error("Error incrementing like: " + err.message));
              });
          }
        })
      });
    });
  }

  getAllChildrenByParent(id) {
    path = url + prefixNested + id;
    return new Promise((resolve, reject) => {
      return this.http.get<any[]>(path).subscribe(data => {
        resolve(data);
      }, err => {
        reject(new Error("Error getting childs: " + err.message));
      })
    });
  }

  deletePostById(id) {
    path = url + prefixComments + id;
    return new Promise((resolve,reject) => {
      return this.http.put(path, {content:'[deleted]'},{
        headers: jsonHeader,
        observe: 'response'
      })
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(new Error("Error deleting post: " + err.message));
      })
    })
  }

  getRandomColor() {
    let randomColor = "hsl(" + 360 * Math.random() + ',' +
      (20 + 70 * Math.random()) + '%,' +
      (73 + 10 * Math.random()) + '%)';
    return (randomColor)
  }

  setRandomColors(data) {
    data.forEach((x: any) => {
      x.color = this.getRandomColor();
    });
    return data;
  }

  setRandomColor(data) {
    data.color = this.getRandomColor();
    return data;
  }

  checkIfUserLikeExists(result,userId,like):Promise<Boolean>{
    return new Promise((resolve,reject) => {
      var list;
      if(like == "like"){
        list = result.liked_by;
      } else {
        list = result.disliked_by;
      }
      if(typeof list != 'undefined' && list instanceof Array){
        list.forEach((x:any) => {
          if(x == userId){
            resolve(true);
          }
        });
      }
      resolve(false);
    })

  }
}
