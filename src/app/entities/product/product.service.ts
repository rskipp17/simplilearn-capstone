import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { IProduct, Product } from './product.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private productsUrl = '/api/products';
    private wishListUrl = '/api/wishlist'

    constructor(private http: Http) { }

    // Get products
    get(): Promise<Array<IProduct>> {
        return this.http.get(this.productsUrl)
            .toPromise()
            .then(response => response.json())
            .catch(this.error);
    }

    // Create product
    create(product: Product): Promise<IProduct> {
        return this.http.post(this.productsUrl, product)
            .toPromise()
            .then(response => response.json())
            .catch(this.error);
    }

    // Delete a product
    delete(id: string): Promise<any> {
        return this.http.delete(`${this.productsUrl}/${id}`)
            .toPromise()
            .then(response => response.json())
            .catch(this.error);
    }

    // Error handling
    private error(error: any) {
        let message = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(message);
    }

    // Add product to wish list
    addList(product: Product, uname: string): Promise<IProduct> {
        return this.http.post(`${this.wishListUrl}/${uname}`, product)
        .toPromise()
        .then(response => response.json())
        .catch(this.error);
    }

    // get products on wish list
    getList(uname: string): Promise<any> {
        return this.http.get(`${this.wishListUrl}/${uname}`)
            .toPromise()
            .then(response => response.json())
            .catch(this.error);
    } 

    // remove product on wish list
    removeList(product: Product, uname: string): Promise<any> {
        return this.http.post(`${this.wishListUrl}/delete/${uname}`, product)
            .toPromise()
            .then(response => response.json())
            .catch(this.error);
    }
}
