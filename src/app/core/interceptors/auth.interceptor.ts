import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { KeycloakService } from "../services/keycloak-service";
import { catchError, from, switchMap } from "rxjs";


export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const keycloakService = inject(KeycloakService);

    if (!req.url.includes('/api')) {
        return next(req);
    }
    
    return from(keycloakService.updateToken(30)).pipe(
        switchMap(() => {
            const token = keycloakService.getToken();
            
            if (token) {
                // Clone request and add authorization header
                req = req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("✅ Token added to request headers", req.headers.get('Authorization'));
            } else {
                console.warn("⚠️ No token available - user might not be authenticated!");
            }
            
            return next(req);
        }),
        catchError((error) => {
            console.error('❌ Error in auth interceptor:', error);
            return next(req);
        })
    );
}