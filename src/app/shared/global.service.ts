import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  public base_url: string;

  public static emailRegex: string =
    "[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}";

  public static nameRegex: string = "^[a-zA-Z-]{3,45}$";

  constructor() { 
    this.base_url = environment.base_url;
  }

  public getToken():any {
    return sessionStorage.getItem('token');
  }
}
