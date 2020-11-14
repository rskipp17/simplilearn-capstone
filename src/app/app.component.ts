import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { StatusService } from './shared/status.service';
import { IProduct } from './entities/product/product.model';
import { IUser } from './entities/user/user.model';
import { isPromise } from '@angular/compiler/src/util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Fashionista';
  status = 'DOWN';
  

  constructor(protected statusService: StatusService) { }

  // Get the server status when starting the view.
  ngOnInit() {
    this.statusService
      .getStatus()
      .then((result: any) => {
        this.status = result.status;
      });
  }
}
