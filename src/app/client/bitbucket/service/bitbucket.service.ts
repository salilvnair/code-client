import { Injectable } from '@angular/core';
import { CommitHistoryData } from '../model/commit-history.model';
import { CodeClientApi } from 'src/app/api/codeclient.api';
import { QueryParam } from 'src/app/api/model/query-params.model';
import { ApiSettingConstant } from 'src/app/api/setting/api-setting.constant';
import { MatDialog } from '@angular/material';
import { CommitHistoryFilter } from '../commit-history/commit-history-filter-dialog/commit-history-filter.component';
import { CommitHistoryFilteredModel } from '../commit-history/commit-history-filter-dialog/commit-history-filter.model';
import { Observable, Subject } from 'rxjs';
import { DashBoardModel } from '../model/dashboard.model';
import { CodeClientSettingsWizardComponent } from 'src/app/settings/wizard/codeclient-settings-wizard.component';
import { CodeClientSetting } from 'src/app/settings/model/codeclient-setting.model';
import { CommitHistoryFileData, CommitHistoryFile } from '../model/commit-history-file-data.model';
import { CommitHistoryFileChangesDialog } from '../commit-history/commit-history-file-changes-dialog/commit-history-file-changes.component';

@Injectable({
    providedIn: 'root'
})
export class BitbucketService {

    private selectedDashBoardData: DashBoardModel;

    constructor(private codeClientApi:CodeClientApi,
        public dialog: MatDialog){}

    getSelectedDashBoardData() {
        return this.selectedDashBoardData;
    }   

    setSelectedDashBoardData(selectedDashBoardData: DashBoardModel) {
        this.selectedDashBoardData = selectedDashBoardData;
    }

    getRecentRepo() {
        let queryParams:QueryParam[]=[];
        let queryParam = new QueryParam();
        queryParam.param = ApiSettingConstant.QUERY_PARAM_REPO_PERMISSION;
        queryParam.value = ApiSettingConstant.QUERY_PARAM_REPO_PERMISSION_WRITE;
        queryParams.push(queryParam);        
        return this.codeClientApi.getRecentRepo(queryParams);
    } 
    
    getSelectedRepoBranchNames(limit: string ) {
        let queryParams:QueryParam[] = this.buildProjectKeyRepoSlugParams();
        let queryParam = new QueryParam();
        queryParam = new QueryParam();
        queryParam.param = ApiSettingConstant.QUERY_PARAM_OFFSET_LIMIT;
        queryParam.value = limit;
        queryParams.push(queryParam);
        return this.codeClientApi.getSelectedRepoBranches(queryParams);
    }

    getCommitHistory(branchName:string,start:string,limit:string,mergeSetting:string) {
        let queryParams:QueryParam[]  = this.buildProjectKeyRepoSlugParams();
        let queryParam = new QueryParam();
        queryParam.param = ApiSettingConstant.QUERY_PARAM_BRANCH_NAME;
        queryParam.value = branchName;
        queryParams.push(queryParam);
        queryParam = new QueryParam();
        queryParam.param = ApiSettingConstant.QUERY_PARAM_OFFSET_START;
        queryParam.value = start;
        queryParams.push(queryParam);
        queryParam = new QueryParam();
        queryParam.param = ApiSettingConstant.QUERY_PARAM_MERGE_SETTING;
        queryParam.value = mergeSetting;
        queryParams.push(queryParam);
        queryParam = new QueryParam();
        queryParam.param = ApiSettingConstant.QUERY_PARAM_OFFSET_LIMIT;
        queryParam.value = limit;
        queryParams.push(queryParam);
        return this.codeClientApi.getCommitHistory(queryParams);
    }

    getCommitHistoryFileChanges(commitId:string) {
        return this.codeClientApi.getCommitHistoryFileChanges(commitId);
    }

    openFilterDialog(displayedColumns:string[],tableData:CommitHistoryData[],commitHistoryFilteredModel:CommitHistoryFilteredModel): Observable<CommitHistoryFilteredModel> {
        const dialogRef = this.dialog.open(CommitHistoryFilter, {
            width: '300px',
            disableClose : true ,
            data: { 
                 displayedColumns: displayedColumns,
                 tableData: tableData,
                 commitHistoryFilteredModel:commitHistoryFilteredModel
            }
        });
        return dialogRef.afterClosed();
    }

    private buildProjectKeyRepoSlugParams() {
        let queryParams:QueryParam[]=[];
        let queryParam = new QueryParam();
        queryParam.param = ApiSettingConstant.QUERY_PARAM_PROJECT_KEY;
        queryParam.value = this.selectedDashBoardData.project_key;
        queryParams.push(queryParam);
        queryParam = new QueryParam();
        queryParam.param = ApiSettingConstant.QUERY_PARAM_REPO_SLUG;
        queryParam.value = this.selectedDashBoardData.repo_slug;
        queryParams.push(queryParam);
        return queryParams;
    }

    openSettingsDialog(): Observable<CodeClientSetting> {
        const dialogRef = this.dialog.open(CodeClientSettingsWizardComponent, {
            width: '600px',
            disableClose : true          
        });
        return dialogRef.afterClosed();
    }

    openShowFileChangesDialog(commitIds:string[], selectedBranch:string) {
        this.loadCommitIdFileChanges(commitIds).subscribe(commitHistoryFileChanges=>{
            this.dialog.open(CommitHistoryFileChangesDialog, {
                width: '1200px',
                disableClose : true ,
                data: {
                    commitHistoryFileChanges: commitHistoryFileChanges,
                    selectedBranch:selectedBranch,
                    selectedRepo: this.selectedDashBoardData.repo_slug
                }
            });
        });
    }

    loadCommitIdFileChanges(commitIds:string[]) {
        let commitHistoryFileDataSubject = new Subject<CommitHistoryFileData[]>();
        let commitHistoryFileChanges:CommitHistoryFileData[] = []
        commitIds.forEach((commitId,index)=>{
            this.getCommitHistoryFileChanges(commitId).subscribe(response=>{
                let commitHistoryFileChangesResp = response.body;
                let commitHistoryFileData = new CommitHistoryFileData();
                commitHistoryFileData.commitId = commitId;
                commitHistoryFileData.commitedFiles = commitHistoryFileChangesResp.values.map((value)=>{
                    let commitHistoryFile = new CommitHistoryFile();
                    commitHistoryFile.fileName = value.path.toString;
                    commitHistoryFile.fileStatus = value.type;
                    if(value.type==='MODIFY'){
                        commitHistoryFile.color = "rgb(27, 128, 178)";
                        commitHistoryFile.shortStatus = "M";
                    }
                    else if(value.type==='MOVE'){
                        commitHistoryFile.color = "rgb(112, 128, 178)";
                        commitHistoryFile.shortStatus = "M";
                    }
                    else if(value.type==='ADD'){
                        commitHistoryFile.color = "rgb(60, 135, 70)";
                        commitHistoryFile.shortStatus = "A";
                    }
                    else if(value.type==='DELETE'){
                        commitHistoryFile.color = "rgb(158, 18, 29)";
                        commitHistoryFile.shortStatus = "A";
                    }
                    return commitHistoryFile;
                });
                commitHistoryFileChanges.push(commitHistoryFileData);
                if(index===commitIds.length-1) {
                    commitHistoryFileDataSubject.next(commitHistoryFileChanges);
                }
            })
        })
        return commitHistoryFileDataSubject.asObservable();
    }

}