import * as hash from 'password-hash';

export class PasswordHandler {
  password:String;
  hashedPass:String;

  constructor(pass:String, hashedPass:String){
    this.password = pass;
    this.hashedPass = hashedPass;
  }

  /**
   * Comparing passwords.
   * @returns {Boolean value}
   */

  public isValidPassword(){
    return hash.verify(this.password, this.hashedPass);
  }

  /**
   * Hashing password for obvious reasons.
   * @returns {hashed Password}
   */

  public encryptPassword(){
    return hash.generate(this.password);
  }
}
