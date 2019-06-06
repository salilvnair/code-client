import { OnInit, Component, AfterViewInit, ViewChild, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { BitbucketService } from '../service/bitbucket.service';
import { CommitHistoryData } from '../model/commit-history.model';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent, MatSelect, MatCheckbox, MatCheckboxChange, MatMenuTrigger } from '@angular/material';
import * as dateFormat from 'dateformat';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommitHistoryFileData, CommitHistoryFile } from '../model/commit-history-file-data.model';
import { CommitHistoryResponse } from 'src/app/api/rest/model/commit-history.response';
import { MatHeaderProgressData } from 'src/app/util/mat-header-progress/mat-header-progress.data';
import { CommitHistoryFilteredModel } from './commit-history-filter-dialog/commit-history-filter.model';
import { DateUtil } from 'src/app/util/date.util';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ExcelUtil } from 'src/app/util/excel.util';
import { FileHistoryBean } from '../model/file-history.model';
import { NgxDiffFile } from '@salilvnair/ngx-diff';
import { HeaderService } from 'src/app/header/header.service';
import { CommonUtility } from 'src/app/util/common/common.util';

@Component({
    selector:'commit-history',
    templateUrl:'./commit-history.component.html',
    styleUrls:['./commit-history.component.css'],
    animations: [
        trigger("detailExpand", [
          state(
            "collapsed",
            style({ height: "0px", minHeight: "0", display: "none" })
          ),
          state("expanded", style({ height: "*" })),
          transition(
            "expanded <=> collapsed",
            animate("425ms cubic-bezier(0.4, 0.0, 0.2, 1)")
          )
        ])
      ]
})
export class CommitHistoryComponent implements OnInit, AfterViewInit, OnDestroy  {

    constructor(private bitbucketService:BitbucketService,
                private dateUtil:DateUtil,
                private router: Router,
                private excelUtil:ExcelUtil,
                private headerService: HeaderService,
                private matHeaderProgressData:MatHeaderProgressData){}
    //dataSource: CommitHistoryData[] = [];
    dataSource = new MatTableDataSource<CommitHistoryData>();
    expandedElement: CommitHistoryFileData | null;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChildren(MatCheckbox) checkboxes:MatCheckbox[];
    @ViewChild(MatMenuTrigger) public menuTrigger : MatMenuTrigger;
    displayedColumns: string[] = ['select','author', 'commitId', 'commitMessage', 'date'];
    filterColumns: string[] = ['author', 'commitId', 'commitMessage', 'date'];
    showSearchBox = false;
    showToolBarBtns = true;
    lovSelected = "all";
    strictMatch = false;    
    filterString:string = '';
    foundMatchCaseArray:string[]=[];
    notFoundMatchCaseArray:string[]=[];
    matchCaseArray:string[]=[];
    commitHistoryResponse:CommitHistoryResponse;
    commitHistoryFilteredModel: CommitHistoryFilteredModel;
    selectedBranchName:string  = 'master';
    selectedMergeSetting = 'exclude';
    repoBranches: string[];
    disableShowFileChanges = true;
    isCommitHistoryExpanded = false;
    /** control for the selected branchNames */
    public branchNameCtrl: FormControl = new FormControl();

    /** control for the MatSelect filter keyword */
    public branchNameFilterCtrl: FormControl = new FormControl();


      /** list of branchNames filtered by search keyword */
    public filteredBranchNames: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);

    /** Subject that emits when the component has been destroyed. */
    protected _onDestroy = new Subject<void>();

    private commitIdsFileChangesSubscription = new Subscription();

    @ViewChild('branchSelect') branchSelect: MatSelect;

    context = 5;
    outputFormat = 'side-by-side';
    diffFiles = [];
    showFileDiff = false;

    ngOnInit(){
        this.init();
    }

    init() {
        this.redirectToDashBoardCheck();
        this.changeHeader(false);
        this.loadSelectedRepoBranchNames();        
    }

    loadDataOnJumpBackFromFileHistory() {
        if(this.bitbucketService.getSelectedFileHistoryData()){
            this.selectedBranchName = this.bitbucketService.getSelectedFileHistoryData().branchName;            
            this.branchNameCtrl.setValue(this.selectedBranchName); 
        }         
    }

    redirectToDashBoardCheck() {
        if(!this.bitbucketService.getSelectedDashBoardData()) {
            this.router.navigate(["dashboard"]);
        }
    }

    changeHeader(defaultTitle:boolean) {
        this.headerService.changeHeader(defaultTitle);
    }

    initCommitHistoryTableDataSource() {
        this.loadCommitHistory(this.selectedBranchName,'0','25');
        this.applyFilterPredicate();
    }

    loadSelectedRepoBranchNames() {
        if(this.bitbucketService.getSelectedDashBoardData()) {
            this.bitbucketService.getSelectedRepoBranchNames('10000').subscribe(response=>{
                let branchNamesResp = response.body;
                this.repoBranches = branchNamesResp.values.map(branchNameData=>{
                    if(branchNameData.isDefault){
                        this.selectedBranchName = branchNameData.displayId;
                    }
                    return branchNameData.displayId;
                })
                // set initial selection
                this.branchNameCtrl.setValue('master');

                // load the initial branchname list
                this.filteredBranchNames.next(this.repoBranches.slice());

                // listen for search field value changes
                this.branchNameFilterCtrl.valueChanges
                .pipe(takeUntil(this._onDestroy))
                .subscribe(() => {
                    this.filterBranchNames();
                });
                this.loadDataOnJumpBackFromFileHistory();
                this.initCommitHistoryTableDataSource();                
            })
        }
    }

    ngAfterViewInit() {
        this.setInitialValue();
    }
    
    ngOnDestroy() {
        this.changeHeader(true);
        this._onDestroy.next();
        this._onDestroy.complete();
        this.commitIdsFileChangesSubscription.unsubscribe();
    }

    /**
   * Sets the initial value after the filteredBranchs are loaded initially
   */
    protected setInitialValue() {
        this.filteredBranchNames
        .pipe(take(1), takeUntil(this._onDestroy))
        .subscribe(() => {
            // setting the compareWith property to a comparison function
            // triggers initializing the selection according to the initial value of
            // the form control (i.e. _initializeSelection())
            // this needs to be done after the filteredBranchs are loaded initially
            // and after the mat-option elements are available
            this.branchSelect.compareWith = (a: string, b: string) => a && b && a === b;
        });
    }

    protected filterBranchNames() {
        if (!this.repoBranches) {
            return;
        }
        // get the search keyword
        let search = this.branchNameFilterCtrl.value;
        if (!search) {
            this.filteredBranchNames.next(this.repoBranches.slice());
            return;
        } 
        else {
            search = search.toLowerCase();
        }
        // filter the branch names
        this.filteredBranchNames.next(
        this.repoBranches.filter(branch => branch.toLowerCase().indexOf(search) > -1)
        );
    }

    onChangeRepoBranch() {
        this.dataSource = new MatTableDataSource<CommitHistoryData>();
        this.loadCommitHistory(this.selectedBranchName,'0','25');
        this.applyFilterPredicate();
    }

    onChangeMergeSetting() {
        this.dataSource = new MatTableDataSource<CommitHistoryData>();
        this.loadCommitHistory(this.selectedBranchName,'0','25');
        this.applyFilterPredicate();
    }

    getCommitHistoryFileChanges(commitId:string) {       
        this.bitbucketService.getCommitHistoryFileChanges(commitId,'1000').subscribe(response=>{
            let commitHistoryFileChanges = response.body;
            let expandedElement = new CommitHistoryFileData();
            expandedElement.commitId = commitId;
            expandedElement.commitedFiles = commitHistoryFileChanges.values.map((value)=>{
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
            ////console.log(expandedElement);
            this.expandedElement = expandedElement;
        })
        return true;
    }

    loadCommitHistory(branchName:string,start:string,limit:string) {
        this.matHeaderProgressData.setHidden(false);
        this.bitbucketService.getCommitHistory(branchName,start,limit,this.selectedMergeSetting).subscribe(response=>{
            this.matHeaderProgressData.setHidden(true);
            let responseBody = response.body;
            this.commitHistoryResponse = responseBody;
            let commitHistoryDataSource= responseBody.values.map(({id,displayId,message,author,authorTimestamp,parents})=>{
                let date = new Date(authorTimestamp); 
                let commitHistoryData = new CommitHistoryData();
                commitHistoryData.select = displayId;
                commitHistoryData.author = author.displayName?author.displayName:author.name;
                commitHistoryData.commitId = displayId;
                commitHistoryData.commitMessage = message;
                if(parents.length>1) {
                    //its a merge commit and 1st index is the real commit
                    //handle a true false boolean based on which disable the context menu
                }
                else if(parents.length==1) {
                    //show context menu with commit details
                    commitHistoryData.parentCommitId  = parents[0].displayId;
                }
                commitHistoryData.date = dateFormat(date,'dd/mm/yyyy hh:mm:ss');
                return commitHistoryData;
            })
            if(this.dataSource.data.length==0){
                //console.log(this.dataSource.data);
                this.dataSource.data = commitHistoryDataSource;
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            }
            else {
                commitHistoryDataSource.forEach(commitHistoryData=>{
                    this.dataSource.data.push(commitHistoryData);
                    this.dataSource.data = this.dataSource.data.slice(); 
                })
            }
        })
    }

    getNext(event: PageEvent) {      
        if(this.filterString==='' &&
            !this.commitHistoryResponse.isLastPage &&
            event.pageIndex > event.previousPageIndex &&
            event.pageIndex == Math.floor(event.length/event.pageSize)-1){
            ////console.log(this.commitHistoryResponse.nextPageStart);
            this.loadCommitHistory(this.selectedBranchName,this.commitHistoryResponse.nextPageStart+'','25');
        }
    }

    fetchAllCommitHistory() {
        this.loadCommitHistory(this.selectedBranchName,this.commitHistoryResponse.nextPageStart+'','10000');
    }

    applyFilterPredicate() {
        this.dataSource.filterPredicate  = (data: CommitHistoryData, filter: string) => {
           let filterMatched = false;
           //console.log(data);
           if(this.commitHistoryFilteredModel){
            filterMatched = this.applyPopupFilter(data);
           }
           else{
            filterMatched = this.applySimpleFilter(data,filter);
           }
            return filterMatched;
           };
    }

    applyFilter(filterValue: string) {        
        this.foundMatchCaseArray = [];
        this.notFoundMatchCaseArray = [];
        this.matchCaseArray = [];
        this.commitHistoryFilteredModel = null;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
        if(this.strictMatch && this.lovSelected!='all' && this.matchCaseArray.length > 0) {
            this.dataSource.filteredData.map((filteredData=>{
                if(this.matchCaseArray.indexOf(filteredData[this.lovSelected])>-1){
                    this.foundMatchCaseArray.push(filteredData[this.lovSelected]);
                    this.matchCaseArray.splice(this.matchCaseArray.indexOf(filteredData[this.lovSelected]),1);
                }
            }))
            this.notFoundMatchCaseArray = this.matchCaseArray.filter(el=>{
                return this.foundMatchCaseArray.indexOf(el) === -1;
            })
        }

    }

    enableSearchBox() {
        this.showSearchBox = true;
        this.showToolBarBtns = false;
    }

    closeSearchBox() {
        this.showSearchBox = false;
        this.showToolBarBtns = true;
        this.filterString = '';
        this.applyFilter(this.filterString);
    }

    toggleMatchCase() {
        this.strictMatch = !this.strictMatch;
        this.applyFilter(this.filterString);
    }

    exportToExcel() {
        this.excelUtil.exportToExcel(this.dataSource.filteredData,this.bitbucketService.getSelectedDashBoardData().repo_slug,this.selectedBranchName);
    }

    openFilterDialog() {
        this.bitbucketService
            .openFilterDialog(this.displayedColumns,this.dataSource.data,this.commitHistoryFilteredModel)
            .subscribe(commitHistoryFilteredModel=>{
                this.commitHistoryFilteredModel = commitHistoryFilteredModel;
                if(this.commitHistoryFilteredModel && 
                    Object.keys(this.commitHistoryFilteredModel).length > 0) {
                    this.dataSource.filter = " ";
                    if (this.dataSource.paginator) {
                        this.dataSource.paginator.firstPage();
                    }
                }
                else{
                    this.filterString = '';
                    this.applyFilter(this.filterString);
                }
            })
    }

    applySimpleFilter(data: CommitHistoryData, filter: string) {
        if(filter.indexOf(",")!==-1 && this.lovSelected!='all'){
            const searchArray = filter.split(",").map(item => item.trim()).filter(v => v);
            //console.log(searchArray)
            this.matchCaseArray = searchArray;
            if(this.strictMatch){
                let el = searchArray.find(a=>{
                    let s =  a.includes(data[this.lovSelected]);
                    return s;
                }); 
                let foundElem = el!=undefined ? true:false;
                //searchArray.includes(data[this.lovSelected]);
                return foundElem;
            }
            else{
                const el =  searchArray.find(a=>{
                    return data[this.lovSelected].includes(a)
                });
                if(el){
                    return true;
                }
                else{
                    return false;
                }
            }
        }
        else{
            var cols = Object.keys(data);         
            for(let i=0;i<cols.length;i++){
                const textToSearch = data[cols[i]] && data[cols[i]].toLowerCase() || '';                
                let filterMatched = textToSearch.indexOf(filter) !== -1;
                if(filterMatched){
                    return filterMatched;
                }                
            }
        }
    }

    applyPopupFilter(data: CommitHistoryData) {
        //console.log(data)
        if(Object.keys(this.commitHistoryFilteredModel).length > 0){
            if (
                this.commitHistoryFilteredModel.fromDate &&
                this.commitHistoryFilteredModel.toDate &&
                this.commitHistoryFilteredModel.authors &&
                this.commitHistoryFilteredModel.authors.length ==0
              ) 
            {
                var fromDateSelected = this.dateUtil.parse(this.commitHistoryFilteredModel.fromDate);
                var toDateSelected = this.dateUtil.parse(this.commitHistoryFilteredModel.toDate);
                var objectDate = this.dateUtil.parse(data.date);
                return (
                  fromDateSelected.getTime() <= objectDate.getTime() &&
                  toDateSelected.getTime() >= objectDate.getTime()
                );
            } else if (
            this.commitHistoryFilteredModel.fromDate &&
            this.commitHistoryFilteredModel.toDate &&
            this.commitHistoryFilteredModel.authors &&
            this.commitHistoryFilteredModel.authors.length > 0
            ) {
                var fromDateSelected = this.dateUtil.parse(this.commitHistoryFilteredModel.fromDate);
                var toDateSelected = this.dateUtil.parse(this.commitHistoryFilteredModel.toDate);
                var objectDate = this.dateUtil.parse(data.date);
                let selectedAuthor = this.commitHistoryFilteredModel.authors.filter(
                    author => author === data.author
                );
                return (
                    selectedAuthor.length > 0 &&
                    fromDateSelected.getTime() <= objectDate.getTime() &&
                    toDateSelected.getTime() >= objectDate.getTime()
                );
            } 
            else if (this.commitHistoryFilteredModel.fromDate
                        && this.commitHistoryFilteredModel.authors.length > 0) {
                var fromDateSelected = this.dateUtil.parse(this.commitHistoryFilteredModel.fromDate);
                var objectDate = this.dateUtil.parse(data.date);
                let selectedAuthor = this.commitHistoryFilteredModel.authors.filter(
                    author => author === data.author
                );
                return (
                    selectedAuthor.length > 0 &&
                    fromDateSelected.getTime() <= objectDate.getTime()
                );
            } 
            else if (this.commitHistoryFilteredModel.fromDate 
                        && this.commitHistoryFilteredModel.authors.length == 0) {
                var fromDateSelected = this.dateUtil.parse(this.commitHistoryFilteredModel.fromDate);
                var objectDate = this.dateUtil.parse(data.date);
                return fromDateSelected.getTime() <= objectDate.getTime();
            } 
            else if (this.commitHistoryFilteredModel.authors.length > 0) {
                let selectedAuthor = this.commitHistoryFilteredModel.authors.filter(
                    author => author === data.author
                );
                return selectedAuthor.length > 0 ? true : false;
            } 
        } 
    }

    onSelectAllCommits(event:MatCheckboxChange) {
        this.disableShowFileChanges = true;
        this.dataSource.filteredData.forEach(commitLog=>{
            commitLog.checked = event.checked;
        });
        if(event.checked){
            this.onSelectCommit(event);
        }
    }

    onSelectCommit(event:MatCheckboxChange){
        this.disableShowFileChanges = true;
        this.checkboxes.forEach(checkbox=>{
            if(checkbox.checked) {
                this.disableShowFileChanges = false;
            }
        })
    }

    openShowFileChangesDialog() {
        let commitIds = [];
        this.matHeaderProgressData.setHidden(false);
        this.commitIdsFileChangesSubscription = this.bitbucketService.prepareFileChangesCommitIds(commitIds, this.dataSource).subscribe(notify=>{
            if(notify){
                this.bitbucketService.openShowFileChangesDialog(commitIds,this.selectedBranchName);
            }
        });        
    }

    showFileHistory(commitId:string,filePath:string) {
        let selectedFileHistory:FileHistoryBean = new FileHistoryBean();
        selectedFileHistory.branchName = this.selectedBranchName;
        selectedFileHistory.commitId = commitId;
        selectedFileHistory.filePath = filePath;
        this.bitbucketService.setSelectedFileHistoryData(selectedFileHistory);
        this.bitbucketService.fromRepoFiles = false;
        this.router.navigate(["file-history"]);
    }

    showCommitDetails(commitHistoryData: CommitHistoryData) {
        this.prepareCommitDetails(commitHistoryData);
    }

    prepareCommitDetails(commitHistoryData: CommitHistoryData) {
        this.matHeaderProgressData.setHidden(false);
        this.bitbucketService.getCommitHistoryFileChanges(commitHistoryData.commitId,'1000').subscribe(response=>{
            let commitHistoryFileChanges = response.body;
            let commitDetailData = new CommitHistoryFileData();
            commitDetailData.commitId = commitHistoryData.commitId;
            commitDetailData.parentCommitId = commitHistoryData.parentCommitId;
            commitDetailData.commitedFiles = commitHistoryFileChanges.values.map((value)=>{
                let commitHistoryFile = new CommitHistoryFile();
                commitHistoryFile.fileName = value.path.toString;
                commitHistoryFile.fileStatus = value.type;               
                return commitHistoryFile;
            });
            this.prepareDiffFromCommitDetails(commitDetailData);
        })
    }

    prepareDiffFromCommitDetails(commitHistoryFileData:CommitHistoryFileData) {
        this.diffFiles = [];
        commitHistoryFileData.commitedFiles.forEach(commitFile=>{
                let comparableCommits = [];
                let fileName = commitFile.fileName;
                comparableCommits.push(commitHistoryFileData.commitId);
                if(commitFile.fileStatus!='ADD' && commitFile.fileStatus!='COPY') {
                    comparableCommits.push(commitHistoryFileData.parentCommitId);
                }
                this.matHeaderProgressData.setHidden(false);
                this.bitbucketService.getRawFileCommiDetailsFromCommitIds(
                    comparableCommits,
                    fileName
                ).subscribe(fileHistoryDetailData=>{
                    let diffData = fileHistoryDetailData;
                    let ngxDiffFile = new NgxDiffFile();
                    ngxDiffFile.fileName = fileName.replace(/^.*[\\\/]/, '');
                    if(diffData[0].commitId===comparableCommits[0]){
                        if(commitFile.fileStatus==='ADD' || commitFile.fileStatus==='COPY') {
                            ngxDiffFile.oldFileContent = '';
                        }
                        else {
                            ngxDiffFile.oldFileContent = diffData[1].fileString;
                        }
                        ngxDiffFile.newFileContent = diffData[0].fileString;
                    }
                    else if (diffData[1].commitId===comparableCommits[0]){
                        if(commitFile.fileStatus==='ADD' || commitFile.fileStatus==='COPY') {
                            ngxDiffFile.oldFileContent = '';
                        }
                        else {
                            ngxDiffFile.oldFileContent = diffData[0].fileString;
                        }
                        ngxDiffFile.newFileContent = diffData[1].fileString;
                    }
                    this.diffFiles.push(ngxDiffFile);   
                    if(this.diffFiles.length === commitHistoryFileData.commitedFiles.length ) {
                        this.showFileDiff = true;
                        this.matHeaderProgressData.setHidden(true);
                    }
                })                         
        })         
    }

    closeCommitHistoryDetails() {
        this.showFileDiff = false;
    }

    downloadFile(commitId: string, filePath: string) {
        let commitIds = [commitId];
        this.matHeaderProgressData.setHidden(false);
        this.bitbucketService.getRawFileCommiDetailsFromCommitIds(commitIds, filePath).subscribe(fileHistoryBean=>{
            let fileData = fileHistoryBean[0].fileString;
            this.matHeaderProgressData.setHidden(true);
            CommonUtility.download(CommonUtility.getFileNameFromFullPath(filePath),fileData);
        })
    }

}