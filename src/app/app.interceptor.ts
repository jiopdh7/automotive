import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
  HttpHeaders
} from "@angular/common/http";
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';


@Injectable()
export class MyInterceptor implements HttpInterceptor {
  constructor(private cRouter: Router) {

   }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token: string = localStorage.getItem("Token") ? localStorage.getItem("Token") : '11D56EDB-307B-491D-919E-52E9FE091106';
    const accountId :string = localStorage.getItem("AccountId") ? localStorage.getItem("AccountId") : '';
    const companyId :string = localStorage.getItem("CompanyId") ? localStorage.getItem("CompanyId") : '';
    const credentialId :string = localStorage.getItem("CredentialId") ? localStorage.getItem("CredentialId") : '';
    const originId :string = "1";
    const sessiontoken:string = localStorage.getItem("SessionId") ? localStorage.getItem("SessionId") : '';
    let request = req;
    if (token) {
      request = req.clone({
        setHeaders: {
          "x-apitoken": `${token}` + ':' + `${accountId}` + ':' + `${companyId}`
        }
      });
    }
    if(credentialId){
      request = request.clone({
        setHeaders: {
          "x-credentialId": `${credentialId}`
        }
      });
    }
    if(originId){
      request = request.clone({
        setHeaders: {
          "x-originId": `${originId}`
        }
      });
    }
    if(sessiontoken){
      request = request.clone({
        setHeaders: {
          "x-sessiontoken": `${sessiontoken}`
        }
      });
    }
    return next.handle(request).pipe(tap(event => {
      if (event instanceof HttpResponse) { 
        //        
      }
    },error => { 
      if (error.status == 403) {  
        localStorage.clear();
        this.cRouter.navigate(["/logon/credential"]); 
      }
    })); 
  }
}