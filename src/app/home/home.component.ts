import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthenticationService } from '../_service/auth-service/authentication.service';
import { ProfileService } from '../_service/profile-service/profile.service';
import { WebsocketService } from '../_service/websocket-service/websocket.service';

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
    private auth: AuthenticationService,
    private msg: NzMessageService,
    private websocket:WebsocketService,
    private router:Router,
  ) {}

  async ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('auth-user')!);
    await this.getProfile();
    this.websocket._connect(this.profile.id);
  }

  ngOnDestroy() {
    this.auth.doLogout();
  }

  async getProfile() {
    await this.profileService.getProfile(this.user.id).toPromise().then((res: any) => {
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
   this.dataQr='http://localhost:4200/demo/'+this.profile?.short_bio;
  }
  onCloseModal(){
    this.isVisible=false;
    this.dataQr='';
  }

  onClickAdmin(){
    window.location.pathname = '/admin';
  }
}
