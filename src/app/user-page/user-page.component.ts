import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IProduct } from '../entities/product/product.model';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {

  uname = localStorage.getItem('user');
  createdWish: IProduct = null;

  constructor(private router:Router) { }

  ngOnInit(): void {
    let token = localStorage.getItem('user');
        if (!token) {
          this.router.navigate(['']);
        }
  }

  onCreatedWish(createdWish: IProduct) {
    this.createdWish = createdWish;
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['']);
  }

  checkout() {
    alert("Checkout functionality not implemented.")
  }
}
