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
        console.log("Error fetching comments: " + err.message);
        reject(err);
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
        console.log("Error fetching posts: " + err.message);
        reject(err);
      });
    });
  }

  getCommentById(id) {
    path = url + prefixComments + id;
    return new Promise((resolve,reject) => {
      this.http.get<any[]>(path).subscribe(data => {
        resolve(data);
      }, err => {
        console.log("Error fetching comment by ID: " + err.message);
        reject(err);
      });
    });
  }

  sendPost(data) {
    let author = this.authService.getUserInfo()._id;
    data.author = author;
    path = url + prefixComments;
    return new Promise((resolve, reject) => {
      return this.http.post(path, data, {
        headers: jsonHeader,
        observe: 'response'
      })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          console.log("Error creating post: " + err.message);
          reject(err);
        });
    });
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
          console.log("Error creating post: " + err.message);
          reject(err);
        });
    });
  }

  incrementLike(id) {
    path = url + prefixComments + id;
    return new Promise((resolve, reject) => {
      this.getCommentById(id).then((result: any) => {
        result.likes += 1;
        return this.http.put<any[]>(path, result, {
          headers: jsonHeader,
          observe: 'response'
        })
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            console.log("Error incrementing like: " + err.message);
            reject(err);
          });
      });
    });
  }

  incrementDislike(id) {
    path = url + prefixComments + id;
    return new Promise((resolve, reject) => {
      this.getCommentById(id).then((result: any) => {
        result.dislikes += 1;
        return this.http.put(path, result, {
          headers: jsonHeader,
          observe: 'response'
        })
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            console.log("Error incrementing dislike: " + err.message);
            reject(err);
          });
      });
    });
  }

  getAllChildrenByParent(id) {
    path = url + prefixNested + id;
    return new Promise((resolve, reject) => {
      return this.http.get<any[]>(path).subscribe(data => {
        resolve(data);
      }, err => {
        console.log("Error getting childs: " + err.message);
        reject(err);
      })
    });
  }

  deletePostById(id) {
    path = url + prefixComments + id;
    return new Promise((resolve,reject) => {
      return this.http.delete<any[]>(path, {
        headers: jsonHeader,
        observe: 'response'
      })
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        console.log("Error deleting post: " + err.message);
        reject(err);
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
}
