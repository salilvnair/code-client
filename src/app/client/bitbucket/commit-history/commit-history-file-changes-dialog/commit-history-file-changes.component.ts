import { OnInit, Component, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { NgxFileNode, NgxFileExplorerBuilder } from '@salilvnair/ngx-file-explorer';
import { CommitHistoryFileChangesModel, CommitHistoryFileChangesDataSource } from './commit-history-file-changes.model';
import { ExcelUtil } from 'src/app/util/excel.util';

@Component({
    selector:'commit-history-file-changes',
    templateUrl:'./commit-history-file-changes.component.html',
    styleUrls:['./commit-history-file-changes.component.css'],
})
export class CommitHistoryFileChangesDialog implements OnInit{
    displayedColumns = ['position', 'name', 'path', 'type'];
    filePath=[];
    folderView = false;
    commitHistoryFileExplorerData: NgxFileNode;
    dataSource:CommitHistoryFileChangesDataSource[] = [];
    constructor(
        public dialogRef: MatDialogRef<CommitHistoryFileChangesDialog>,
        private excelUtil: ExcelUtil,
        @Inject(MAT_DIALOG_DATA) public data: CommitHistoryFileChangesModel
        ) {
    }

    ngOnInit(): void {
        this.initDataSource();
        this.initFileExplorerView();
    }

    initFileExplorerView() {
        let diffFiles = this.dataSource.map(data=>{
            return data.path+"_color_"+data.color
        })
        let filePathCollection = [];
        filePathCollection = diffFiles.map(difFile=>{  
          return difFile.split("/");;
        })
        let ngxFileExplorerBuilder = new NgxFileExplorerBuilder();
        let rootChildren = ngxFileExplorerBuilder.filePathCollection(filePathCollection).build();        
        this.commitHistoryFileExplorerData = new NgxFileNode({name:this.data.selectedRepo, children:rootChildren})
    }

    initDataSource() {
        let index = 0;
        this.data.commitHistoryFileChanges.map(commitHistoryFileChange=>{
            commitHistoryFileChange.commitedFiles.forEach(commitHistoryFile=>{
                if(this.filePath.indexOf(commitHistoryFile.fileName)===-1){
                    index++;
                    this.filePath.push(commitHistoryFile.fileName);
                    //console.log(commitHistoryFile)
                    let commitHistoryFileChangesData:CommitHistoryFileChangesDataSource = new CommitHistoryFileChangesDataSource();
                    let filePath = commitHistoryFile.fileName;
                    commitHistoryFileChangesData.position = index;
                    commitHistoryFileChangesData.name =  filePath.replace(/^.*[\\\/]/, '');
                    commitHistoryFileChangesData.path = filePath;
                    commitHistoryFileChangesData.type = commitHistoryFile.fileStatus;
                    commitHistoryFileChangesData.color = commitHistoryFile.color;
                    this.dataSource.push(commitHistoryFileChangesData);
                }
            })
        })
    }

    onClickClose() {
        this.dialogRef.close();
    }

    exportToExcel() {
        this.excelUtil.exportToExcel(this.dataSource,this.data.selectedRepo,this.data.selectedBranch);
    }
}