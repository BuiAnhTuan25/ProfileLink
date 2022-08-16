import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  time:any;
  month!:number;
  year!:number;
  location:any;
  mapType:string= "satelite";
  max!:number;
  ranks:any[]=[
    {
      src:'https://cdn-icons-png.flaticon.com/512/6431/6431247.png'
    },
    {
      src:'https://cdn-icons-png.flaticon.com/512/4020/4020064.png'
    },
        {
      src:'https://cdn-icons-png.flaticon.com/512/8030/8030185.png'
    },
    {
      src:'https://cdn-icons.flaticon.com/png/512/5040/premium/5040801.png?token=exp=1659926970~hmac=1d347e78f94f2f040a549a09b0f8b1c3'
    },    
    {
      src:'https://cdn-icons.flaticon.com/png/512/1979/premium/1979440.png?token=exp=1659927006~hmac=2d557fc642d5022dd060f7861e82bb35'
    },
  ]

  constructor(private statisticService:StatisticService,private msg:NzMessageService) { }

  ngOnInit(): void {
    this.time=new Date();
    let datepipe  = new DatePipe('en-US');
    this.time=datepipe.transform(this.time,'yyyy-MM');
    let date=new Date();
    this.getTopProfile();
    this.getTopProfileOfMonth(date.getMonth()+1,date.getFullYear());
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

  getTopProfileOfMonth(month:number,year:number){
    this.statisticService.getTopProfileOfMonth(0,5,month,year).subscribe((res:any)=>{
      if(res.success){
        this.topMonth=res.data;
        // this.max=res.data[0].click_count;
        // this.topMonth.reverse();
      } else this.msg.error(res.message);
    });
  }

  onClickProfile(url:string){
    // document.location.href = 'http://profilelinkangular.s3-website.ap-south-1.amazonaws.com/demo/' + url;
    window.open('http://profilelinkangular.s3-website.ap-south-1.amazonaws.com/demo/' + url, 'mytab');
  }

  getIp(){
    this.statisticService.getIp().subscribe((res:any)=>{

    })
  }

  getLocation(){
    // this.statisticService.getLocation().subscribe((res:any)=>{
    //   this.location=res;
    //   console.log(res)
    // })
    navigator.geolocation.getCurrentPosition((res)=>{
      this.location=res.coords;
    })
  }

  onChangeMonth(event:any){
  this.getTopProfileOfMonth(event.substr(5,2),event.substr(0,4));
  }
}
