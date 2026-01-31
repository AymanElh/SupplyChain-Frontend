import { createFeatureSelector, createSelector } from "@ngrx/store";
import { CustomerState } from "./customer.state";


export const selectCustomerState = createFeatureSelector<CustomerState>('customers');

export const selectCustomers = createSelector(
    selectCustomerState,
    (state: CustomerState) => state.customers
);

export const selectTotalPages = createSelector(
    selectCustomerState,
    (state: CustomerState) => state.totalPages
);

export const selectCurrentPage = createSelector(
    selectCustomerState,
    (state: CustomerState) => state.currentPage
);

export const selectIsLoading = createSelector(
    selectCustomerState,
    (state: CustomerState) => state.isLoading
);

export const selectTotalElements = createSelector(
    selectCustomerState,
    (state: CustomerState) => state.totalElements
);
