import { OnInit, Component, ViewChild, Inject, OnDestroy, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSelect, MatOption } from '@angular/material';
import { CommitHistoryFilterModel, CommitHistoryFilteredModel } from './commit-history-filter.model';
import { DateUtil } from 'src/app/util/date.util';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

@Component({
    selector:'commit-history-filter',
    templateUrl:'./commit-history-filter.component.html',
    styleUrls:['./commit-history-filter.component.css'],
})
export class CommitHistoryFilter implements OnInit, AfterViewInit, OnDestroy  {
    startDate = new Date();
    authors:string[] = [];
    commitIds:string[] = [];
    fromDate: Date;
    toDate: Date;
    closeButtonText = "Close";
    selectedAuthors: string[];
    disableOk = true;

    /** control for the selected bank for multi-selection */
    public bankMultiCtrl: FormControl = new FormControl();

    /** control for the MatSelect filter keyword multi-selection */
    public bankMultiFilterCtrl: FormControl = new FormControl();

    /** list of banks filtered by search keyword */
    public filteredBanksMulti: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);

    /** Subject that emits when the component has been destroyed. */
    protected _onDestroy = new Subject<void>();

    @ViewChild('authorSelect') authorSelect: MatSelect;

    constructor(
        public dialogRef: MatDialogRef<CommitHistoryFilter>,
        private dateUtil:DateUtil,
        @Inject(MAT_DIALOG_DATA) public data: CommitHistoryFilterModel) {
    }

    ngOnInit(): void {
        this.init();
        this.initDefaultValues();
    }

    init() {
        this.data.tableData.map(commitHistory=>{
            if(this.authors.indexOf(commitHistory.author)===-1){
                this.authors.push(commitHistory.author);
            }
        })
        this.authors.sort();
        
        // load the initial authors list        
        this.filteredBanksMulti.next(this.authors.slice());
        // listen for search field value changes
        this.bankMultiFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
        this.filterBanksMulti();
        });
    }

    ngAfterViewInit() {
        this.setInitialValue();
    }
    
    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    /**
    * Sets the initial value after the filteredBanks are loaded initially
   */
    protected setInitialValue() {
        this.filteredBanksMulti
        .pipe(take(1), takeUntil(this._onDestroy))
        .subscribe(() => {
            // setting the compareWith property to a comparison function
            // triggers initializing the selection according to the initial value of
            // the form control (i.e. _initializeSelection())
            // this needs to be done after the filteredBanks are loaded initially
            // and after the mat-option elements are available
            this.authorSelect.compareWith = (a: string, b: string) => a && b && a === b;
        });
    }

    protected filterBanksMulti() {
        if (!this.authors) {
            return;
        }
        // get the search keyword
        let search = this.bankMultiFilterCtrl.value;
        if (!search) {
            this.filteredBanksMulti.next(this.authors.slice());
            return;
        } 
        else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredBanksMulti.next(
        this.authors.filter(author => author.toLowerCase().indexOf(search) > -1)
        );
    }

    initDefaultValues() {
        if(this.data.commitHistoryFilteredModel) {
            if(this.data.commitHistoryFilteredModel.authors){
                this.selectedAuthors =  this.data.commitHistoryFilteredModel.authors;
                this.bankMultiCtrl.setValue(this.selectedAuthors);
            }
            if(this.data.commitHistoryFilteredModel.fromDate) {
                this.fromDate = this.dateUtil.parse(this.data.commitHistoryFilteredModel.fromDate)
            }
            if(this.data.commitHistoryFilteredModel.toDate) {
                this.toDate = this.dateUtil.parse(this.data.commitHistoryFilteredModel.toDate);
            }
            if(this.fromDate || this.toDate || this.data.commitHistoryFilteredModel.authors){
                this.closeButtonText  = "Reset";
                this.disableOk = false;
            }        
            else{
                this.closeButtonText  = "Close";
                this.disableOk = true;
            }
        }
    }
    
    onOkClick(): void {
        let commitHistoryFilteredModel = new CommitHistoryFilteredModel();
        if(this.fromDate || this.toDate || this.authorSelect.value){
            commitHistoryFilteredModel.authors = [];
            this.authorSelect.options.forEach( (item : MatOption) => {
                if(item.selected){
                    commitHistoryFilteredModel.authors.push(item.value);
                }
            });
            if(this.fromDate){
                commitHistoryFilteredModel.fromDate = this.dateUtil.format(this.fromDate,"dd/mm/yyyy hh:mm:ss");
            }
            if(this.toDate){
                commitHistoryFilteredModel.toDate = this.dateUtil.format(this.toDate,"dd/mm/yyyy hh:mm:ss");
            }                                    
        }       
        this.dialogRef.close(commitHistoryFilteredModel);
    }

    clearFilters(): void {      
        if(this.closeButtonText==="Close") {
            let commitHistoryFilteredModel = new CommitHistoryFilteredModel();
            this.dialogRef.close(commitHistoryFilteredModel);  
        }
        else {
            this.authorSelect.options.forEach( (item : MatOption) => {item.deselect()});
            this.fromDate = null;
            this.toDate = null;
            this.closeButtonText  = "Close"; 
            this.disableOk = true; 
        }    
    }

    dirtyCheck() {
        if(this.fromDate || this.toDate || this.authorSelect.value.length>0){            
            this.closeButtonText  = "Reset";
            this.disableOk = false;
        }        
        else{
            this.closeButtonText  = "Close";
            this.disableOk = true;
        }
    }
  
}