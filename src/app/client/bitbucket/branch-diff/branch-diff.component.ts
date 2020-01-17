import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSelect, MatSort, MatPaginator } from '@angular/material';
import { CommitHistoryData } from '../model/commit-history.model';
import { Subject, ReplaySubject } from 'rxjs';
import * as dateFormat from 'dateformat';
import { FormControl } from '@angular/forms';
import { BitbucketService } from '../service/bitbucket.service';
import { DateUtil } from 'src/app/util/date.util';
import { Router } from '@angular/router';
import { ExcelUtil } from 'src/app/util/excel.util';
import { HeaderService } from 'src/app/header/header.service';
import { MatHeaderProgressData } from 'src/app/util/mat-header-progress/mat-header-progress.data';
import { takeUntil } from 'rxjs/operators';
import { CommitHistoryFilteredModel } from '../commit-history/commit-history-filter-dialog/commit-history-filter.model';
import { ExcelExportModel } from '../model/excel-export.model';

@Component({
  selector: 'branch-diff',
  templateUrl: './branch-diff.component.html',
  styleUrls: ['./branch-diff.component.css']
})
export class BranchDiffComponent implements OnInit {
  dataSource = new MatTableDataSource<CommitHistoryData>();
  fromBranchCommitHistoryData: CommitHistoryData[];
  toBranchCommitHistoryData: CommitHistoryData[];// it will have initial data with master branch
  selectedToBranchName:string  = 'master';
  selectedFromBranchName:string  = '';
  selectedMergeSetting = 'exclude';
  repoBranches: string[] = [];
  toBranchCommitIds: string [] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['author', 'commitId', 'commitMessage', 'date'];
  filterColumns: string[] = ['author', 'commitId', 'commitMessage', 'date'];
  showSearchBox = false;
  showToolBarBtns = true;
  lovSelected = "all";
  strictMatch = false;    
  filterString:string = '';
  commitHistoryFilteredModel: CommitHistoryFilteredModel;
   /** control for the selected branchNames */
  public fromBranchNameCtrl: FormControl = new FormControl();

   /** control for the MatSelect filter keyword */
  public fromBranchNameFilterCtrl: FormControl = new FormControl();


     /** list of branchNames filtered by search keyword */
  public filteredFromBranchNames: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);

  public toBranchNameCtrl: FormControl = new FormControl();

   /** control for the MatSelect filter keyword */
  public toBranchNameFilterCtrl: FormControl = new FormControl();


     /** list of branchNames filtered by search keyword */
  public filteredToBranchNames: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  @ViewChild('toBranchSelect') toBranchSelect: MatSelect;
  @ViewChild('fromBranchSelect') fromBranchSelect: MatSelect;

  constructor(
      private bitbucketService:BitbucketService,
      private dateUtil:DateUtil,
      private router: Router,
      private excelUtil:ExcelUtil,
      private headerService: HeaderService,
      private matHeaderProgressData:MatHeaderProgressData
  ) { }

  ngOnInit() {
    this.init();
  }

  init() {
    this.redirectToDashBoardCheck();
    this.changeHeader(false);
    this.loadSelectedRepoBranchNames();        
  }

  redirectToDashBoardCheck() {
    if(!this.bitbucketService.getSelectedDashBoardData()) {
        this.router.navigate(["dashboard"]);
    }
  }

  changeHeader(defaultTitle:boolean) {
    this.headerService.changeHeader(defaultTitle);
  }

  loadSelectedRepoBranchNames() {
    this.matHeaderProgressData.setHidden(false);
    if(this.bitbucketService.getSelectedDashBoardData()) {
        this.bitbucketService.getSelectedRepoBranchNames('10000').subscribe(response=>{
            let branchNamesResp = response.body;
            this.repoBranches = branchNamesResp.values.map(branchNameData=>{
                if(branchNameData.isDefault){
                    this.selectedToBranchName = branchNameData.displayId;
                }
                return branchNameData.displayId;
            })
            // set initial selection
            this.toBranchNameCtrl.setValue(this.selectedToBranchName);

            // load the initial branchname list
            this.filteredToBranchNames.next(this.repoBranches.slice());

            // listen for search field value changes
            this.toBranchNameFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterToBranchNames();
            });  

            // set initial selection
            this.fromBranchNameCtrl.setValue(this.selectedFromBranchName);

            // load the initial branchname list
            this.filteredFromBranchNames.next(this.repoBranches.slice());

            // listen for search field value changes
            this.fromBranchNameFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterFromBranchNames();
            });            
            this.matHeaderProgressData.setHidden(true);
        })
    }
  }

  protected filterFromBranchNames() {
    if (!this.repoBranches) {
        return;
    }
    // get the search keyword
    let search = this.fromBranchNameFilterCtrl.value;
    if (!search) {
        this.filteredFromBranchNames.next(this.repoBranches.slice());
        return;
    } 
    else {
        search = search.toLowerCase();
    }
    // filter the branch names
    this.filteredFromBranchNames.next(
    this.repoBranches.filter(branch => branch.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterToBranchNames() {
    if (!this.repoBranches) {
        return;
    }
    // get the search keyword
    let search = this.toBranchNameFilterCtrl.value;
    if (!search) {
        this.filteredToBranchNames.next(this.repoBranches.slice());
        return;
    } 
    else {
        search = search.toLowerCase();
    }
    // filter the branch names
    this.filteredToBranchNames.next(
    this.repoBranches.filter(branch => branch.toLowerCase().indexOf(search) > -1)
    );
  }

  prepareComparedDataSource(compareData: CommitHistoryData[]) {
    //same branch name will be disabled
    //load fromBranchLogData and toBranchLogData 
    //prepare commitId array of from and then 
    //pop same commitId which is present in toBranch
    //toBranchCommitIds.indexOf(fromCommitIdItr){ slice(index,1) of fromBranch }
    //finally we will have fromBranchCommitIds which are not there in toBranchData
    //dataSource.data = toBranchData;
    for(let i=compareData.length; i>=0 ;i--) {
      let fromBranchCommitHistory = compareData[i]; 
      if(fromBranchCommitHistory) {
        if(this.toBranchCommitIds.indexOf(fromBranchCommitHistory.commitId)>-1) {
          compareData.splice(i,1);
        }
      }
      else {
        compareData.splice(i,1);
      }
    }
    this.dataSource.data = compareData;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.toBranchCommitIds = [];
  }

  onChangeMergeSetting() {
    this.onChangeRepoBranch();
  }

  onChangeRepoBranch() {
    if(this.selectedFromBranchName==''){
      return;
    }
    this.dataSource = new MatTableDataSource<CommitHistoryData>();
    this.matHeaderProgressData.setHidden(false);
    this.loadBranchCommitHistory(this.selectedToBranchName,'0','10000','to').subscribe(toCommitHistory=>{
      this.toBranchCommitHistoryData = toCommitHistory;
      this.loadBranchCommitHistory(this.selectedFromBranchName,'0','10000','from').subscribe(fromCommitHistory=>{
        this.prepareComparedDataSource(fromCommitHistory);
        this.applyFilterPredicate();
        this.matHeaderProgressData.setHidden(true);
      });    
    });    
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

  applySimpleFilter(data: CommitHistoryData, filter: string) {
    if(filter.indexOf(",")!==-1 && this.lovSelected!='all'){
        const searchArray = filter.split(",").map(item => item.trim()).filter(v => v);
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
    let excelData: ExcelExportModel[] = [];
    excelData = this.dataSource.filteredData.map(data=>{
      let excelExportModel : ExcelExportModel = new ExcelExportModel();
      excelExportModel.author = data.author;
      excelExportModel.commitId = data.commitId;
      excelExportModel.commitMessage = data.commitMessage;
      excelExportModel.date = data.date;
      if(data.parentCommitId==null || data.parentCommitId==='') {
        excelExportModel.isMergeCommit = true;
      }
      return excelExportModel;
    })
    this.excelUtil.exportToExcel(excelData, this.bitbucketService.getSelectedDashBoardData().repo_slug,'compare_branches_'+this.selectedToBranchName+"__"+this.selectedFromBranchName);
  }

  applyFilter(filterValue: string) {        
    this.commitHistoryFilteredModel = null;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
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


  loadBranchCommitHistory(branchName:string,start:string,limit:string,origin:string) {
    let branchCommitHistoryDataNotifier = new Subject<CommitHistoryData[]>();
    this.matHeaderProgressData.setHidden(false);
    this.bitbucketService.getCommitHistory(branchName,start,limit,this.selectedMergeSetting).subscribe(response=>{        
        let responseBody = response.body;
        let branchCommitHistoryData = responseBody.values.map(({id,displayId,message,author,authorTimestamp,parents})=>{
            let date = new Date(authorTimestamp); 
            let commitHistoryData = new CommitHistoryData();
            commitHistoryData.select = displayId;
            commitHistoryData.author = author.displayName?author.displayName:author.name;
            commitHistoryData.commitId = displayId;
            if(origin==='to') {
              this.toBranchCommitIds.push(displayId);
            }
            commitHistoryData.commitMessage = message;
            if(parents.length>1) {
                //its a merge commit and 1st index is the real commit
                //handle a true false boolean based on which disable the context menu
            }
            else if(parents.length==1) {
                //show context menu with commit details
                commitHistoryData.parentCommitId  = parents[0].displayId;
            }
            commitHistoryData.date = dateFormat(date,'dd/mm/yyyy h:MM:ss TT');
            return commitHistoryData;
        })
        branchCommitHistoryDataNotifier.next(branchCommitHistoryData);
    })
    return branchCommitHistoryDataNotifier;
  }

  loadBranchNames() {

  }

}
