import { Component, OnDestroy, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
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
  border: boolean = true;
  isVisible:boolean=false;
  dataQr:string='';
  constructor(
    private profileService: ProfileService,
    private auth: AuthService,
    private msg: NzMessageService
  ) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('auth-user')!);
    this.getProfile();
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

  onClickCopyLink() {
    navigator.clipboard.writeText('http://localhost:4200/demo/'+this.profile?.short_bio);
    this.msg.success('Copied');
  }

  onClickQrCode(){
   this.isVisible=true;
   this.dataQr=this.profile?.profile_link;
  }
  onCloseModal(){
    this.isVisible=false;
    this.dataQr='';
  }
}
