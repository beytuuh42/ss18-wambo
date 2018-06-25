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
let prefixNested = "nested-comments/";
let posts = [];
let comments = [];
let path = "";
let jsonHeader = new HttpHeaders({ 'Content-Type': 'application/json' });

@Injectable()
export class ApiProvider {

  constructor(public http: HttpClient, public authService:AuthService) { }

  /**
   * Making an http get request to the url in the path variable for retrieving
   * all child comments and pushing those in an array.
   * @returns promise object with the array
   */
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


  /**
   * Making an http get request to the url in the path variable for retrieving
   * all parent comments and pushing those in an array.
   * @returns promise object with the array
   */
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

  /**
   * Making an http get request to the url in the path variable for retrieving
   * a comment by the id.
   * @param id id
   * @returns promise object with the comment
   */
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

  /**
   * Making an http post request to the url in the path variable for creating
   * a new comment and attaching the current user as the author.
   * @param data data of the comment
   * @returns promise object with the comment
   */
  sendPost(data) {
    return new Promise((resolve,reject) => {
          data.author = this.authService.getUserInfo()._id;
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
  }

  /**
    Making an http put request to the url in the path variable for adding
    the ancestors object to the given result object.
    @param result comment, whose ancestors will updated
    @param ancestors ancestors, who will be pushed into the comment
    @returns promise object with the comment
   */
  pushAncestors(result, ancestors) {
    var data = result.body;
    var id = result.body._id;

    path = url + prefixComments + id;
    if (ancestors != null) {
      data.ancestors = ancestors;
    }

    data.ancestors.push(id);

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


  /**
    Retrieving a comment by it's id. Checking if the given user already liked
    the comment. Like counter will be increased/decreased depending on the result
    and user will be added/removed to the comments liked_by array.
    @param commentId comment, whose like counter will be pushed
    @param userId to add to the comments likes
    @returns promise object with the comment
   */
  incrementLike(commentId, userId) {
    path = url + prefixComments + commentId;
    return new Promise((resolve, reject) => {
      this.getCommentById(commentId).then((result: any) => {
        this.checkIfUserLikeExists(result,userId,"like").then(exists => {
          if(exists){
            const index: number = result.liked_by.indexOf(userId);
            if (index !== -1) {
                result.liked_by.splice(index, 1);
                result.likes -= 1;
            }
          } else {
            result.liked_by.push(userId);
            result.likes += 1;
          }
          return this.http.put<any[]>(path, result, {
            headers: jsonHeader,
            observe: 'response'
          })
            .subscribe(res => {
              resolve(res);
            }, (err) => {
              reject(new Error("Error incrementing like: " + err.message));
            });
        })
      });
    });
  }

  /**
    Retrieving a comment by it's id. Checking if the given user already disliked
    the comment. Dislike counter will be increased/decreased depending on the result
    and user will be added/removed to the comments disliked_by array by a put request.
    @param commentId comment, whose like counter will be pushed
    @param userId to add to the comments likes
    @returns promise object with the comment
   */
  incrementDislike(commentId, userId) {
    path = url + prefixComments + commentId;
    return new Promise((resolve, reject) => {
      this.getCommentById(commentId).then((result: any) => {
        this.checkIfUserLikeExists(result,userId,"dislike").then(exists => {
          if(exists){
            const index: number = result.disliked_by.indexOf(userId);
            if (index !== -1) {
                result.disliked_by.splice(index, 1);
                result.dislikes -= 1;
            }
          } else {
            result.disliked_by.push(userId);
            result.dislikes += 1;
          }
          return this.http.put<any[]>(path, result, {
            headers: jsonHeader,
            observe: 'response'
          })
            .subscribe(res => {
              resolve(res);
            }, (err) => {
              reject(new Error("Error incrementing like: " + err.message));
            });
        })
      });
    });
  }

   /**
     Making an http get request to the url in the path variable for retrieving
     all child comments from the given comment.
     @returns promise object with the comments
    */
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

  /**
    Making an http put request to the url in the path variable for changing
    the content of a comment to [deleted] for preventing fullstack issues.
    @param id comment id to 'delete'
    @returns promise object with the comment
   */
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

  /**
    Generates a random color for the posts.
    @param id comment id to 'delete'
    @returns random color object
   */
  getRandomColor() {
    let randomColor = "hsl(" + 360 * Math.random() + ',' +
      (20 + 70 * Math.random()) + '%,' +
      (73 + 10 * Math.random()) + '%)';
    return (randomColor)
  }

  /**
    Gives the comments a random color
    @param data comments data
    @returns comments with color
   */
  setRandomColors(data) {
    data.forEach((x: any) => {
      x.color = this.getRandomColor();
    });
    return data;
  }

  /**
    Gives the comment a random color
    @param data comment data
    @returns comment with color
   */
  setRandomColor(data) {
    data.color = this.getRandomColor();
    return data;
  }

  /**
    Checks if the given user already liked/disliked the comment.
    @param result comment
    @param userId user id from the liker
    @param like likes or dislike
    @returns promise object with the comment
   */
  checkIfUserLikeExists(result,userId,like):Promise<Boolean>{
    return new Promise((resolve,reject) => {
      var list;
      if(like == "like"){
        list = result.liked_by;
      } else {
        list = result.disliked_by;
      }
      console.log(list.length);
      if(typeof list != 'undefined' && list instanceof Array && list.length != 0){
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
