import {SupplierList} from './pages/supplier-list/supplier-list';
import {SupplierForm} from './pages/supplier-form/supplier-form';
import {SupplierDetail} from './pages/supplier-detail/supplier-detail';
import {Routes} from '@angular/router';


export default [
  {
    path: '',
    component: SupplierList
  },
  {
    path: 'create',
    component: SupplierForm
  },
  {
    path: ':id',
    component: SupplierDetail
  }
] as Routes;
