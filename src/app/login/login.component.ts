import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/entities/login/login.service';
import { IUser } from 'src/app/entities/user/user.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  uname: string;
  pwd: string;

  constructor(protected loginService: LoginService, private router: Router, protected formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  // Manage the submit action and create the new product.
  onSubmit() {
    this.uname = this.loginForm.value['uname']
    this.pwd = this.loginForm.value['pwd']
    this.loginService.get(this.uname).then((result: IUser) => {
      if (result.pwd !== undefined) {
        if (result.pwd == this.pwd) {
          if (this.uname == 'admin') {
            localStorage.setItem('admin', this.uname);
            this.router.navigate(['admin'])
          }
          else {
            localStorage.setItem('user', this.uname);
            this.router.navigate(['user'])
          }
        }
        else {
          alert("Incorrect Login Combination. Please try again.")
        }
      } else {
        alert("Incorrect Login Combination. Please try again.")
      }
    }).catch(this.error);
  }

  // Error handling
  private error(error: any) {
    console.log("invalid login attempted")
  }

  // Init the creation form.
  private initForm() {
    this.loginForm = new FormGroup({
      uname: new FormControl(this.uname, Validators.required),
      pwd: new FormControl(this.pwd, Validators.required),
    });
  }

  register(){
    console.log('registering...')
    localStorage.setItem('register', this.uname);
    this.router.navigate(['register'])
  }
}
