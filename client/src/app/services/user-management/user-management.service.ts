import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const DevURL = 'http://localhost:3000/API/User_Management/';
// const StageURL = 'http://vilfresh-admin.pptssolutions.com/API/User_Management/';
// const LiveURL = 'https://admin.vilfresh.in/API/User_Management/';


const httpOptions = {
  headers: new HttpHeaders({  'Content-Type':  'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

constructor(private http: HttpClient) { }

User_AsyncValidate(data: any): Observable<any> {
  return this.http.post<any>(DevURL + 'User_AsyncValidate', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
}

User_Create(data: any): Observable<any> {
  return this.http.post<any>(DevURL + 'User_Create', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
}

Users_List(data: any): Observable<any> {
  return this.http.post<any>(DevURL + 'Users_List' , data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
}

Users_Delete(data: any): Observable<any> {
  return this.http.post<any>(DevURL + 'Users_Delete', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
}

User_Update(data: any): Observable<any> {
  return this.http.post<any>(DevURL + 'User_Update', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
}

UserActive_Status(data: any): Observable<any> {
  return this.http.post<any>(DevURL + 'UserActive_Status', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
}

CustomerDetails_Edit(data: any): Observable<any> {
  return this.http.post<any>(DevURL + 'CustomerDetails_Edit', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
}

Customer_Create(data: any): Observable<any> {
  return this.http.post<any>(DevURL + 'Customer_Create', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
}

AllNotification_List(data: any): Observable<any> {
  return this.http.post<any>(DevURL + 'Notifications_List', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
}

Notification_Counts(data: any): Observable<any> {
  return this.http.post<any>(DevURL + 'Notification_Counts', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
}

DeleteAllRead(data: any): Observable<any> {
  return this.http.post<any>(DevURL + 'DeleteAllRead', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
}

MarkAllAsRead(data: any): Observable<any> {
  return this.http.post<any>(DevURL + 'MarkAllAsRead', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
}

Read_Notification(data: any): Observable<any> {
   return this.http.post<any>(DevURL + 'Read_Notification', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
}

}
