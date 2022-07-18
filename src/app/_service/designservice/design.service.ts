import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DesignService {
  BASE_PATH = 'http://localhost:8080/api/v1.0/design';
  constructor(private http:HttpClient) { }
  getDesign(id:number):Observable<any>{
    return this.http.get(this.BASE_PATH+"/"+id);
  }

  addDesign(design:any):Observable<any>{
    return this.http.post(this.BASE_PATH,design);
  }
  
  updateDesign(design:any,id:number):Observable<any>{
    return this.http.put(this.BASE_PATH+"/"+id,design);
  }

  deleteDesign(id:number):Observable<any>{
    return this.http.delete(this.BASE_PATH+"/"+id);
  }
  getAllDesign(page:number,pageSize:number):Observable<any>{
    return this.http.get(this.BASE_PATH+
      '?page=' +
    page +
    '&page_size=' +
    pageSize);
  }
}
