import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerService } from '../../../service/customer.service';
import * as bootstrap from 'bootstrap';
import { CustomerModel } from '../../../models/customer';
import { EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-new-customer-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './new-customer-modal.component.html',
  styleUrls: ['./new-customer-modal.component.css']
})
export class NewCustomerModalComponent implements OnInit {


  @Output() customerCreated = new EventEmitter<CustomerModel>();

  personalDetails: boolean = true;
  contactDetails: boolean = false;
  personalForm!: FormGroup;
  contactForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  customerService = inject(CustomerService);

  ngOnInit(): void {
    this.customerService.modalTrigger$.subscribe(() => {
      this.showModal();
    });

    this.personalForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]]
    });

    this.contactForm = this.fb.group({
      address1: ['', Validators.required],
      address2: [''], // Optional
      city: ['', Validators.required],
      postalCode: ['', [Validators.required]],
      remarks: [''] // Optional
    });
  }

  showModal() {
    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  // Navigate to the contact details form
  contactDetailForm(): void {
    if (this.personalForm.valid) {
      this.personalDetails = false;
      this.contactDetails = true;
    }
  }

  // Navigate back to the personal details form
  personalDetailForm(): void {
    this.personalDetails = true;
    this.contactDetails = false;
  }

  generateUniqueId(): string {
    return Math.floor(1000 + Math.random() * 90000).toString();
  }

  save(): void {
    if (this.contactForm.valid && this.personalForm.valid) {
      const newCustomer: CustomerModel = {
        id: this.generateUniqueId(),
        ...this.personalForm.value,
        ...this.contactForm.value,
        created: new Date().toISOString(),
        status: 'Success' // Optional status field
      };

      // createCustomer API
      this.customerService.createCustomer(newCustomer).subscribe({
        next: (response) => {
          console.log('Customer created successfully:', response);
          this.customerCreated.emit(response);
          this.resetForms();
          this.closeModal(); 
          alert('customer added successfully!')
        },
        error: (error) => {
          console.error('Error creating customer:', error);
        }
      });
    }
  }

  // Reset the forms and navigate back to the personal details form
  resetForms(): void {
    this.personalForm.reset();
    this.contactForm.reset();
    this.personalDetailForm(); 
  }

  closeModal(): void {
    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance?.hide(); 
    }
  }
}
