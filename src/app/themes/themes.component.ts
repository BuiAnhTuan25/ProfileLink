import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataService } from '../_service/data-service/data.service';
import { DesignService } from '../_service/designservice/design.service';
import { ProfileService } from '../_service/profile-service/profile.service';

@Component({
  selector: 'app-themes',
  templateUrl: './themes.component.html',
  styleUrls: ['./themes.component.css']
})
export class ThemesComponent implements OnInit {
  design:any;
  @Input() profile:any;
  listDesign:any[]=[];
  constructor(
    private designService:DesignService,
    private dataService:DataService,
    private profileService:ProfileService,
    private msg: NzMessageService, 
    ) { }

  async ngOnInit() {
    this.dataService.receiveDesign.subscribe(design=>{
      this.design=design;
    });
    await this.getAllDesign();
  }
  async getAllDesign(){
    await this.designService.getAllDesign(0,999).toPromise().then((res)=>{
      if(res.success){
        this.listDesign=res.data;
      }
    })
  }

  async onClickDesign(design:any){
    if(this.design!=design){
      this.profile.design_id=design.id;
      await this.profileService.updateProfile(this.profile,this.profile.id).toPromise().then((res:any)=>{
        if(res.success){
          this.msg.success('Change design success');
          this.dataService.sendDesign(design);
        }
        else this.msg.error('Change design false');
      })
    }
  }
}
