import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  form: FormGroup;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, { validators: [ Validators.required, Validators.email ] }),
      password: new FormControl(null, { validators: [ Validators.required, Validators.minLength(3) ] })
    });
  }

  onSignUp() {
    this.authService.createUser(this.form.value.email, this.form.value.password);
  }

}
