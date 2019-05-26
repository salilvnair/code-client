import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BitbucketSettingService } from '../setting/client/bitbucket/bitbucket-setting.service';



@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {
    constructor(private bitbucketSettingService: BitbucketSettingService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${this.bitbucketSettingService.getAuthenticationToken()}`
            }
        });

        return next.handle(request);
    }
}