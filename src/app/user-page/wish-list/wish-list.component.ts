import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { ProductService } from 'src/app/entities/product/product.service';
import { IProduct, Product } from 'src/app/entities/product/product.model';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.css']
})
export class WishListComponent implements OnInit, OnChanges {
  wishList: Array<IProduct>;
  uname: string;
  @Input() wishToDisplay: IProduct = null;

  constructor(protected productService: ProductService) { }

  ngOnInit(): void {
    this.uname = localStorage.getItem('user');
    this.loadAll();
  }

  // If new product created, we redownload and display the list.
  ngOnChanges(): void {
    if (this.wishToDisplay !== null) {
      this.loadAll();
    }
  }

  // Load all products.
  private loadAll() {
    this.productService
      .getList(this.uname)
      .then((result) => {
        this.wishList = result;
      });
  }

  // Remove from user's wish list
  removeList(product: Product) {
      this.productService.removeList(product, this.uname).then((result: any) => this.loadAll());
  }
}