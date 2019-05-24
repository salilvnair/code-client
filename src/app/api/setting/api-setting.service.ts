import { Injectable } from '@angular/core';
import { CodeClientSettingService } from 'src/app/settings/service/codeclient-settings.service';

@Injectable({
    providedIn:'root'
})
export class ApiSettingService {
// write code to fetch the current values of predefined values
    constructor(private codeClientSettingsService: CodeClientSettingService) {}
    getAuthenticationToken() {
        let bearerToken = this.codeClientSettingsService.loadSetting().bearerToken;
        return bearerToken
    }

    getApiPrefix(){
        return "https://codecloud.web.att.com/rest/api/latest";
    }

    getRecentRepoEndpointURL() {
        return "/profile/recent/repos?permission={REPO_PERMISSION}";
    }

    getSelectedRepoBranchesEndpointURL() {
        return "/projects/{PROJECT_KEY}/repos/{REPO_SLUG}/branches?limit={OFFSET_LIMIT}"
    }

    getCommitHistoryEndpointURL(){
        return "/projects/{PROJECT_KEY}/repos/{REPO_SLUG}/commits?until=refs/heads/{BRANCH_NAME}&merges={MERGE_SETTING}&start={OFFSET_START}&limit={OFFSET_LIMIT}";
    }

    getCommitHistoryFileChangesEndpointURL(){
        return "/projects/ST_ADOPT/repos/adopt/commits/{COMMIT_ID}/changes?limit=1000";
    }

    getCommitHistoryFileChangesQueryParam(){
        return "{COMMIT_ID}";
    }


    getFileHistoryEndpointURL(){
        return "";
    }

    getRawFileEndpointURL(){
        return "";
    }

    

}