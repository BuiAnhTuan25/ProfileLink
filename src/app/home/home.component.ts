import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../_service/auth-service/auth.service';
import { ProfileService } from '../_service/profile-service/profile.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  user: any;
  profile: any;
  selectIndex: any = 0;
  constructor(
    private profileService: ProfileService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('auth-user')!);
    setTimeout(() => this.getProfile(), 500);
  }

  ngOnDestroy() {
    this.auth.doLogout();
  }

  getProfile() {
    this.profileService.getProfile(this.user.id).subscribe((res: any) => {
      if (res.success) {
        this.profile = res.data;
      }
    });
  }

  receverProfile(event: any) {
    this.profile = event;
  }

  onClickDashboard() {
    this.selectIndex = 0;
  }

  onClickLogout() {
    this.auth.doLogout();
  }
}
