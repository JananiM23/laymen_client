import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const DevURL = 'http://localhost:3000/API/Delivery_line/';
// const StageURL = 'http://vilfresh-admin.pptssolutions.com/API/Delivery_line/';
// const LiveURL = 'https://admin.vilfresh.in/API/Delivery_line/';


const httpOptions = {
  headers: new HttpHeaders({  'Content-Type':  'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  constructor(private http: HttpClient) { }

  DeliveryLine_Create(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'VilfreshDelivery_lines_Create' , data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
  }

  DeliveryLine_List(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'VilfreshDeliveryLines_List' , data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
  }

  SessionBased_DeliveryLines(data: any): Observable<any> {
   return this.http.post<any>(DevURL + 'SessionBased_DeliveryLines' , data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
 }

  AllDeliveryLine_List(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'AllVilfreshDeliveryLines_List', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
  }

  DeliveryLine_Edit(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'VilfreshDeliveryLines_Edit' , data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
  }

  DeliveryLine_Delete(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'VilfreshDeliveryLines_Delete' , data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
  }

  DeliveryLine_Update(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'VilfreshDelivery_lines_Update' , data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
  }

  DeliveryPersonList(data: any): Observable<any> {
    return this.http.post<any>(DevURL + '' , data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
  }

  DeliveryBoy_AsyncValidate(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'DeliveryBoy_AsyncValidate' , data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
  }

}
