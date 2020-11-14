import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/entities/user/user.service';
import { IUser, User } from 'src/app/entities/user/user.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit {

  userForm: FormGroup;
  name: string = '';
  email: string = ''; 
  uname: string = '';
  pwd: string = '';
  error: boolean = false; 

  @Output() createdUser = new EventEmitter<IUser>();

  constructor(protected userService: UserService, protected formBuilder: FormBuilder) { }

  // Init the form when starting the view.
  ngOnInit(): void {
    this.initForm();
  }

  // Manage the submit action and create the new user.
  onSubmit() {
    const user = new User(this.userForm.value['name'], this.userForm.value['email'], this.userForm.value['uname'], this.userForm.value['pwd'], null, null, null);
    this.userService.create(user).then((result: IUser) => {
      if (result === undefined) {
        this.error = true;
      } else {
        this.error = false;
        this.createdUser.emit(result);
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

