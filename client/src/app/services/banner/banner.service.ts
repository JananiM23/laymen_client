import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const DevURL = 'http://localhost:3000/APP_API/BannerManagement/';
// const StageURL = 'http://vilfresh-admin.pptssolutions.com/APP_API/BannerManagement/';
// const LiveURL = 'https://admin.vilfresh.in/APP_API/BannerManagement/';



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class BannerService {

  constructor(private http: HttpClient) { }

  Banner_Create(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'Register', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
  }

  All_Banner_List(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'Banner_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
  }

  Banner_View(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'Banner_View', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
  }

  Banner_Update(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'Banner_Update', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
  }

  Banner_Delete(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'Banner_Delete', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
  }

  Banner_Edit(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'Banner_Edit', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
  }
  BannerActive_Status(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'Banner_Active', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
  }

  BannerInActive_Status(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'Banner_Inactive', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
  }
}
