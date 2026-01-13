import { Routes } from "@angular/router";
import { OrderListComponent } from "./pages/order-list-component/order-list-component";
import { OrderFormComponent } from "./pages/order-form-component/order-form-component";
import { OrderDetailComponent } from "./pages/order-detail-component/order-detail-component";

export default [
    {
        path: '',
        component: OrderListComponent
    },
    {
        path: 'create',
        component: OrderFormComponent
    },
    {
        path: ':id',
        component: OrderDetailComponent
    }
] as Routes