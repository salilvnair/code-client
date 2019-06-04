import { Injectable } from '@angular/core';
import { BitbucketService } from '../client/bitbucket/service/bitbucket.service';
import { Subject } from 'rxjs';

@Injectable({
    providedIn:'root'
})
export class HeaderService {
    logoSrcNotifier = new Subject<string>();
    constructor(private bitbucketService:BitbucketService){}

    logoSrcListener() {
        return this.logoSrcNotifier.asObservable();
    }

    changeHeader(defaultTitle:boolean) {
        let isPublic = this.bitbucketService.getSelectedDashBoardData().public;
        let logoSrc: string;
        if(isPublic){
            logoSrc = "assets/icon/public_repo.svg";             
            this.logoSrcNotifier.next(logoSrc);
        }
        else {
            logoSrc = "assets/icon/private_repo.svg";  
            this.logoSrcNotifier.next(logoSrc);
        }
        if(defaultTitle){
            document.getElementById('headerTitle').innerText = "Code Client";
            logoSrc = "assets/logo/code-client-64.png";  
            this.logoSrcNotifier.next(logoSrc);
        }
        else{
            if(this.bitbucketService.getSelectedDashBoardData()) {
                document.getElementById('headerTitle').innerText = this.bitbucketService.getSelectedDashBoardData().repo_name;
            }
            else{
                document.getElementById('headerTitle').innerText = "Code Client";
                logoSrc = "assets/logo/code-client-64.png";  
                this.logoSrcNotifier.next(logoSrc);
            }
        }
    }

}