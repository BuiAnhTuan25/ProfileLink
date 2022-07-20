import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocialService {
  BASE_PATH = 'http://localhost:8080/api/v1.0/social';
  constructor(private http: HttpClient) { }

  getListSocial(profileId: number, page: number, pageSize: number): Observable<any> {
    return this.http.get(
      this.BASE_PATH +
      '/social/' +
      profileId +
      '?page=' +
      page +
      '&page_size=' +
      pageSize
    );
  }
  getSocial(id:number):Observable<any>{
    return this.http.get(this.BASE_PATH+'/'+id);
  }

  deleteSocial(id: number) :Observable<any>{
    return this.http.delete(this.BASE_PATH + '/' + id);
  }

  addSocial(social:any):Observable<any>{
    return this.http.post(this.BASE_PATH+'/add',social);
  }

  updateSocial(social:any,id:number):Observable<any>{
    return this.http.put(this.BASE_PATH+"/"+id,social);
  }
}
