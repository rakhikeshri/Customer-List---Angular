import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomerModel } from '../models/customer';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {


  // services/states needed for new customer modal ------------------------------------------
  private modalTrigger = new Subject<void>();
  modalTrigger$ = this.modalTrigger.asObservable();

  triggerModal() {
    this.modalTrigger.next();
  }



  // api calls and functions -----------------------------------------------------------------

  private apiURL = 'https://json-server-customers.onrender.com/customers'

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  http = inject(HttpClient)

  getCustomers(): Observable<CustomerModel[]> {
    return this.http.get<CustomerModel[]>(this.apiURL)
  }

  createCustomer(customer: CustomerModel): Observable<CustomerModel> {
    return this.http.post<CustomerModel>(this.apiURL, customer, this.httpOptions);
  }

  deleteCustomer(customerId: string): Observable<void> {
    const url = `${this.apiURL}/${customerId}`;
    return this.http.delete<void>(url, this.httpOptions);
  }

}
