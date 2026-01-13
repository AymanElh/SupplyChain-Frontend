import { Routes } from "@angular/router";
import { OrderListComponent } from "./pages/order-list-component/order-list-component";
import { OrderFormComponent } from "./pages/order-form-component/order-form-component";

export default [
    {
        path: '',
        component: OrderListComponent
    },
    {
        path: 'create',
        component: OrderFormComponent
    }
] as Routes