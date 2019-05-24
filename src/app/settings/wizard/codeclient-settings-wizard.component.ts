import { Component, OnInit, AfterViewChecked, AfterViewInit } from '@angular/core';
import { CodeClientSettingService } from '../service/codeclient-settings.service';
import { CodeClientSetting } from '../model/codeclient-setting.model';
import { MatHeaderProgressData } from '../../util/mat-header-progress/mat-header-progress.data';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'codeclient-settings-wizard',
  templateUrl: './codeclient-settings-wizard.component.html',
  styleUrls: ['./codeclient-settings-wizard.component.css']
})
export class CodeClientSettingsWizardComponent implements OnInit {
    constructor(
          public dialogRef: MatDialogRef<CodeClientSettingsWizardComponent>,
          private codeClientSettingsService: CodeClientSettingService,
          private matHeaderProgressData:MatHeaderProgressData) {
    } 

    bearerToken:string;

    ngOnInit() {
      let codeClientSetting: CodeClientSetting = this.codeClientSettingsService.loadSetting();
      if(codeClientSetting){
        this.bearerToken = codeClientSetting.bearerToken
      }
    }

    saveConfig() {
      let codeClientSetting: CodeClientSetting = new CodeClientSetting();
      codeClientSetting.bearerToken = this.bearerToken;
      this.matHeaderProgressData.setHidden(false);
      this.codeClientSettingsService.saveSetting(codeClientSetting).then(codeClientSetting=>{
        this.matHeaderProgressData.setHidden(true);
      })
      this.dialogRef.close(codeClientSetting);
    }
}
