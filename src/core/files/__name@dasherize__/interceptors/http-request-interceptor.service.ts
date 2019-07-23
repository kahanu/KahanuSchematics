import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class HttpRequestInterceptorService implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    switch (req.url) {
      case `${environment.Api}/token`:
        const clonedRequest = req.clone({
          headers: req.headers.set('Content-Type', 'application/json'),
          withCredentials: true
        });

        return next.handle(clonedRequest);
      case `${environment.Api}/upload/post`:
          /** Uploads cannot contain Content-Type application/json.  Must be of type application/x-www-form-urlencoded.
           * So this is assuming that the application/json content type has already been set for the request.
           */
        const deletedReq = req.clone({
          headers: req.headers.delete('Content-Type')
        });
        
        return next.handle(deletedReq);
      default:
        const clonedReq = req.clone({
          headers: req.headers.set('Content-Type', 'application/json')
        });
        return next.handle(clonedReq);
      }
  }
}
