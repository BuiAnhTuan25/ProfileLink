import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LinksService {
  BASE_PATH = 'http://localhost:8080/api/v1.0/link';
  constructor(private http: HttpClient) {}

  getListLinks(
    profileId: number,
    page: number,
    pageSize: number
  ): Observable<any> {
    return this.http.get(
      this.BASE_PATH +
        '/list/' +
        profileId +
        '?page=' +
        page +
        '&page-size=' +
        pageSize
    );
  }
  getLink(id: number): Observable<any> {
    return this.http.get(this.BASE_PATH + '/' + id);
  }

  deleteLink(id: number): Observable<any> {
    return this.http.delete(this.BASE_PATH + '/' + id);
  }

  addLink(link: any, fileUpload: any): Observable<any> {
    const formdata = new FormData();
    formdata.append('file', fileUpload);
    formdata.append('title', link.title);
    formdata.append('url', link.url ? link.url : '');
    formdata.append('type', link.type);
    formdata.append('profileId', link.profile_id);
    formdata.append('clickCount', link.click_count);
    formdata.append('picture', link.picture);
    return this.http.post(this.BASE_PATH, formdata);
  }

  updateLink(link: any, id: number, fileUpload?: any): Observable<any> {
    const formdata = new FormData();
    formdata.append('file', fileUpload);
    formdata.append('title', link.title);
    formdata.append('url', link.url ? link.url : '');
    formdata.append('type', link.type);
    formdata.append('profileId', link.profile_id);
    formdata.append('clickCount', link.click_count);
    formdata.append('picture', link.picture);
    return this.http.put(this.BASE_PATH + '/' + id, formdata);
  }
}
