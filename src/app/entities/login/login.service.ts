import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { IUser } from '../user/user.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loginUrl = '/api/login';

  constructor(private http: Http) { }

  get(uname: string): Promise<IUser> {
    return this.http.get(this.loginUrl + `/${uname}`)
      .toPromise()
      .then(response => response.json())
      .catch(this.error);
  }

  // Error handling
  private error(error: any) {
    alert("Invalid combination detected. Please try logging in again.")
  }
}
