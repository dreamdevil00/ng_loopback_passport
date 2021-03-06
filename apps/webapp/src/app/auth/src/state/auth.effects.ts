import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
// Third Party
import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/exhaustMap';
import 'rxjs/add/operator/take';


// Local
import { UserApi } from '../../../packages/api-sdk';
import * as auth from './auth.actions';
import { AuthService, AuthTypes } from '../../../packages/auth-sdk';


@Injectable()
export class AuthEffects {

  @Effect({ dispatch: false })
  localLogin = this.actions$
    .ofType(auth.AuthActions.AUTH_LOGIN)
    .do((action: auth.AuthLoginAction) => {
      const authType = action.payload.authType === 'auth-local' ? AuthTypes.AUTH_LOCAL : AuthTypes.AUTH_LDAP;
      this.authService
        .login(authType, action.payload.credentials)
        .subscribe(
          (success: any) => this.store.dispatch(new auth.AuthLoginSuccessAction(success)),
          (error) => this.store.dispatch(new auth.AuthLoginErrorAction(error))
        )
    });

  @Effect({ dispatch: false })
  loginSuccess = this.actions$
    .ofType(auth.AuthActions.AUTH_LOGIN_SUCCESS)
    .do((action: auth.AuthLoginSuccessAction) => {
      this.store.dispatch({ type: 'APP_REDIRECT_ROUTER' });
    }
  )

  @Effect({ dispatch: false })
  loginError = this.actions$
    .ofType(auth.AuthActions.AUTH_LOGIN_ERROR)
    .do((error: auth.AuthLoginErrorAction) => {
      console.log(error);
      alert(error.payload.message);
    });

  @Effect({ dispatch: false })
  logout = this.actions$
    .ofType(auth.AuthActions.AUTH_LOGOUT)
    .do((action: auth.AuthLogoutAction) => {
      this.userApi
        .logout()
        .subscribe(
          (success) => {
            this.store.dispatch(new auth.AuthLogoutSuccessAction(success));
          },
          (error) => {
            this.store.dispatch(new auth.AuthLogoutErrorAction(error));
          }
        )
    }
  )

  @Effect({ dispatch: false })
  logoutSuccess = this.actions$
    .ofType(auth.AuthActions.AUTH_LOGOUT_SUCCESS)
    .do((action: auth.AuthLogoutSuccessAction) => {
      this.router.navigate(['/']);
    }
  )

  @Effect({ dispatch: false })
  logoutError = this.actions$
    .ofType(auth.AuthActions.AUTH_LOGOUT_ERROR)
    .do((action: auth.AuthLogoutErrorAction) => {
      alert(JSON.stringify(action.payload));
    }
  )

  constructor(
    private router: Router,
    private userApi: UserApi,
    private store: Store<any>,
    private actions$: Actions,
    private authService: AuthService,
  ) { }
}
