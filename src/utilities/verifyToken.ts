import * as jwt from 'jsonwebtoken';

export function verifyToken(self){
  jwt.verify(localStorage.getItem('tokenId'), "plusultra", function(err, decoded) {
    if(err){
      console.log(err);
    } else {
      self.auth.setUserInfo(decoded.user).then(loaded => {
        if(loaded){
          self.userId = self.auth.getUserInfo()._id;
        }
      });
    }
  })
}
