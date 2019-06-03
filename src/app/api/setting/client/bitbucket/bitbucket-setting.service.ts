import { Injectable } from '@angular/core';
import { CodeClientSettingService } from 'src/app/settings/service/codeclient-settings.service';
import { BitbucketContext } from './type/bitbucket-url.context';

@Injectable({
    providedIn:'root'
})
export class BitbucketSettingService {
    constructor(private codeClientSettingsService: CodeClientSettingService) {}
    getAuthenticationToken() {
        let bearerToken = this.codeClientSettingsService.loadSetting().bearerToken;
        return bearerToken
    }

    getApiPrefix(){
        return this.codeClientSettingsService.loadProfileSetting().apiProviderSetting.apiPrefixUrl;
    }

    getRecentRepoEndpointURL() {
        let url = '';
        this.codeClientSettingsService.loadProfileSetting().contextURLs.forEach(ps=>{
            if(ps.context === BitbucketContext.recentRepo) {
                url = ps.url;
            }
        })
        return url;
    }

    getSelectedRepoBranchesEndpointURL() {
        let url = '';
        this.codeClientSettingsService.loadProfileSetting().contextURLs.forEach(ps=>{
            if(ps.context === BitbucketContext.repoBranches) {
                url = ps.url;
            }
        })
        return url;        
    }

    getCommitHistoryEndpointURL(){
        let url = '';
        this.codeClientSettingsService.loadProfileSetting().contextURLs.forEach(ps=>{
            if(ps.context === BitbucketContext.commitHistory) {
                url = ps.url;
            }
        })
        return url;        
    }

    getCommitHistoryFileChangesEndpointURL(){
        let url = '';
        this.codeClientSettingsService.loadProfileSetting().contextURLs.forEach(ps=>{
            if(ps.context === BitbucketContext.commitHistoryFileChanges) {
                url = ps.url;
            }
        })
        return url;           
    }

    getFileHistoryEndpointURL() {
        let url = '';
        this.codeClientSettingsService.loadProfileSetting().contextURLs.forEach(ps=>{
            if(ps.context === BitbucketContext.fileHistory) {
                url = ps.url;
            }
        })
        return url;   
    }

    getRawFileEndpointURL(){
        let url = '';
        this.codeClientSettingsService.loadProfileSetting().contextURLs.forEach(ps=>{
            if(ps.context === BitbucketContext.rawFile) {
                url = ps.url;
            }
        })
        return url;  
    }

    getRepoFilesEndpointURL(){
        let url = '';
        this.codeClientSettingsService.loadProfileSetting().contextURLs.forEach(ps=>{
            if(ps.context === BitbucketContext.repoFiles) {
                url = ps.url;
            }
        })
        return url;  
    }

    

}