export interface IProduct {
  _id?: string;
  name: string;
  brand: string;
  price: number;
  email: string;
  availible: boolean;
}

export class Product implements IProduct {
  constructor(
    public name: string,
    public brand: string,
    public price: number,
    public email: string,
    public availible: boolean,
    public _id?: string
  ) {
    this._id = _id ? _id : null;
    this.name = name;
    this.brand = brand;
    this.price = price;
    this.email = email;
    this.availible = availible;
  }
}