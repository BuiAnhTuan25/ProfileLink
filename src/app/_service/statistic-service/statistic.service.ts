import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {
  STATISTIC_PATH = 'http://localhost:8080/api/v1.0/statistic';
  PROFILE_PATH = 'http://localhost:8080/api/v1.0/profile';
  GEOIP_PATH = 'http://localhost:8080/api/v1.0/geoip';
  constructor(private http: HttpClient) {}

  getTopProfileOfMonth(page:number,pageSize:number,month:number,year:number): Observable<any> {
    let param=new HttpParams();
    param=param.append('page',page);
    param=param.append('page-size',pageSize);
    param=param.append('month',month);
    param=param.append('year',year);

    return this.http.get(this.STATISTIC_PATH+'/top-month',{params:param});
  }

  getTopProfile(page:number,pageSize:number): Observable<any> {
    return this.http.get(this.PROFILE_PATH+'/top'
    +'?page=' +
    page +
    '&page-size=' +
    pageSize);
  }

  getIp(): Observable<any>{
    return this.http.get('http://api.ipify.org/?format=json');
  }

  getLocation(): Observable<any>{
    return this.http.get(this.GEOIP_PATH)
  }
  
}
