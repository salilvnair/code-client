import { Injectable } from '@angular/core';
import { CommitHistoryData } from '../model/commit-history.model';
import { BitbucketApi } from '../../../api/client/bitbucket/bitbucket.api';
import { QueryParam } from 'src/app/api/model/query-params.model';
import { BitbucketSettingConstant } from 'src/app/api/setting/client/bitbucket/bitbucket-setting.constant';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { CommitHistoryFilter } from '../commit-history/commit-history-filter-dialog/commit-history-filter.component';
import { CommitHistoryFilteredModel } from '../commit-history/commit-history-filter-dialog/commit-history-filter.model';
import { Observable, Subject, interval, BehaviorSubject } from 'rxjs';
import { DashBoardModel } from '../model/dashboard.model';
import { CodeClientSettingsWizardComponent } from 'src/app/settings/wizard/codeclient-settings-wizard.component';
import { CodeClientSetting } from 'src/app/settings/model/codeclient-setting.model';
import { CommitHistoryFileData, CommitHistoryFile } from '../model/commit-history-file-data.model';
import { CommitHistoryFileChangesDialog } from '../commit-history/commit-history-file-changes-dialog/commit-history-file-changes.component';
import { ProfileSetting } from 'src/app/settings/model/profile-setting.model';
import { CodeClientProfileSettingComponent } from 'src/app/settings/profile/codeclient-profile-setting.component';
import { FileHistoryBean, FileHistoryCompareBean } from '../model/file-history.model';

@Injectable({
    providedIn: 'root'
})
export class BitbucketService {

    private selectedDashBoardData: DashBoardModel;

    private dashBoardDataNotifier = new Subject<DashBoardModel>();

    private selectedFileHistoryData: FileHistoryBean;

    private fileHistoryCompareData: FileHistoryCompareBean[];

    fromRepoFiles = false;

    constructor(private bitbucketApi:BitbucketApi,
        public dialog: MatDialog){}

    getFileHistoryCompareData() {
        return this.fileHistoryCompareData;
    } 

    getSelectedDashBoardData() {
        return this.selectedDashBoardData;
    }

    publishDashboardData() {
        return this.dashBoardDataNotifier.asObservable();
    }

    setSelectedDashBoardData(selectedDashBoardData: DashBoardModel) {
        this.dashBoardDataNotifier.next(selectedDashBoardData);
        this.selectedDashBoardData = selectedDashBoardData;
    }

    getSelectedFileHistoryData() {
        return this.selectedFileHistoryData;
    }   

    setSelectedFileHistoryData(selectedFileHistoryData: FileHistoryBean) {
        this.selectedFileHistoryData = selectedFileHistoryData;
    }

    getRecentRepo() {
        let queryParams:QueryParam[]=[];
        let queryParam = new QueryParam();
        queryParam.param = BitbucketSettingConstant.QUERY_PARAM_REPO_PERMISSION;
        queryParam.value = BitbucketSettingConstant.QUERY_PARAM_REPO_PERMISSION_WRITE;
        queryParams.push(queryParam);        
        return this.bitbucketApi.getRecentRepo(queryParams);
    } 
    
    getSelectedRepoBranchNames(limit: string ) {
        let queryParams:QueryParam[] = this.buildProjectKeyRepoSlugParams();
        let queryParam = new QueryParam();
        queryParam = new QueryParam();
        queryParam.param = BitbucketSettingConstant.QUERY_PARAM_OFFSET_LIMIT;
        queryParam.value = limit;
        queryParams.push(queryParam);
        return this.bitbucketApi.getSelectedRepoBranches(queryParams);
    }

    getCommitHistory(branchName:string,start:string,limit:string,mergeSetting:string) {
        let queryParams:QueryParam[]  = this.buildProjectKeyRepoSlugParams();
        let queryParam = new QueryParam();
        queryParam.param = BitbucketSettingConstant.QUERY_PARAM_BRANCH_NAME;
        queryParam.value = branchName;
        queryParams.push(queryParam);
        queryParam = new QueryParam();
        queryParam.param = BitbucketSettingConstant.QUERY_PARAM_OFFSET_START;
        queryParam.value = start;
        queryParams.push(queryParam);
        queryParam = new QueryParam();
        queryParam.param = BitbucketSettingConstant.QUERY_PARAM_MERGE_SETTING;
        queryParam.value = mergeSetting;
        queryParams.push(queryParam);
        queryParam = new QueryParam();
        queryParam.param = BitbucketSettingConstant.QUERY_PARAM_OFFSET_LIMIT;
        queryParam.value = limit;
        queryParams.push(queryParam);
        return this.bitbucketApi.getCommitHistory(queryParams);
    }

    getFileHistory(start:string,limit:string) {
        let queryParams:QueryParam[]  = this.buildProjectKeyRepoSlugParams();
        let queryParam = new QueryParam();
        queryParam.param = BitbucketSettingConstant.QUERY_PARAM_FULL_SRC_PATH;
        queryParam.value = this.selectedFileHistoryData.filePath;
        queryParams.push(queryParam);
        queryParam = new QueryParam();
        queryParam.param = BitbucketSettingConstant.QUERY_PARAM_COMMIT_ID;
        queryParam.value = this.selectedFileHistoryData.commitId;
        queryParams.push(queryParam);
        queryParam = new QueryParam();
        queryParam.param = BitbucketSettingConstant.QUERY_PARAM_OFFSET_START;
        queryParam.value = start;
        queryParams.push(queryParam);
        queryParam = new QueryParam();
        queryParam.param = BitbucketSettingConstant.QUERY_PARAM_OFFSET_LIMIT;
        queryParam.value = limit;
        queryParams.push(queryParam);
        return this.bitbucketApi.getFileHistory(queryParams);
    }

    getCommitHistoryFileChanges(commitId:string, limit:string) {
        let queryParams:QueryParam[]  = this.buildProjectKeyRepoSlugParams();
        let queryParam = new QueryParam();
        queryParam.param = BitbucketSettingConstant.QUERY_PARAM_COMMIT_ID;
        queryParam.value = commitId;
        queryParams.push(queryParam);
        queryParam = new QueryParam();
        queryParam.param = BitbucketSettingConstant.QUERY_PARAM_OFFSET_LIMIT;
        queryParam.value = limit;
        queryParams.push(queryParam);
        return this.bitbucketApi.getCommitHistoryFileChanges(queryParams);
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
        queryParam.param = BitbucketSettingConstant.QUERY_PARAM_PROJECT_KEY;
        queryParam.value = this.selectedDashBoardData.project_key;
        queryParams.push(queryParam);
        queryParam = new QueryParam();
        queryParam.param = BitbucketSettingConstant.QUERY_PARAM_REPO_SLUG;
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

    openProfileSettingDialog(): Observable<ProfileSetting> {
        const dialogRef = this.dialog.open(CodeClientProfileSettingComponent, {
            width: '600px',
            height: '680px',
            panelClass:['profile__dialog'],
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


    prepareFileChangesCommitIds(commitIds:string[], dataSource: MatTableDataSource<CommitHistoryData>) {
        let notifier:Subject<boolean> = new Subject<boolean>();
        dataSource.filteredData.reduce((p, i,index,filteredData) => p.then(() => this.filterCommitIdsForFileChanges(notifier,i,commitIds,index,filteredData)).then(() => this.wait(5)),
                 Promise.resolve());
       return notifier.asObservable();    
    }

    filterCommitIdsForFileChanges(notifier:Subject<boolean>, commitHistoryData: CommitHistoryData, commitIds:string[],index:number, filteredData:CommitHistoryData[]) {
        if(commitHistoryData.checked){
            commitIds.push(commitHistoryData.commitId);
        }
        if(filteredData.length-1===index) {
            notifier.next(true);
        }
    }

    wait(ms:number) : any {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    loadCommitIdFileChanges(commitIds:string[]) {
        let commitHistoryFileDataSubject = new Subject<CommitHistoryFileData[]>();
        let commitHistoryFileChanges:CommitHistoryFileData[] = []
        commitIds.forEach((commitId,index)=>{
            this.getCommitHistoryFileChanges(commitId,'1000').subscribe(response=>{
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

    getRawFileFromCommitIds(commitIds: string[], filePath: string) {
        let fileCompareDataNotifier = new BehaviorSubject<boolean>(false);
        this.fileHistoryCompareData = [];
        commitIds.forEach(commitId => {
            let queryParams:QueryParam[]  = this.buildProjectKeyRepoSlugParams();
            let queryParam = new QueryParam();
            queryParam.param = BitbucketSettingConstant.QUERY_PARAM_COMMIT_ID;
            queryParam.value = commitId;
            queryParams.push(queryParam);
            queryParam = new QueryParam();
            queryParam.param = BitbucketSettingConstant.QUERY_PARAM_FULL_SRC_PATH;
            queryParam.value = filePath;
            queryParams.push(queryParam);
            this.bitbucketApi.getRawFileFromCommitId(queryParams).subscribe(response=>{
                let fileString = response;
                let fileHistoryCompareBean = new FileHistoryCompareBean();
                fileHistoryCompareBean.commitId = commitId;
                fileHistoryCompareBean.fileString = fileString;
                fileHistoryCompareBean.filePath = filePath;
                this.fileHistoryCompareData.push(fileHistoryCompareBean);
                if(this.fileHistoryCompareData.length === commitIds.length) {
                    fileCompareDataNotifier.next(true);
                }
            })
        })
        return fileCompareDataNotifier;
    }

    getRawFileCommiDetailsFromCommitIds(commitIds: string[], filePath: string) {
        let fileDetailDataNotifier = new Subject<FileHistoryCompareBean[]>();
        let fileHistoryDetailData = [];
        commitIds.forEach(commitId => {
            let queryParams:QueryParam[]  = this.buildProjectKeyRepoSlugParams();
            let queryParam = new QueryParam();
            queryParam.param = BitbucketSettingConstant.QUERY_PARAM_COMMIT_ID;
            queryParam.value = commitId;
            queryParams.push(queryParam);
            queryParam = new QueryParam();
            queryParam.param = BitbucketSettingConstant.QUERY_PARAM_FULL_SRC_PATH;
            queryParam.value = filePath;
            queryParams.push(queryParam);
            this.bitbucketApi.getRawFileFromCommitId(queryParams).subscribe(response=>{
                let fileString = response;
                let fileHistoryCompareBean = new FileHistoryCompareBean();
                fileHistoryCompareBean.commitId = commitId;
                fileHistoryCompareBean.fileString = fileString;
                fileHistoryCompareBean.filePath = filePath;
                fileHistoryDetailData.push(fileHistoryCompareBean);
                if(fileHistoryDetailData.length === commitIds.length) {
                    let fileDetailData = fileHistoryDetailData;
                    fileDetailDataNotifier.next(fileDetailData);
                }
            })
        })
        return fileDetailDataNotifier;
    }

    getRepoFiles(branchName: string, limit: string) {
        let queryParams:QueryParam[]  = this.buildProjectKeyRepoSlugParams();
        let queryParam = new QueryParam();
        queryParam.param = BitbucketSettingConstant.QUERY_PARAM_BRANCH_NAME;
        queryParam.value = branchName;
        queryParams.push(queryParam);

        queryParam = new QueryParam();
        queryParam.param = BitbucketSettingConstant.QUERY_PARAM_OFFSET_LIMIT;
        queryParam.value = limit;
        queryParams.push(queryParam);
        return this.bitbucketApi.getRepoFiles(queryParams);
    }

    getRepoFileHistory(start:string, limit:string) {
        let queryParams:QueryParam[]  = this.buildProjectKeyRepoSlugParams();
        let queryParam = new QueryParam();
        queryParam.param = BitbucketSettingConstant.QUERY_PARAM_FULL_SRC_PATH;
        queryParam.value = this.selectedFileHistoryData.filePath;
        queryParams.push(queryParam);
        queryParam = new QueryParam();
        queryParam.param = BitbucketSettingConstant.QUERY_PARAM_COMMIT_ID;
        queryParam.value = "refs/heads/"+ this.selectedFileHistoryData.branchName;
        queryParams.push(queryParam);
        queryParam = new QueryParam();
        queryParam.param = BitbucketSettingConstant.QUERY_PARAM_OFFSET_START;
        queryParam.value = start;
        queryParams.push(queryParam);
        queryParam = new QueryParam();
        queryParam.param = BitbucketSettingConstant.QUERY_PARAM_OFFSET_LIMIT;
        queryParam.value = limit;
        queryParams.push(queryParam);
        return this.bitbucketApi.getFileHistory(queryParams);
    }
}