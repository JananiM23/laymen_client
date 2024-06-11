import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const DevURL = 'http://localhost:3000/API/VilfreshCredit_management/';
// const StageURL = 'http://vilfresh-admin.pptssolutions.com/API/VilfreshCredit_management/';
// const LiveURL = 'https://admin.vilfresh.in/API/VilfreshCredit_management/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CreditDetailsService {

  constructor(private http: HttpClient) { }

  Credit_Create(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'Add_VilfreshCredit', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
  }

  All_Credit_List(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'VilfreshCredit_TransferHistory', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
  }
}
