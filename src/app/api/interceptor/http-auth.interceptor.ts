import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { BitbucketSettingService } from '../setting/client/bitbucket/bitbucket-setting.service';
import { catchError, timeout } from 'rxjs/operators';
import { InfoNotifier } from '@ngxeu/notifier';
import { MatHeaderProgressData } from 'src/app/util/mat-header-progress/mat-header-progress.data';

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {
    constructor(
        private bitbucketSettingService: BitbucketSettingService,
        private infoNotifier:InfoNotifier,
        private matHeaderProgressData:MatHeaderProgressData
        ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${this.bitbucketSettingService.getAuthenticationToken()}`
            }
        });
        return next.handle(request)
         // add error handling
         .pipe(
            catchError(
                (error: any, caught: Observable<HttpEvent<any>>) => {
                    let requestUrl = request.url;
                    let isAppUpdateUrl = false;
                    if(requestUrl.indexOf('codeclient/releases')>-1){
                        isAppUpdateUrl = true;
                    }
                    if (error.status === 0 && !isAppUpdateUrl) {
                        this.handleUnknownError();
                        return of(error);
                    }
                    else if (error.status === 404) {
                        this.handleNotFoundError();
                        return of(error);
                    }
                    throw error;
                }
            ),
        );
}

    private handleUnknownError() {
        this.matHeaderProgressData.setHidden(true);
        this.infoNotifier.notify("Unknown error occured, please check your internet connection and try again later!","400px");
    }

    private handleNotFoundError() {
        this.matHeaderProgressData.setHidden(true);
        this.infoNotifier.notify("Endpoint which you are trying gave 404!","400px");
    }

}