import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CodeClientBaseApi } from '../../codeclient-base.api';
import { CommitHistoryResponse } from '../../rest/model/commit-history.response';
import { BitbucketSettingService } from '../../setting/client/bitbucket/bitbucket-setting.service'
import { CommitHistoryFileResponse } from '../../rest/model/commit-history-file.response';
import { QueryParam } from '../../model/query-params.model';
import { RecentRepoResponse } from '../../rest/model/recent-repo.response';
import { RepoBranchResponse } from '../../rest/model/repo-branch.response';
import { FileHistoryResponse } from '../../rest/model/file-history.response';
import { RepoFilesResponse } from '../../rest/model/repo-files.reponse';

@Injectable({
  providedIn:'root'
})
export class BitbucketApi  extends CodeClientBaseApi {
  constructor(public http: HttpClient, private bitbucketSettingService:BitbucketSettingService) {
    super();
  }


  getRecentRepo(queryParam?:QueryParam[]) {
    let endpointUrl = this.prepareEndpointURLWithQueryParam(
                            this.bitbucketSettingService.getApiPrefix(),
                            this.bitbucketSettingService.getRecentRepoEndpointURL(),
                            queryParam);
    return this.http.get<RecentRepoResponse>(endpointUrl,{observe:'response'});
  }

  getSelectedRepoBranches(queryParam?:QueryParam[]) {
    let endpointUrl = this.prepareEndpointURLWithQueryParam(
                            this.bitbucketSettingService.getApiPrefix(),
                            this.bitbucketSettingService.getSelectedRepoBranchesEndpointURL(),
                            queryParam);
    return this.http.get<RepoBranchResponse>(endpointUrl,{observe:'response'});
  }

  getCommitHistory(queryParam?:QueryParam[]) {
    let endpointUrl = this.prepareEndpointURLWithQueryParam(
                            this.bitbucketSettingService.getApiPrefix(),
                            this.bitbucketSettingService.getCommitHistoryEndpointURL(),
                            queryParam);
    return this.http.get<CommitHistoryResponse>(endpointUrl,{observe:'response'});
  }

  getFileHistory(queryParam?:QueryParam[]) {
    let endpointUrl = this.prepareEndpointURLWithQueryParam(
      this.bitbucketSettingService.getApiPrefix(),
      this.bitbucketSettingService.getFileHistoryEndpointURL(),
      queryParam);
    return this.http.get<FileHistoryResponse>(endpointUrl,{observe:'response'});
  }

  getCommitHistoryFileChanges(queryParam?:QueryParam[]) {
    let endpointUrl = this.prepareEndpointURLWithQueryParam(
      this.bitbucketSettingService.getApiPrefix(),
      this.bitbucketSettingService.getCommitHistoryFileChangesEndpointURL(),
      queryParam);
    return this.http.get<CommitHistoryFileResponse>(endpointUrl,{observe:'response'});
  }

  getRawFileFromCommitId(queryParam?:QueryParam[]) {
    let endpointUrl = this.prepareEndpointURLWithQueryParam(
      this.bitbucketSettingService.getApiPrefix(),
      this.bitbucketSettingService.getRawFileEndpointURL(),
      queryParam);
    return this.http.get(endpointUrl,{responseType:'text'});
  }

  getRepoFiles(queryParam?:QueryParam[]) {
    let endpointUrl = this.prepareEndpointURLWithQueryParam(
      this.bitbucketSettingService.getApiPrefix(),
      this.bitbucketSettingService.getRepoFilesEndpointURL(),
      queryParam);
    return this.http.get<RepoFilesResponse>(endpointUrl,{observe:'response'});
  }
}
