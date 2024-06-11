import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const DevURL = 'http://localhost:3000/API/Customer_Referral/';
// const StageURL = 'http://vilfresh-admin.pptssolutions.com/API/Customer_Referral/';
// const LiveURL = 'https://admin.vilfresh.in/API/Customer_Referral/';


const httpOptions = {
  headers: new HttpHeaders({  'Content-Type':  'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CustomerReferralService {

   constructor(private http: HttpClient) {  }

   Customer_Referral_List(data: any): Observable<any> {
     return this.http.post<any>(DevURL + 'Customer_Referral_List', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
   }
}
