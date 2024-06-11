import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const DevURL = 'http://localhost:3000/API/DeliveryPersonManagement/';
// const StageURL = 'http://vilfresh-admin.pptssolutions.com/API/DeliveryPersonManagement/';
// const LiveURL = 'https://admin.vilfresh.in/API/DeliveryPersonManagement/';




const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DeliveryPersonDetailsService {

  constructor(private http: HttpClient) { }

  DeliveryPerson_Create(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'Register', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
  }

  All_DeliveryPerson_List(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'DeliveryPersonDetails_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
  }

  DeliveryPerson_View(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'DeliveryPersonDetails_Edit', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
  }

  DeliveryPerson_Update(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'DeliveryPerson_Details_Update', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
  }

  DeliveryLines_List(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'DeliveryLines_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
  }

  DeliveryPerson_Edit(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'DeliveryPersonDetails_Edit', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
  }
  DeliveryPersonActive_Status(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'User_Update_DeliveryBoy_Approval', data, httpOptions)
    .pipe(map(res => res), catchError(err => of(err.error)));
  }

  DeliveryPersonInActive_Status(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'User_Update_DeliveryBoy_Inactive', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
  }

  DeliveryBoy_Delete(data: any): Observable<any> {
	return this.http.post<any>(DevURL + 'DeliveryBoy_Delete', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
 }

  Deliveryboy_List(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'Available_DeliveryPersonList', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
  }

  DeliveryPerson_AssignedOrders(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'DeliveryPerson_AssignedOrders', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
  }

  Deliveryboy_Attendance(data: any): Observable<any> {
    console.log(data);
    return this.http.post<any>(DevURL + 'Create', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
  }

  LaterDeliveryBoy(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'LaterAttendance_DeliveryPersonList', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
  }
}
