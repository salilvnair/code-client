import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiSettingService } from '../setting/api-setting.service';



@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {
    constructor(private apiSettingService: ApiSettingService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${this.apiSettingService.getAuthenticationToken()}`
            }
        });

        return next.handle(request);
    }
}