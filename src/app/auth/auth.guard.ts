import { Injectable, } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, CanMatchFn, Route, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate: CanActivateFn =
        (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
            //Instead of constructor
            // const authService: AuthService = inject(AuthService);
            // const router: Router = inject(Router);
            if (this.authService.isAuth()) {
                return true;
            } else {
                this.router.navigate(['/login']);
                return false;
            }
        }

    canMatch: CanMatchFn =
        (route: Route) => {
            if (this.authService.isAuth()) {
                return true;
            } else {
                this.router.navigate(['/login']);
                return false;
            }
        }
}