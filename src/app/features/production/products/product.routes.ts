import { ProductList } from './pages/product-list/product-list';
import { ProductForm } from './pages/product-form/product-form';
import { ProductDetail } from './pages/product-detail/product-detail';
import { Routes } from '@angular/router';


export default [
    {
        path: '',
        component: ProductList
    },
    {
        path: 'create',
        component: ProductForm
    },
    {
        path: ':id',
        component: ProductDetail
    },
    {
        path: ':id/edit',
        component: ProductForm
    }
] as Routes;
