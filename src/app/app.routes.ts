import { Routes } from '@angular/router';
import { CustomerListComponent } from './pages/customers/customer-list/customer-list.component';

export const routes: Routes = [
    {
        path:'', redirectTo: 'customers', pathMatch: 'full'
    },
    {
        path:'customers', component: CustomerListComponent 
    },
];
