import { createAction, props } from "@ngrx/store";
import { Customer } from "../models/customer.model";


export const loadCustomers = createAction(
    '[Customer List Page] Load Customers',
    props<{page: number, size: number, sortBy?: string}>()
);

export const loadCustomersSuccess = createAction(
    '[Customer List Page] Load Customers Success',
    props<
    {
        customers: Customer[],
        totalElements: number,
        totalPages: number,
        size: number,
        number: number}
    >()
);

