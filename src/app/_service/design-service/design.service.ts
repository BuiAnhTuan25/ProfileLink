import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DesignService {
  BASE_PATH = 'http://localhost:8080/api/v1.0/design';
  constructor(private http: HttpClient) {}

  getDesign(id: number): Observable<any> {
    return this.http.get(this.BASE_PATH + '/get/' + id);
  }

  addDesign(design: any, fileAvatar?: any, file?: any): Observable<any> {
    const formdata = new FormData();
    formdata.append('avatar', fileAvatar);
    formdata.append('background-image', file);
    formdata.append('name', design.name);
    formdata.append('type', design.type);
    formdata.append('backgroundColor', design.background_color);
    formdata.append('backgroundImage', design.background_image);
    formdata.append('backgroundType', design.background_type);
    formdata.append('buttonType', design.button_type);
    formdata.append('buttonColor', design.button_color);
    formdata.append('textColor', design.text_color);
    formdata.append('picture', design.picture);
    formdata.append('font', design.font);

    return this.http.post(this.BASE_PATH, formdata);
  }

  updateDesign(
    design: any,
    id: number,
    fileAvatar?: any,
    file?: any
  ): Observable<any> {
    const formdata = new FormData();
    formdata.append('avatar', fileAvatar);
    formdata.append('background-image', file);
    formdata.append('name', design.name);
    formdata.append('type', design.type);
    formdata.append('backgroundColor', design.background_color);
    formdata.append('backgroundType', design.background_type);
    formdata.append('backgroundImage', design.background_image);
    formdata.append('buttonType', design.button_type);
    formdata.append('buttonColor', design.button_color);
    formdata.append('textColor', design.text_color);
    formdata.append('font', design.font);
    formdata.append('picture', design.picture);

    return this.http.put(this.BASE_PATH + '/' + id, formdata);
  }

  deleteDesign(id: number): Observable<any> {
    return this.http.delete(this.BASE_PATH + '/' + id);
  }

  deleteListDesign(designs:any[]): Observable<any>{
    return this.http.post(this.BASE_PATH+'/delete/list',designs);
  }

  getAllDesign(page: number, pageSize: number, name: string=''): Observable<any> {
    let param = new HttpParams();
    param = param.append('name', name);
    param = param.append('page', page);
    param = param.append('page-size', pageSize);
    return this.http.get(this.BASE_PATH, { params: param });
  }

  getByNameDesign(name: string): Observable<any> {
    return this.http.get(this.BASE_PATH + '/name/' + name);
  }
}
