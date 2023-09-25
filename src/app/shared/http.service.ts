import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from "@angular/common/http";
import { GlobalService } from './global.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient, private _globalService: GlobalService) { }

  private getHeaders(): any {
    return {
      headers: new HttpHeaders({
        // 'Content-Type': 'application/json',
        // Authorization: 'Bearer ' + this._globalService.getToken()
      })
    };
  }

  private getHeader(): any {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'multipart/form-data'
      })
    };
  }

  private getHeadersWithoutBearer(): HttpHeaders {
    return new HttpHeaders({
      "Content-Type": "application/json",
    });
  }

  public omniPostLogin(endpoint: string, model: any): any {
    return this.http
      .post(
        this._globalService.base_url + endpoint,
        model,
        this.getHeaders()
      )
      .pipe(
        map((response) => {
          console.log(response)
          response = response;
          return response;
        })
      );
  }

  public omniPost(endpoint: string, model: any): any {
    return this.http
      .post(
        this._globalService.base_url + endpoint,
        model,
        this.getHeaders()
      )
      .pipe(
        map((response) => {
          console.log(response)
          response = response;
          return response;
        })
      );
  }

  public login(endpoint: any, model: any): any {
    return this.http.post(this._globalService.base_url + endpoint, model, {
      headers: this.getHeaders(),
    });
  }
}
