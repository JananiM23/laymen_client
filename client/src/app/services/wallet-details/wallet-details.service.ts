import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const DevURL = 'http://localhost:3000/API/VilfreshMoney_management/';
// const StageURL = 'http://vilfresh-admin.pptssolutions.com/API/VilfreshMoney_management/';
// const LiveURL = 'https://admin.vilfresh.in/API/VilfreshMoney_management/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class WalletDetailsService {

  constructor(private http: HttpClient) { }

  Wallet_Create(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'Add_VilfreshMoney', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
  }

  All_Wallet_List(data: any): Observable<any> {
    return this.http.post<any>(DevURL + 'VilfreshMoney_TransferHistory', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
  }

}
