import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const DevURL = 'http://localhost:3000/API/AttendanceManagement/';
// const StageURL = 'http://vilfresh-admin.pptssolutions.com/API/AttendanceManagement/';
// const LiveURL = 'https://admin.vilfresh.in/API/AttendanceManagement/';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AttendanceDetailsService {

   constructor(private http: HttpClient) { }

   Deliveryboy_Attendance(data: any): Observable<any> {
      return this.http.post<any>(DevURL + 'Create', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
   }

   Attendance_List(data: any): Observable<any> {
      return this.http.post<any>(DevURL + 'MonthWise_Attendance_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
   }

   All_DeliveryPerson_AttendanceList(data: any): Observable<any> {
      return this.http.post<any>(DevURL + 'DeliveryPerson_AttendanceList', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
   }

   Attendance_SessionValidate(data: any): Observable<any> {
      return this.http.post<any>(DevURL + 'Attendance_SessionValidate', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
   }

   TodayPresent_DeliveryPersons(data: any): Observable<any> {
      return this.http.post<any>(DevURL + 'TodayPresent_DeliveryPersons', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
   }

   LaterAttendanceUpdate(data: any): Observable<any> {
      return this.http.post<any>(DevURL + 'LaterDeliveryPersonAttendanceUpdate', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
   }

   LaterDeliveryPersonUpdate(data: any): Observable<any> {
      return this.http.post<any>(DevURL + 'LaterAttendanceUpdate', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
   }

}
