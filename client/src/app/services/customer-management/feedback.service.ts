import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const DevURL = 'http://localhost:3000/API/CustomerManagement/';
// const StageURL = 'http://vilfresh-admin.pptssolutions.com/API/CustomerManagement/';
// const LiveURL = 'https://admin.vilfresh.in/API/CustomerManagement/';


const httpOptions = {
  headers: new HttpHeaders({  'Content-Type':  'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient) {  }

  All_CustomerFeedback_List(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'All_Feedback_List', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
  }

}
