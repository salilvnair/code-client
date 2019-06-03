import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { BitbucketService } from '../service/bitbucket.service';
import { RepoFilesResponse } from 'src/app/api/rest/model/repo-files.reponse';
import { MatHeaderProgressData } from 'src/app/util/mat-header-progress/mat-header-progress.data';
import { CommonUtility } from 'src/app/util/common/common.util';
import { FileHistoryBean } from '../model/file-history.model';

@Component({
  selector: 'browse-files',
  templateUrl: './browse-files.component.html',
  styleUrls: ['./browse-files.component.css']
})
export class BrowseFilesComponent implements OnInit {
  selectedBranchName:string  = 'master';
  selectedMergeSetting = 'exclude';
  repoBranches: string[];
  /** control for the selected branchNames */
  public branchNameCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public branchNameFilterCtrl: FormControl = new FormControl();


    /** list of branchNames filtered by search keyword */
  public filteredBranchNames: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  @ViewChild('branchSelect') branchSelect: MatSelect;

  dataSource = new MatTableDataSource<string>();

  repoFiles = [];

  displayedColumns = ['name'];

  constructor(
    private bitbucketService: BitbucketService,
    private router: Router,
    private matHeaderProgressData:MatHeaderProgressData
  ) {}

  ngOnInit() {
    this.changeHeaderTitle(false);
    this.redirectToDashBoardCheck();
    this.loadSelectedRepoBranchNames();
    this.loadSelectedBranchRepoFiles();
  }

  redirectToDashBoardCheck() {
    if(!this.bitbucketService.getSelectedDashBoardData()) {
        this.router.navigate(["dashboard"]);
    }
  }

  loadSelectedBranchRepoFiles() {
    this.matHeaderProgressData.setHidden(false);
    this.bitbucketService.getRepoFiles(this.selectedBranchName,'100000').subscribe(response=> {
      let repoFilesResponse:RepoFilesResponse = new RepoFilesResponse();
      repoFilesResponse = response.body;
      this.dataSource.data = repoFilesResponse.values;
      this.matHeaderProgressData.setHidden(true);
    })
    this.applyFilterPredicate();    
  }

  onChangeRepoBranch() {
    this.loadSelectedBranchRepoFiles();
  }

  
  ngOnDestroy() {
    this.changeHeaderTitle(true);
    this._onDestroy.next();
    this._onDestroy.complete();
  }

/**
* Sets the initial value after the filteredBanks are loaded initially
*/
  protected setInitialValue() {
    this.filteredBranchNames
    .pipe(take(1), takeUntil(this._onDestroy))
    .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
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
    this.repoBranches.filter(bank => bank.toLowerCase().indexOf(search) > -1)
    );
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
        })
    }
  }

  getFileIcon(fileName: string) {
    let fileExtension = CommonUtility.getFileExtension(fileName);
    fileExtension = fileExtension.toLowerCase();
    let iconName;
    if(fileExtension==='xls'||fileExtension==='xlsx') {
      iconName = 'xls'
    }
    else if(fileExtension==='jsp'||fileExtension==='html') {
      iconName = 'html'
    }
    else if(fileExtension==='gif'||fileExtension==='png'||fileExtension==='jpg'||fileExtension==='jpeg') {
      iconName = 'image'
    }
    else if(fileExtension==='xml'||fileExtension==='xsd'||fileExtension==='wsdl') {
      iconName = 'file_code'
    }
    else if(fileExtension==='properties') {
      iconName = 'gear'
    }
    else if(fileExtension==='gitignore' || fileExtension === 'gitattributes') {
      iconName = 'git'
    }
    else if(fileExtension==='jks') {
      iconName = 'lock'
    }
    else if(fileExtension==='css') {
      iconName = 'css'
    }
    else if(fileExtension==='java') {
      iconName = 'java'
    }
    else if(fileExtension==='js') {
      iconName = 'js'
    }
    else if(fileExtension==='pdf') {
      iconName = 'pdf'
    }
    return "assets/icon/"+iconName+".svg";
  }

  applyFilter(filterValue: string) {
    setTimeout(()=>{
      this.dataSource.filter = filterValue.trim().toLowerCase();
    },500)    
  }

  applyFilterPredicate() {
    this.dataSource.filterPredicate  = (data: string, filter: string) => {
       let filterMatched = false;
        if(data.toLowerCase().indexOf(filter)>-1) {
          filterMatched = true;
        }
        return filterMatched;
       };
  }

  onFilePathClick(filePath:string) {
    this.bitbucketService.fromRepoFiles = true;
    let fileHistoryBean = new FileHistoryBean();
    fileHistoryBean.branchName = this.selectedBranchName;
    fileHistoryBean.filePath = filePath;
    this.bitbucketService.setSelectedFileHistoryData(fileHistoryBean);
    this.router.navigate(["file-history"]);
  }
}
