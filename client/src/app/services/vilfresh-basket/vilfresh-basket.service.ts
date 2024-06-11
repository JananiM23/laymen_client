import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const DevURL = 'http://localhost:3000/API/VilfreshBasket_Management/';
// const StageURL = 'http://vilfresh-admin.pptssolutions.com/API/VilfreshBasket_Management/';
// const LiveURL = 'https://admin.vilfresh.in/API/VilfreshBasket_Management/';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class VilfreshBasketService {

   constructor(private http: HttpClient) { }

   Vilfresh_BasketList(data: any): Observable<any> {
      return this.http.post<any>(DevURL + 'CustomerBasket_Requests_OnDate', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
   }

   Vilfresh_Basket_Create(data: any): Observable<any> {
      return this.http.post<any>(DevURL + 'VBasketPOGenerate_Validate', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
   }

   PurchaseOrder_History(data: any): Observable<any> {
      return this.http.post<any>(DevURL + 'PurchaseOrder_History', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
   }

   PurchaseDate_Validation(data: any): Observable<any> {
      return this.http.post<any>(DevURL + 'PurchaseDate_Validation', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
   }

   Vilfresh_Product(data: any): Observable<any> {
      return this.http.post<any>(DevURL + 'Vilfresh_ProductList', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
   }

   Config_Create(data: any): Observable<any> {
      return this.http.post<any>(DevURL + 'Vilfresh_Product_Config', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
   }

   Config_Product_List(data: any): Observable<any> {
      return this.http.post<any>(DevURL + 'Config_Product_List', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
   }

   Config_Dates(data: any): Observable<any> {
      return this.http.post<any>(DevURL + 'Config_Dates', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
   }

   VBasket_POGenerate(data: any): Observable<any> {
      return this.http.post<any>(DevURL + 'VBasket_POGenerate', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
   }

   ExtraConfig_ProductList(data: any): Observable<any> {
      return this.http.post<any>(DevURL + 'ExtraProductList', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
   }

   ExtraConfig_ProductAdd(data: any): Observable<any> {
      return this.http.post<any>(DevURL + 'ExtraProductAdd', data, httpOptions).pipe(map(res => res), catchError(err => of(err.error)));
   }
}
