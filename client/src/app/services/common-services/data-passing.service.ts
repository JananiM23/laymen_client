import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataPassingService {

  private CustomerNameData = new BehaviorSubject('');
  CustomerName = this.CustomerNameData.asObservable();

  private AllFieldsData = new BehaviorSubject([]);
  AllFields = this.AllFieldsData.asObservable();
  
  private CustomerUniqueData = new BehaviorSubject('');
  CustomerUnique = this.CustomerUniqueData.asObservable();

  constructor() { }
  UpdateCustomerNameData(Data: any) {
    this.CustomerNameData.next(Data);
  }

  UpdateCustomerUniqueData(Data: any) {
    this.CustomerUniqueData.next(Data);
  }
}
