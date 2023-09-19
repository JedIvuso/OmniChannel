import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, map, of } from 'rxjs';
import { GlobalService } from 'src/app/shared/global.service';
import { HttpService } from 'src/app/shared/http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  obsv$: Observable<Record<string, string> | any[]>;
  returnUrl: any;
  errorMsg: string;
  public loginForm: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private _httpService: HttpService,
    private toastrService: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  submit() {
    const model = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };
    console.log(model)
    this.obsv$ = this._httpService.omniPost('/auth/login', model).pipe(
      map((resp: Record<string, any>): Record<string, string> => {
        if (resp && resp.respCode === '00') {
          console.log(resp)
          sessionStorage.setItem('isLoggedin', 'true');
          sessionStorage.setItem('token', resp.token);
          sessionStorage.setItem('email', this.loginForm.value.email);
          this.toastrService.success(resp.message, 'Signed in successfully');
          this.router.navigate(['channels']);
          return resp;
        } else {
          this.toastrService.error(resp.message, 'Login Failure');
          this.loginForm.reset();
          return resp;
        }
      }),
      catchError((error) => {
        if (error.error instanceof ErrorEvent) {
          this.errorMsg = `Error: ${error.error.message}`;
          this.toastrService.error(this.errorMsg, 'Login Error');
          this.loginForm.reset();
        } else {
          this.errorMsg = `Error: ${error.message}`;
          this.toastrService.error(this.errorMsg, 'Login Error');
          this.loginForm.reset();
        }
        return of([]);
      })
    );
  }

  onLoggedin(e: Event) {
    e.preventDefault();
    localStorage.setItem('isLoggedin', 'true');
    if (localStorage.getItem('isLoggedin')) {
      this.router.navigate([this.returnUrl]);
    }
  }
}
