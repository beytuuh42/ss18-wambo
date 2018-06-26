import * as jwt from 'jsonwebtoken';

/**
  Verifing the token by checking the id with the secret-key.
  Fetching the username from the token and setting it to the current user.
**/
export function verifyToken(self){
  jwt.verify(localStorage.getItem('tokenId'), "plusultra", function(err, decoded) {
    if(err){
      // console.log("Token error:" + err.message);
    } else {
      self.auth.setUserInfo(decoded.user).then(loaded => {
        if(loaded){
          self.userId = self.auth.getUserInfo()._id;
        }
      });
    }
  })
}
