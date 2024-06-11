import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const DevURL = 'http://localhost:3000/API/Global_Management/';
// const StageURL = 'http://vilfresh-admin.pptssolutions.com/API/Global_Management/';
// const LiveURL = 'https://admin.vilfresh.in/API/Global_Management/';


const httpOptions = {
   headers: new HttpHeaders({  'Content-Type':  'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class CommonService {


   constructor(private http: HttpClient) { }

   GetCountries(data: any): Observable<any> {
      return this.http.post<any>(DevURL + 'Country_List' , data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
   }

   GetStates(data: any): Observable<any> {
      return this.http.post<any>(DevURL + 'State_List', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
   }

   GetCities(data: any): Observable<any> {
      return this.http.post<any>(DevURL + 'City_List', data, httpOptions).pipe( map(res => res), catchError(err => of(err.error)) );
   }

}
