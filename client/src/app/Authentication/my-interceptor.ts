
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
   providedIn: 'root'
})
export class MyInterceptor implements HttpInterceptor {

   AuthorizeKey = '';

   constructor() {
   }

   intercept( request: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {
      if (localStorage.getItem('Session') && localStorage.getItem('SessionKey')) {
         // tslint:disable-next-line:max-line-length
         let UserData = CryptoJS.AES.decrypt(localStorage.getItem('Session'), localStorage.getItem('SessionKey').slice(3, 10)).toString(CryptoJS.enc.Utf8);
         UserData = JSON.parse(UserData);
         UserData.Token = localStorage.getItem('SessionKey');
         this.AuthorizeKey = CryptoJS.SHA512(JSON.stringify(UserData)).toString(CryptoJS.enc.Hex);
         localStorage.setItem('SessionVerify', btoa(Date()));
      }
      const updatedRequest = request.clone({
        headers: request.headers.set('Authorization', this.AuthorizeKey)
      });
      return next.handle(updatedRequest);
   }

}
