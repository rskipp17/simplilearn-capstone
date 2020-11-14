import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/entities/user/user.service';
import { IUser, User } from 'src/app/entities/user/user.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  createdUser: IUser = null;
  userForm: FormGroup;
  name: string = '';
  email: string = ''; 
  uname: string = '';
  pwd: string = '';
  error: boolean = false; 

  constructor(protected userService: UserService, private router:Router) { }

  ngOnInit(): void {
    let token = localStorage.getItem('register');
        if (!token) {
          this.router.navigate(['']);
        }
        else
          this.initForm();
  } 

  // Get the new user created.
  onCreatedUser(createdUser: IUser) {
    this.logout()
  }

  logout() {
    localStorage.removeItem('register');
    this.router.navigate(['']);
  }

  onSubmit() {
    const user = new User(this.userForm.value['name'], this.userForm.value['email'], this.userForm.value['uname'], this.userForm.value['pwd'], null);
    this.userService.create(user).then((result: IUser) => {
      if (result === undefined) {
        this.error = true;
      } else {
        this.error = false;
        alert("User was successfully added. You will now return to home screen to log in.")
        this.logout()
      }
    });
  }

  // Hide the error message.
  hideError() {
    this.error = false;
  }

  // Init the creation form.
  private initForm() {
    this.userForm = new FormGroup({
      name: new FormControl(this.name, Validators.required),
      email: new FormControl(this.email, Validators.required),
      uname: new FormControl(this.uname, Validators.required),
      pwd: new FormControl(this.pwd, Validators.required),
    });
  }
}

