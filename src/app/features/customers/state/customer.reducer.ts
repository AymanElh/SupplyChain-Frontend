import { createReducer, on } from "@ngrx/store";
import { initialCustomerState } from "./customer.state";
import * as CustomerActions from "./customer.actions";


export const customerReducer = createReducer(
    initialCustomerState,
    on(CustomerActions.loadCustomers, (state) => ({
        ...state,
        isLoading: true,
        error: null
    })),

    on(CustomerActions.loadCustomersSuccess, (state, {customers, totalPages, totalElements, size, number}) => ({
        ...state,
        isLoading: false,
        customers,
        totalPages,
        totalElements,
        size,
        number
    }))
)