export interface IUser {
    _id?: string;
    name: string;
    email: string;
    uname: string;
    pwd: string;
    wishList?: Array<string>;
    cart?: Array<string>;
  }
  
  export class User implements IUser {
    constructor(
      public name: string,
      public email: string,
      public uname: string,
      public pwd: string,
      public _id?: string,
      public wishList?: Array<string>,
      public cart?: Array<string>
    ) {
      this._id = _id ? _id : null;
      this.name = name;
      this.email = email;
      this.uname = uname;
      this.pwd = pwd;
      this.wishList = wishList ? wishList : [];
      this.cart = cart ? cart : [];
    }
  }