import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const DevURL = 'http://localhost:3000/API/Order_Management/';
// const StageURL = 'http://vilfresh-admin.pptssolutions.com/API/Order_Management/';
// const LiveURL = 'https://admin.vilfresh.in/API/Order_Management/';


const httpOptions = {
  headers: new HttpHeaders({  'Content-Type':  'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class OrderManagementService {

   constructor(private http: HttpClient) { }

   Today_Orders(data: any): Observable<any> {
      return this.http.post<any>(DevURL + 'Today_Orders', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
   }

   Confirm_TodayOrders(data: any): Observable<any> {
      return this.http.post<any>(DevURL + 'Confirm_TodayOrders', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
   }

   Order_List(data: any): Observable<any> {
      return this.http.post<any>(DevURL + 'Order_List', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
   }

   Confirm_TodayOrders_WithAssign(data: any): Observable<any> {
      return this.http.post<any>(DevURL + 'Confirm_TodayOrders_WithAssign', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
   }

   Deliveryboy_List(data: any): Observable<any> {
      return this.http.post<any>(DevURL + 'DeliveryPerson_Tracking', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
   }

   OrderedProduct_List(data: any): Observable<any> {
      return this.http.post<any>(DevURL + 'OrderedProduct_List', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
   }

   AllOrderedProduct_List(data: any): Observable<any> {
      return this.http.post<any>(DevURL + 'AllOrderedProduct_List', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
   }

   AllCustomersOrder_List(data: any): Observable<any> {
      return this.http.post<any>(DevURL + 'AllCustomersOrder_List', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
   }

   Subscription_Orders(data: any): Observable<any> {
      return this.http.post<any>(DevURL + 'Subscription_Orders', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
   }

   DeliveryPerson_TodayOrders(data: any): Observable<any> {
      return this.http.post<any>(DevURL + 'DeliveryPerson_TodayOrders', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
   }

 
}
