import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const DevURL = 'http://localhost:3000/API/Support_Management/';
// const StageURL = 'http://vilfresh-admin.pptssolutions.com/API/Support_Management/';
// const LiveURL = 'https://admin.vilfresh.in/API/Support_Management/';


const httpOptions = {
  headers: new HttpHeaders({  'Content-Type':  'application/json' })
};

@Injectable({
  providedIn: 'root'
})
// /API/Support_Management/User_Update_CustomerSupport
export class CustomerSupportService {
  constructor(private http: HttpClient) {  }

  All_CustomerSupport_List(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'All_SupportManagement_List', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
  }

  SupportTitle_List(): Observable<any> {
    return this.http.post<any>(DevURL + 'SimpleList_For_SupportTitle',  httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
  }

  SupportTitle_Create(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'SupportTitle_Create', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
  }

  CustomerSupport_Update(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'User_Update_CustomerSupport', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
  }

   CustomerSupport_Closed(data: any): Observable<any> {
     return this.http.post<any>(DevURL + 'Customer_Support_Closed', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
   }

   SupportTitle_AsyncValidate(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'SupportTitle_AsyncValidate' , data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
  }

  SupportTitle_Update(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'SupportTitle_Update' , data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
  }

  SupportTitles_List(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'SupportTitle_List' , data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
  }
  SupportTitleActive(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'SupportTitleActiveStatus' , data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
  }

  SupportTitleInActive(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'SupportTitleInActiveStatus' , data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
  }

  SimpleSupportTitle_List(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'SimpleSupportTitle_List', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
  }
}
