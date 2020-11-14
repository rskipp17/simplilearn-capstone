import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IProduct } from '../entities/product/product.model';
import { IUser } from '../entities/user/user.model';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  createdProduct: IProduct = null;
  createdUser: IUser = null;

  constructor(private router:Router) { }

  ngOnInit(): void {
    let token = localStorage.getItem('admin');
        if (!token) {
          this.router.navigate(['']);
        }
  }
 
  // Get the new product created.
  onCreatedProduct(createdProduct: IProduct) {
    this.createdProduct = createdProduct;
  }

  // Get the new user created.
  onCreatedUser(createdUser: IUser) {
    this.createdUser = createdUser;
  }

  logout() {
    localStorage.removeItem('admin');
    this.router.navigate(['']);
  }
}
