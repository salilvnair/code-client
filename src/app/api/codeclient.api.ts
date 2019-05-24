import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CodeClientBaseApi } from './codeclient-base.api';
import { CommitHistoryResponse } from './rest/model/commit-history.response';
import { ApiSettingService } from './setting/api-setting.service';
import { CommitHistoryFileResponse } from './rest/model/commit-history-file.response';
import { QueryParam } from './model/query-params.model';
import { RecentRepoResponse } from './rest/model/recent-repo.response';
import { RepoBranchResponse } from './rest/model/repo-branch.response';

@Injectable({
  providedIn:'root'
})
export class CodeClientApi  extends CodeClientBaseApi {
  constructor(public http: HttpClient, private apiSettingService:ApiSettingService) {
    super();
  }


  getRecentRepo(queryParam?:QueryParam[]) {
    let endpointUrl = this.prepareEndpointURLWithQueryParam(
                            this.apiSettingService.getApiPrefix(),
                            this.apiSettingService.getRecentRepoEndpointURL(),
                            queryParam);
    return this.http.get<RecentRepoResponse>(endpointUrl,{observe:'response'});
  }

  getSelectedRepoBranches(queryParam?:QueryParam[]) {
    let endpointUrl = this.prepareEndpointURLWithQueryParam(
                            this.apiSettingService.getApiPrefix(),
                            this.apiSettingService.getSelectedRepoBranchesEndpointURL(),
                            queryParam);
    return this.http.get<RepoBranchResponse>(endpointUrl,{observe:'response'});
  }

  getCommitHistory(queryParam?:QueryParam[]) {
    let endpointUrl = this.prepareEndpointURLWithQueryParam(
                            this.apiSettingService.getApiPrefix(),
                            this.apiSettingService.getCommitHistoryEndpointURL(),
                            queryParam);
    return this.http.get<CommitHistoryResponse>(endpointUrl,{observe:'response'});
  }

  getCommitHistoryFileChanges(commitId:string) {
    let endpointUrl = this.prepareEndpointURL(
                            this.apiSettingService.getApiPrefix(),
                            this.apiSettingService.getCommitHistoryFileChangesEndpointURL(),
                            this.apiSettingService.getCommitHistoryFileChangesQueryParam(),
                            commitId);
    return this.http.get<CommitHistoryFileResponse>(endpointUrl,{observe:'response'});
  }
}
