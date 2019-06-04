import { OnInit, Component, AfterViewInit, ViewChild, OnDestroy, ViewChildren } from '@angular/core';
import { BitbucketService } from '../service/bitbucket.service';
import { CommitHistoryData } from '../model/commit-history.model';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent, MatSelect, MatCheckbox, MatCheckboxChange } from '@angular/material';
import * as dateFormat from 'dateformat';
import { MatHeaderProgressData } from 'src/app/util/mat-header-progress/mat-header-progress.data';
import { DateUtil } from 'src/app/util/date.util';
import { Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ExcelUtil } from 'src/app/util/excel.util';
import { FileHistoryData } from '../model/file-history.model';
import { FileHistoryResponse } from 'src/app/api/rest/model/file-history.response';
import { CommitHistoryFilteredModel } from '../commit-history/commit-history-filter-dialog/commit-history-filter.model';
import { NgxDiffFile } from '@salilvnair/ngx-diff';
import { CommonUtility } from 'src/app/util/common/common.util';

@Component({
    selector:'file-history',
    templateUrl:'./file-history.component.html',
    styleUrls:['./file-history.component.css'],  
})
export class FileHistoryComponent implements OnInit, AfterViewInit, OnDestroy  {

    constructor(private bitbucketService:BitbucketService,
                private dateUtil:DateUtil,
                private router: Router,
                private excelUtil:ExcelUtil,
                private matHeaderProgressData:MatHeaderProgressData){}
    dataSource = new MatTableDataSource<FileHistoryData>();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChildren(MatCheckbox) checkboxes:MatCheckbox[];
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
    fileHistoryResponse:FileHistoryResponse;
    selectedBranchName:string  = 'master';
    selectedFilePath:string = '';
    fileHistoryFilteredModel: CommitHistoryFilteredModel;
    /** Subject that emits when the component has been destroyed. */
    protected _onDestroy = new Subject<void>();

    private commitIdsFileChangesSubscription = new Subscription();

    @ViewChild('branchSelect') branchSelect: MatSelect;

    comparableCommits: string[];
    comparableCommitsPosition: DOMRect[];
    compareButtonTopPosition: string;
    compareButtonLeftPosition: string;

    context = 10;
    outputFormat = 'side-by-side';
    diffFiles = [];
    showFileDiff = false;

    ngOnInit(){
        this.init();
    }

    init() {
        this.redirectToDashBoardCheck();
        this.changeHeaderTitle(false);
        this.initFileHistoryTableDataSource();
    }

    redirectToDashBoardCheck() {
        if(!this.bitbucketService.getSelectedDashBoardData()) {
            this.router.navigate(["dashboard"]);
        }
    }

    changeHeaderTitle(defaultTitle:boolean) {
        if(defaultTitle){
            document.getElementById('headerTitle').innerText = "Code Client";
        }
        else{
            if(this.bitbucketService.getSelectedDashBoardData()) {
                document.getElementById('headerTitle').innerText = this.bitbucketService.getSelectedDashBoardData().repo_name;
            }
            else{
                document.getElementById('headerTitle').innerText = "Code Client";
            }
        }
    }

    initFileHistoryTableDataSource() {
        if(this.bitbucketService.getSelectedFileHistoryData()){
            this.selectedBranchName = this.bitbucketService.getSelectedFileHistoryData().branchName;
            this.selectedFilePath = this.bitbucketService.getSelectedFileHistoryData().filePath;
        }        
        
        this.loadFileHistory('0','25');
        this.applyFilterPredicate();
    }

    ngAfterViewInit() {
     
    }
    
    ngOnDestroy() {
        this.changeHeaderTitle(true);
        this._onDestroy.next();
        this._onDestroy.complete();
        this.commitIdsFileChangesSubscription.unsubscribe();
    }

    loadFileHistory(start:string,limit:string) {
        this.matHeaderProgressData.setHidden(false);
        let observer:any;
        if(this.bitbucketService.fromRepoFiles){
            observer = this.bitbucketService.getRepoFileHistory(start,limit);
        }
        else{
            observer = this.bitbucketService.getFileHistory(start,limit);
        }        
        observer.subscribe(response=>{
            this.matHeaderProgressData.setHidden(true);
            let responseBody = response.body;
            this.fileHistoryResponse = responseBody;
            let fileHistoryDataSource= responseBody.values.map(({id,displayId,message,author,authorTimestamp})=>{
                let date = new Date(authorTimestamp); 
                let commitHistoryData = new CommitHistoryData();
                commitHistoryData.select = displayId;
                commitHistoryData.author = author.displayName?author.displayName:author.name;
                commitHistoryData.commitId = displayId;
                commitHistoryData.commitMessage = message;
                commitHistoryData.date = dateFormat(date,'dd/mm/yyyy hh:mm:ss');
                return commitHistoryData;
            })
            if(this.dataSource.data.length==0){
                //console.log(this.dataSource.data);
                this.dataSource.data = fileHistoryDataSource;
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            }
            else {
                fileHistoryDataSource.forEach(commitHistoryData=>{
                    this.dataSource.data.push(commitHistoryData);
                    this.dataSource.data = this.dataSource.data.slice(); 
                })
            }
        })
    }

    getNext(event: PageEvent) {      
        if(this.filterString==='' &&
            !this.fileHistoryResponse.isLastPage &&
            event.pageIndex > event.previousPageIndex &&
            event.pageIndex == Math.floor(event.length/event.pageSize)-1){
            ////console.log(this.commitHistoryResponse.nextPageStart);
            this.loadFileHistory(this.fileHistoryResponse.nextPageStart+'','25');
        }
    }

    fetchAllFileHistory() {
        this.loadFileHistory(this.fileHistoryResponse.nextPageStart+'','10000');
    }

    applyFilterPredicate() {
        this.dataSource.filterPredicate  = (data: CommitHistoryData, filter: string) => {
           let filterMatched = false;
           //console.log(data);
           if(this.fileHistoryFilteredModel){
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
        this.fileHistoryFilteredModel = null;
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
            .openFilterDialog(this.displayedColumns,this.dataSource.data,this.fileHistoryFilteredModel)
            .subscribe(fileHistoryFilteredModel=>{
                this.fileHistoryFilteredModel = fileHistoryFilteredModel;
                if(this.fileHistoryFilteredModel && 
                    Object.keys(this.fileHistoryFilteredModel).length > 0) {
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
        if(Object.keys(this.fileHistoryFilteredModel).length > 0){
            if (
                this.fileHistoryFilteredModel.fromDate &&
                this.fileHistoryFilteredModel.toDate &&
                this.fileHistoryFilteredModel.authors &&
                this.fileHistoryFilteredModel.authors.length ==0
              ) 
            {
                var fromDateSelected = this.dateUtil.parse(this.fileHistoryFilteredModel.fromDate);
                var toDateSelected = this.dateUtil.parse(this.fileHistoryFilteredModel.toDate);
                var objectDate = this.dateUtil.parse(data.date);
                return (
                  fromDateSelected.getTime() <= objectDate.getTime() &&
                  toDateSelected.getTime() >= objectDate.getTime()
                );
            } else if (
            this.fileHistoryFilteredModel.fromDate &&
            this.fileHistoryFilteredModel.toDate &&
            this.fileHistoryFilteredModel.authors &&
            this.fileHistoryFilteredModel.authors.length > 0
            ) {
                var fromDateSelected = this.dateUtil.parse(this.fileHistoryFilteredModel.fromDate);
                var toDateSelected = this.dateUtil.parse(this.fileHistoryFilteredModel.toDate);
                var objectDate = this.dateUtil.parse(data.date);
                let selectedAuthor = this.fileHistoryFilteredModel.authors.filter(
                    author => author === data.author
                );
                return (
                    selectedAuthor.length > 0 &&
                    fromDateSelected.getTime() <= objectDate.getTime() &&
                    toDateSelected.getTime() >= objectDate.getTime()
                );
            } 
            else if (this.fileHistoryFilteredModel.fromDate
                        && this.fileHistoryFilteredModel.authors.length > 0) {
                var fromDateSelected = this.dateUtil.parse(this.fileHistoryFilteredModel.fromDate);
                var objectDate = this.dateUtil.parse(data.date);
                let selectedAuthor = this.fileHistoryFilteredModel.authors.filter(
                    author => author === data.author
                );
                return (
                    selectedAuthor.length > 0 &&
                    fromDateSelected.getTime() <= objectDate.getTime()
                );
            } 
            else if (this.fileHistoryFilteredModel.fromDate 
                        && this.fileHistoryFilteredModel.authors.length == 0) {
                var fromDateSelected = this.dateUtil.parse(this.fileHistoryFilteredModel.fromDate);
                var objectDate = this.dateUtil.parse(data.date);
                return fromDateSelected.getTime() <= objectDate.getTime();
            } 
            else if (this.fileHistoryFilteredModel.authors.length > 0) {
                let selectedAuthor = this.fileHistoryFilteredModel.authors.filter(
                    author => author === data.author
                );
                return selectedAuthor.length > 0 ? true : false;
            } 
        } 
    }


    compareTwoCommits(event: MatCheckboxChange, commitId: string) {
        let domRect: DOMRect = event.source._elementRef.nativeElement.getBoundingClientRect();
        this.compareButtonTopPosition = null;
        this.compareButtonLeftPosition = null;
        if (!this.comparableCommits) {
            this.comparableCommits = [];
            this.comparableCommitsPosition = [];
            if (event.checked) {
            this.comparableCommits.push(commitId);
            this.comparableCommitsPosition.push(domRect);
            }
        } 
        else {
            if (this.comparableCommits.length <= 2) {
                if (event.checked) {
                    this.comparableCommits.push(commitId);
                    this.comparableCommitsPosition.push(domRect);
                } else {
                    this.comparableCommits = this.comparableCommits.filter(
                    item => item !== commitId
                    );
                    this.comparableCommitsPosition = this.comparableCommitsPosition.filter(
                    item => item.y !== domRect.y
                    );
                }
            }
        }
    }
    disableOtherHashId(commitId) {
        if (this.comparableCommits && this.comparableCommits.length >= 2) {
            if (this.comparableCommits.indexOf(commitId) > -1) {
            return false;
            }
            return true;
        }
        return false;
    }
    
    calculateCompareButtonTopPosition(rect1: DOMRect, rect2: DOMRect) {
      let finalTopPosition = 0;
      if (rect1.y > rect2.y) {
        finalTopPosition = (rect1.y - rect2.y) / 2 - 10;
        finalTopPosition = finalTopPosition + rect2.y;
      } else {
        finalTopPosition = (rect2.y - rect1.y) / 2 - 10;
        finalTopPosition = finalTopPosition + rect1.y;
      }
      finalTopPosition = Math.floor(finalTopPosition);
      return finalTopPosition + "px";
    }
    
    calculateCompareButtonLeftPosition(rect1: DOMRect) {
       let finalLeftPosition = Math.floor(rect1.x) - 12;
       return finalLeftPosition + "px";
    }
    
    getCompareButtonTopPosition() {
        if (!this.compareButtonTopPosition) {
            this.compareButtonTopPosition = this.calculateCompareButtonTopPosition(
                this.comparableCommitsPosition[0],
                this.comparableCommitsPosition[1]
            );
        }
        return this.compareButtonTopPosition;
    }

    getCompareButtonLeftPosition() {
        if (!this.compareButtonLeftPosition) {
            this.compareButtonLeftPosition = this.calculateCompareButtonLeftPosition(
             this.comparableCommitsPosition[0]
            );
        }
        return this.compareButtonLeftPosition;
    }

    onCompare() {
        if(this.selectedFilePath) {
            this.matHeaderProgressData.setHidden(false);
            this.bitbucketService.getRawFileCommiDetailsFromCommitIds(
                this.comparableCommits,
                this.selectedFilePath
            ).subscribe(fileHistoryDetailData=>{
                if(fileHistoryDetailData) {
                    this.matHeaderProgressData.setHidden(true);
                    let diffData = fileHistoryDetailData;
                    let ngxDiffFiles = [];
                    let ngxDiffFile = new NgxDiffFile();
                    if(diffData[0].commitId===this.comparableCommits[0]){
                        ngxDiffFile.oldFileContent = diffData[1].fileString;
                        ngxDiffFile.newFileContent = diffData[0].fileString;
                    }
                    else if (diffData[1].commitId===this.comparableCommits[0]){
                        ngxDiffFile.oldFileContent = diffData[0].fileString;
                        ngxDiffFile.newFileContent = diffData[1].fileString;
                    }
                    ngxDiffFile.fileName = this.selectedFilePath.replace(/^.*[\\\/]/, '');;
                    ngxDiffFiles.push(ngxDiffFile);
                    this.diffFiles = ngxDiffFiles;
                    this.showFileDiff = true;                   
                }
            })
        }
    }

    closeFileDiff() {
        this.showFileDiff = false;
    }

    closeFileHistory() {
        this.router.navigate(["commit-history"]);
    }

    disableFileDiffOnExtensions() {
        let nonComparableExtensions = ['jar','xls','xlsx','zip'];
        let fileExtention = CommonUtility.getFileExtension(this.selectedFilePath);
        if (nonComparableExtensions.indexOf(fileExtention.toLowerCase()) > -1) {
            return true;
        }
        return false;
    }
}