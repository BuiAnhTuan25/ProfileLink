import { Component, OnInit, ViewChild } from '@angular/core';
import { DemoComponent } from '../demo/demo.component';
import { DesignComponent } from '../design/design.component';
import { LinksComponent } from '../links/links.component';
import { SettingsComponent } from '../settings/settings.component';
import { DataService } from '../_service/data-service/data.service';
import { ProfileService } from '../_service/profile-service/profile.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user:any;
  profile:any;
  constructor(private profileService:ProfileService) { }
  selectIndex:any=0;
  async ngOnInit(){
    this.user=JSON.parse(localStorage.getItem('auth-user')!);
    await this.getProfile();
  }
  async getProfile(){
   await this.profileService.getProfile(this.user.id).toPromise().then((res:any)=>{
      if(res.success){
        this.profile=res.data;
      }
    });
  }
  
  receverProfile(event:any){
    this.profile=event;
  }
  
}
