import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as CustomerActions from "./customer.actions";
import { map, switchMap, catchError, of } from "rxjs";
import { CustomerService } from "../services/customer.service";

@Injectable()
export class ClientEffects {
    private actions$ = inject(Actions);
    private customerApi = inject(CustomerService);

    loadCustomers$ = createEffect(() => 
        this.actions$.pipe(
            ofType(CustomerActions.loadCustomers),
            
            switchMap(({ page, size, sortBy }) =>
                this.customerApi.getCustomers(page, size, sortBy).pipe(
                    map(response => CustomerActions.loadCustomersSuccess({
                        customers: response.content,
                        totalPages: response.totalPages,
                        totalElements: response.totalElements,
                        size: response.size,
                        number: response.number
                    })),
                    catchError(error => {
                        console.error('Error loading customers:', error);
                        return of(CustomerActions.loadCustomersSuccess({
                            customers: [],
                            totalPages: 0,
                            totalElements: 0,
                            size: 10,
                            number: 0
                        }));
                    })
                )
            )
        )
    );
}