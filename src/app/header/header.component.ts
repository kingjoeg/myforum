import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isAuthenticated = false;
  authStatusListener: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authStatusListener = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isAuthenticated = authStatus;
      console.log(this.isAuthenticated);
    });
  }

  ngOnDestroy() {
    this.authStatusListener.unsubscribe();
  }

  logout() {
    this.authService.logout();
  }
}
