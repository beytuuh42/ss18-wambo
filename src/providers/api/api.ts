import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
/*
  Ge*nerated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

let url = "proxy/"
let posts = [];
let comments = [];
let jsonHeader = new Headers({
  'Content-Type': 'application/JSON'
});

@Injectable()
export class ApiProvider {

  constructor(public http: HttpClient) { }

  getComments() {
    return new Promise(resolve => {
      this.http.get(url + 'comments').subscribe(data => {
        data.forEach((x: any) => {
          if (x.ancestors.length > 1) {
            comments.push(x);
          }
        });
        resolve(comments);
      }, err => {
        console.log("Error fetching comments: " + err.message);
      });
    });
  }

  getPosts() {
  posts = [];
    return new Promise(resolve => {
      this.http.get(url + 'comments').subscribe(data => {
        data.forEach((x: any) => {
          if (x.ancestors.length == 1) {
            posts.push(x);
          }
        });
        resolve(posts);
      }, err => {
        console.log("Error fetching posts: " + err.message);
      });
    });
  }

  getCommentById(id) {
    var path = url + 'comments/' + id;
    return new Promise(resolve => {
      this.http.get(path).subscribe(data => {
        resolve(data);
      }, err => {
        console.log("Error fetching comment by ID: " + err.message);
      });
    });
  }

  sendPost(data) {
    return new Promise((resolve, reject) => {
      return this.http.post(url + "comments", data, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        observe: 'response'
      })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  pushAncestors(result, ancestors) {
    var data = result.body;
    var id = result.body._id;
    if(ancestors == null){
      data.ancestors.push(id);
    } else {
      data.ancestors = ancestors;
      data.ancestors.push(id);
    }

    return new Promise((resolve, reject) => {
      return this.http.put(url + "comments/" + id, data, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        observe: 'response'
      })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  incrementLike(id) {

      return new Promise((resolve, reject) => {
        this.getCommentById(id).then((result) => {
          result.likes += 1;
        return this.http.put(url + "comments/" + id, result, {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
          observe: 'response'
        })
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
      });
    });
  }

  incrementDislike(id) {
      return new Promise((resolve, reject) => {
        this.getCommentById(id).then((result) => {
          result.dislikes += 1;
        return this.http.put(url + "comments/" + id, result, {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
          observe: 'response'
        })
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
      });
    });
  }

  getAllChildrenByParent(id) {
    var path = url + 'qwe/' + id;
    return new Promise((resolve, reject) => {
      return this.http.get(path).subscribe(data => {
        resolve(data);
      }, err => {
        console.log("Error getting childs: " + err.message);
      })
    });
  }

  deletePostById(_id) {
    console.log(_id);
    return this.http
      .delete(url + 'comments/' + _id, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        observe: 'response'
      })
  }

  getRandomColor() {
    let randomColor = "hsl(" + 360 * Math.random() + ',' +
      (20 + 70 * Math.random()) + '%,' +
      (73 + 10 * Math.random()) + '%)';
    return (randomColor)
  }

  setRandomColors(data){
    data.forEach((x:any) => {
      x.color = this.getRandomColor();
    });
    return data;
  }

  setRandomColor(data){
    data.color = this.getRandomColor();
    return data;
  }
}
