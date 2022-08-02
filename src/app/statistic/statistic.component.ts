import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { StatisticService } from '../_service/statistic-service/statistic.service';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css']
})
export class StatisticComponent implements OnInit {
  topProfile:any[]=[];
  topMonth:any[]=[];
  location:any;
  mapType:string= "satelite";

  constructor(private statisticService:StatisticService,private msg:NzMessageService) { }

  ngOnInit(): void {
    this.getTopProfile();
    this.getTopProfileOfMonth();
    this.getIp();
    this.getLocation();
    
  }

  getTopProfile(){
    this.statisticService.getTopProfile(0,5).subscribe((res:any)=>{
      if(res.success){
        this.topProfile=res.data;
      }
      else this.msg.error(res.message);
    });
  }

  getTopProfileOfMonth(){
    this.statisticService.getTopProfileOfMonth(0,5).subscribe((res:any)=>{
      if(res.success){
        this.topMonth=res.data;
      } else this.msg.error(res.message);
    });
  }

  onClickProfile(url:string){
    document.location.href = 'http://localhost:4200/demo/' + url;
  }

  getIp(){
    this.statisticService.getIp().subscribe((res:any)=>{
      console.log(res.ip)
    })
  }

  getLocation(){
    // this.statisticService.getLocation().subscribe((res:any)=>{
    //   this.location=res;
    //   console.log(res)
    // })
    navigator.geolocation.getCurrentPosition((res)=>{
      this.location=res.coords;
      console.log(res)
    })
  }

}
