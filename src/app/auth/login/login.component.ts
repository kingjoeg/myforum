import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, { validators: [ Validators.required, Validators.email ] }),
      password: new FormControl(null, { validators: [ Validators.required, Validators.minLength(3) ] })
    });
  }

  onLogin() {
    this.authService.login(this.form.value.email, this.form.value.password);
  }

}
