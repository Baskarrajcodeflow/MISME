import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/api/api.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AmountLimit, Cashback, ChargesAndCommission, ChargesAndCommissionSlabwise, FeesAndCommission, FeesAndCommissionSlabwise, TaxComponent, TransactionLimit } from './models/model';

@Injectable({
  providedIn: 'root'
})
export class ProductManagementService {

  constructor(private apiService : ApiService) { }

  private apiUrl = environment.apiUrl + 'pm';
  endpoint : string = '';

  //AmountLimit
  getAmountLimit(id : string):Observable<any>{
    this.endpoint = 'amountlimit/'+ `${id}`;
    return this.apiService.get<any>(this.endpoint);    
  }

  createAmountLimit(amountLimit : AmountLimit): Observable <AmountLimit>{
    this.endpoint = 'amountlimit';
    return this.apiService.post<AmountLimit>(this.endpoint,amountLimit);
  }

  updateAmountLimit(id : string, amountlimit : AmountLimit): Observable <AmountLimit>{
    this.endpoint = 'amountlimit/'+`${id}`;
    return this.apiService.put<AmountLimit>(this.endpoint,amountlimit);
  }

  deleteAmountLimit(id : string) : Observable <void>{
    this.endpoint = 'amountlimit/'+`${id}`;
    return this.apiService.delete<void>(this.endpoint);
  }
  //Cashback
  getCashback(id : string):Observable<any>{
    this.endpoint = 'cashback/'+ `${id}`;
    return this.apiService.get<any>(this.endpoint);    
  }

  createCashback(cashback : Cashback): Observable <Cashback>{
    this.endpoint = 'cashback';
    return this.apiService.post<Cashback>(this.endpoint,cashback);
  }

  updateCashback(id : string, cashback : Cashback): Observable <Cashback>{
    this.endpoint = 'cashback/'+`${id}`;
    return this.apiService.put<Cashback>(this.endpoint,cashback);
  }

  deleteCashback(id : string) : Observable <void>{
    this.endpoint = 'cashback/'+`${id}`;
    return this.apiService.delete<void>(this.endpoint);
  }

   //ChargesAndCommission
  getChargesAndCommission(id : string):Observable<any>{
    this.endpoint = 'chargesandcommission/'+ `${id}`;
    return this.apiService.get<any>(this.endpoint);    
  }

  createChargesAndCommission(chargesAndCommission : ChargesAndCommission): Observable <ChargesAndCommission>{
    this.endpoint = 'chargesandcommission';
    return this.apiService.post<ChargesAndCommission>(this.endpoint,chargesAndCommission);
  }

  updateChargesAndCommission(id : string, chargesAndCommission : ChargesAndCommission): Observable <ChargesAndCommission>{
    this.endpoint = 'chargesandcommission/'+`${id}`;
    return this.apiService.put<ChargesAndCommission>(this.endpoint,chargesAndCommission);
  }

  deleteChargesAndCommission(id : string) : Observable <void>{
    this.endpoint = 'chargesandcommission/'+`${id}`;
    return this.apiService.delete<void>(this.endpoint);
  }

  //ChargesAndCommissionSlabwise
  getChargesAndCommissionSlabwise(id : string):Observable<any>{
    this.endpoint = 'chargesandcommissionslabwise/'+ `${id}`;
    return this.apiService.get<ChargesAndCommissionSlabwise>(this.endpoint);    
  }

  createChargesAndCommissionSlabwise(chargesandcommissionslabwise : ChargesAndCommissionSlabwise): Observable <ChargesAndCommissionSlabwise>{
    this.endpoint = 'chargesandcommissionslabwise';
    return this.apiService.post<ChargesAndCommissionSlabwise>(this.endpoint,chargesandcommissionslabwise);
  }

  updateChargesAndCommissionSlabwise(id : string, chargesandcommissionslabwise : ChargesAndCommissionSlabwise): Observable <ChargesAndCommissionSlabwise>{
    this.endpoint = 'chargesandcommissionslabwise/'+`${id}`;
    return this.apiService.put<ChargesAndCommissionSlabwise>(this.endpoint,chargesandcommissionslabwise);
  }

  deleteChargesAndCommissionSlabwise(id : string) : Observable <void>{
    this.endpoint = 'chargesandcommissionslabwise/'+`${id}`;
    return this.apiService.delete<void>(this.endpoint);
  }

  //FeesAndCommission
  getFeesAndCommission(id : string):Observable<any>{
    this.endpoint = 'fees-and-commission/'+ `${id}`;
    return this.apiService.get<FeesAndCommission>(this.endpoint);    
  }

  createFeesAndCommission(feesAndCommission : FeesAndCommission): Observable <FeesAndCommission>{
    this.endpoint = 'fees-and-commission';
    return this.apiService.post<FeesAndCommission>(this.endpoint,feesAndCommission);
  }

  updateFeesAndCommission(id : string, feesAndCommission : FeesAndCommission): Observable <FeesAndCommission>{
    this.endpoint = 'fees-and-commission/'+`${id}`;
    return this.apiService.put<FeesAndCommission>(this.endpoint,feesAndCommission);
  }

  deleteFeesAndCommission(id : string) : Observable <void>{
    this.endpoint = 'fees-and-commission/'+`${id}`;
    return this.apiService.delete<void>(this.endpoint);
  }

  //FeesAndCommissionSlabwise
  getFeesAndCommissionSlabwise(id : string):Observable<any>{
    this.endpoint = 'feesandcommissionslabwise/'+ `${id}`;
    return this.apiService.get<FeesAndCommissionSlabwise>(this.endpoint);    
  }

  createFeesAndCommissionSlabwise(feesandcommissionslabwise : FeesAndCommissionSlabwise): Observable <FeesAndCommissionSlabwise>{
    this.endpoint = 'feesandcommissionslabwise';
    return this.apiService.post<FeesAndCommissionSlabwise>(this.endpoint,feesandcommissionslabwise);
  }

  updateFeesAndCommissionSlabwise(id : string, feesandcommissionslabwise : FeesAndCommissionSlabwise): Observable <FeesAndCommissionSlabwise>{
    this.endpoint = 'feesandcommissionslabwise/'+`${id}`;
    return this.apiService.put<FeesAndCommissionSlabwise>(this.endpoint,feesandcommissionslabwise);
  }

  deleteFeesAndCommissionSlabwise(id : string) : Observable <void>{
    this.endpoint = 'feesandcommissionslabwise/'+`${id}`;
    return this.apiService.delete<void>(this.endpoint);
  }

  //TransactionLimit
  getTransactionLimit(id : string):Observable<any>{
    this.endpoint = 'transactionlimit/'+ `${id}`;
    return this.apiService.get<TransactionLimit>(this.endpoint);    
  }

  createTransactionLimit(transactionlimit : TransactionLimit): Observable <TransactionLimit>{
    this.endpoint = 'transactionlimit';
    return this.apiService.post<TransactionLimit>(this.endpoint,transactionlimit);
  }

  updateTransactionLimit(id : string, transactionlimit : TransactionLimit): Observable <TransactionLimit>{
    this.endpoint = 'transactionlimit/'+`${id}`;
    return this.apiService.put<TransactionLimit>(this.endpoint,transactionlimit);
  }

  deleteTransactionLimit(id : string) : Observable <void>{
    this.endpoint = 'transactionlimit/'+`${id}`;
    return this.apiService.delete<void>(this.endpoint);
  }

  
  //TaxComponent
  getTaxComponent(id : string):Observable<any>{
    this.endpoint = 'taxcomponent/'+ `${id}`;
    return this.apiService.get<TaxComponent>(this.endpoint);    
  }

  createTaxComponent(taxcomponent : TaxComponent): Observable <TaxComponent>{
    this.endpoint = 'taxcomponent';
    return this.apiService.post<TaxComponent>(this.endpoint,taxcomponent);
  }

  updateTaxComponent(id : string, taxcomponent : TaxComponent): Observable <TaxComponent>{
    this.endpoint = 'taxcomponent/'+`${id}`;
    return this.apiService.put<TaxComponent>(this.endpoint,taxcomponent);
  }

  deleteTaxComponent(id : string) : Observable <void>{
    this.endpoint = 'taxcomponent/'+`${id}`;
    return this.apiService.delete<void>(this.endpoint);
  }

}
