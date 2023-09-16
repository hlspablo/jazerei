import { inject } from "@angular/core"
import { CanActivateFn, Router } from "@angular/router"
import { AuthService } from "../services/auth.service"
import { tap } from "rxjs"

export const authGuard: CanActivateFn = (route, state) => {
  const _authService = inject(AuthService)
  const _routeService = inject(Router)

  return _authService.isAuthenticated().pipe(
    tap((isAuthenticated) => {
      if (!isAuthenticated) {
        _routeService.navigate(["/"])
      }
    }),
  )
}
