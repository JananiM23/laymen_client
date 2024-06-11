import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const DevURL = 'http://localhost:3000/API/NotificationManagement/';
// const StageURL = 'http://vilfresh-admin.pptssolutions.com/API/User_Management/';

const httpOptions = {
  headers: new HttpHeaders({ 'content-type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class NotificationManagementService {

  constructor(private http: HttpClient) { }

  BulkSMSNotification(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'BulkSMSNotification', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)));
  }

  BulkWhatsappNotification(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'BulkWhatsappNotification', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)));
  }

  sendTimeToAPI(selectedTime: string): Observable<any> {
    return this.http.post<any>(DevURL + 'CronJobMessage', { time: selectedTime }, httpOptions).pipe( map(res => res), catchError(err => of(err.error)));
    // return this.http.post<any>('your-api-endpoint', { time: selectedTime });
  }

  // List only
  NotificationManagement_List(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'NotificationManagement_List', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
  }

  // Demo SMS service
  twilioSMS(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'twilioSMS', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
 }
}
