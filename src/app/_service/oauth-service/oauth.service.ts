import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OauthService {
  oauthURL = 'http://profilelink.ap-south-1.elasticbeanstalk.com/login/oauth';

  constructor(private httpClient: HttpClient) { }

  public google(token: any): Observable<any> {
    const tokenDto={value:token};
    return this.httpClient.post(this.oauthURL + '/google', tokenDto);
  }

  public facebook(token: any): Observable<any> {
    const tokenDto={value:token};
    return this.httpClient.post(this.oauthURL + '/facebook', tokenDto);
  }

}
