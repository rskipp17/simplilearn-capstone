import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ProductService } from 'src/app/entities/product/product.service';
import { IProduct, Product } from 'src/app/entities/product/product.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  products: Array<IProduct> = [];
  uname: string;

  @Output() createdWish = new EventEmitter<IProduct>();

  constructor(protected productService: ProductService) { }

  // Load all the products when starting the view.
  ngOnInit(): void {
    this.uname = localStorage.getItem('user');
    this.loadProducts();
  }

  // Load all products.
  private loadProducts() {
    this.productService
      .get()
      .then((result: Array<IProduct>) => {
        this.products = result;
      });
  }
 
  // Add to user's cart
  addList(product: Product) {
    this.productService.addList(product, this.uname).then((result: any) => this.createdWish.emit(product));
  }

}
