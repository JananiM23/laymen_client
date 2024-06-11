import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LoginComponent } from 'src/app/components/login/login.component';

const DevURL = 'http://localhost:3000/API/Customer_Management/';
// const StageURL = 'http://vilfresh-admin.pptssolutions.com/API/Customer_Management/';
// const LiveURL = 'https://admin.vilfresh.in/API/Customer_Management/';


const httpOptions = {
  headers: new HttpHeaders({  'Content-Type':  'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class CustomerDetailsService {
 
  constructor(private http: HttpClient) {  }

  Customer_Create(data: any): Observable<any> {
   return this.http.post<any>(DevURL + 'Customer_From_Web', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
  }

 All_Customers_List(data: any): Observable<any> {
   return this.http.post<any>(DevURL + 'All_Customers_List', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
 }

 All_Transaction_History(data: any): Observable<any> {
  return this.http.post<any>(DevURL + 'All_Transaction_History', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
}


 SimpleCustomer_List(data: any): Observable<any> {
   return this.http.post<any>(DevURL + 'SimpleCustomer_List', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
 }

 FilteredCustomer_List(data: any): Observable<any> {
   return this.http.post<any>(DevURL + 'FilteredCustomer_List', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
 }

 CustomerDetails_View(data: any): Observable<any> {
   return this.http.post<any>(DevURL + 'CustomerDetails_Edit', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
 }

 CustomerDetails_Update(data: any): Observable<any> {
   return this.http.post<any>(DevURL + 'CustomerDetails_Update', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
 }
 Customer_Delete(data: any): Observable<any> {
   return this.http.post<any>(DevURL + 'Customer_Delete', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
 }

 CustomerDetails_Edit(data: any): Observable<any> {
   return this.http.post<any>(DevURL + 'CustomerDetails_Edit', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
 }
 CustomerSample_Approve(data: any): Observable<any> {
   return this.http.post<any>(DevURL + 'CustomerSample_Approve', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
 }

 Customer_Approve_WithLine(data: any): Observable<any> {
   return this.http.post<any>(DevURL + 'Customer_Approve_WithLine', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
 }

 CustomerSample_Reject(data: any): Observable<any> {
   return this.http.post<any>(DevURL + 'CustomerSample_Reject', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
 }

 Customer_DeActivate(data: any): Observable<any> {
   return this.http.post<any>(DevURL + 'Customer_DeActivate', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
 }

 Customer_ReActivate(data: any): Observable<any> {
   return this.http.post<any>(DevURL + 'Customer_ReActivate', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
 }

  Customer_view(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'Customer_view', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
  }

  MilkProduct(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'MilkProduct_Subscription', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
  }

  Analytics_Create(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'Analytics_Create', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
  }

  Analytic_Update(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'Analytic_Update', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
  }

  All_QA_List(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'All_QA_List', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
  }

  QA_Delete(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'QA_Delete', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
  }

  All_Collection_List(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'All_Collection_List', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
  }

  Collection_OnHold(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'Collection_OnHold', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
  }

  CollectionApprove(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'CollectionApprove', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
  }
  
  All_Customers_Export(data: any): Observable<any> {
   return this.http.post<any>(DevURL + 'All_Customers_Export', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
 }
}
