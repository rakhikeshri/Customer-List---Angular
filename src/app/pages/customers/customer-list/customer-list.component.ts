import { Component, inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CustomerService } from '../../../service/customer.service';
import { CustomerModel } from '../../../models/customer';
import { CommonModule } from '@angular/common';
import { NewCustomerModalComponent } from '../new-customer-modal/new-customer-modal.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, CommonModule, NewCustomerModalComponent, FormsModule],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css'
})

export class CustomerListComponent implements OnInit {

  customerService = inject(CustomerService)

  customerList: CustomerModel[] = []
  filteredCustomerList: CustomerModel[] = []
  searchTerm: string = ''

  isLoading: boolean = true

  getCustomerList() {
    this.customerService.getCustomers().subscribe(res => {
      this.customerList = res;
      this.filteredCustomerList = res;
      this.isLoading = false
    });
  }

  deleteCustomer(customerId: string) {

    console.log('customerId', customerId)


    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(customerId).subscribe(() => {
        // Removing deleted customer from the local list as well
        this.customerList = this.customerList.filter(customer => customer.id !== customerId);
        this.filteredCustomerList = this.filteredCustomerList.filter(customer => customer.id !== customerId);
      });
    }
  }

  ngOnInit() {
    this.getCustomerList()
  }

  openModal() {
    this.customerService.triggerModal();
  }

  onCustomerCreated(newCustomer: CustomerModel): void {
    this.customerList = [...this.customerList, newCustomer,];
    this.filteredCustomerList = [...this.filteredCustomerList, newCustomer];
  }

  filterCustomers() {
    const term = this.searchTerm.toLowerCase().trim();

    this.filteredCustomerList = this.customerList.filter(customer => {
      const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
      return (
        fullName.includes(term) ||
        customer.email.toLowerCase().includes(term)
      );
    });
  }

}
