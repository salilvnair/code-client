import { Component, OnInit } from '@angular/core';
import { CodeClientSettingService } from '../service/codeclient-settings.service';
import { MatHeaderProgressData } from '../../util/mat-header-progress/mat-header-progress.data';
import { MatDialogRef } from '@angular/material';
import { ProfileSetting, ContextURL } from '../model/profile-setting.model';
import { BitbucketContext } from 'src/app/api/setting/client/bitbucket/type/bitbucket-url.context';

@Component({
  selector: 'codeclient-profile-setting',
  templateUrl: './codeclient-profile-setting.component.html',
  styleUrls: ['./codeclient-profile-setting.component.css']
})
export class CodeClientProfileSettingComponent implements OnInit {
    constructor(
          public dialogRef: MatDialogRef<CodeClientProfileSettingComponent>,
          private codeClientSettingsService: CodeClientSettingService,
          private matHeaderProgressData:MatHeaderProgressData) {
    } 

    apiProviders = [
      {
        name:'Bitbucket',
        value:'bitbucket',
        apiPrefixUrl:'https://api.bitbucket.org',
        disabled:false
      },
      {
        name:'Github',
        value:'github',
        apiPrefixUrl:'https://api.github.com',
        disabled:true
      },
      {
        name:'GitLab',
        value:'gitlab',
        apiPrefixUrl:'https://gitlab.com/api',
        disabled:true
      }
    ]
    selectedProvider = this.apiProviders[0];

    profileSetting: ProfileSetting;

    dbProfileSetting: ProfileSetting;

    valuesChanged = false;

    uploadedProfileJson:ProfileSetting;

    ngOnInit() {
      this.init();
    }

    init() {
      this.loadProfile();
      if(!this.profileSetting.profile) {
         this.profileSetting = this.loadDefaultBitbucketProfile(); 
      }
    }

    loadDefaultBitbucketProfile() {
      let profileSetting  = new ProfileSetting();
      let contextURLs:ContextURL[] = [];
      let contextURL = new ContextURL();
      console.log(BitbucketContext);
      contextURL.context = BitbucketContext.recentRepo;
      contextURL.displayName = 'Recent Repository URL Context';
      contextURL.url = '';
      contextURLs.push(contextURL);

      contextURL = new ContextURL();
      contextURL.context = BitbucketContext.repoBranches;
      contextURL.displayName = 'Repository Branches URL Context';
      contextURL.url = '';
      contextURLs.push(contextURL);

      contextURL = new ContextURL();
      contextURL.context = BitbucketContext.commitHistory;
      contextURL.displayName = 'Commit History URL Context';
      contextURL.url = '';
      contextURLs.push(contextURL);

      contextURL = new ContextURL();
      contextURL.context = BitbucketContext.commitHistoryFileChanges;
      contextURL.displayName = 'Commit History File Changes URL Context';
      contextURL.url = '';
      contextURLs.push(contextURL);

      contextURL = new ContextURL();
      contextURL.context = BitbucketContext.fileHistory;
      contextURL.displayName = 'File History URL Context';
      contextURL.url = '';
      contextURLs.push(contextURL);

      contextURL = new ContextURL();
      contextURL.context = BitbucketContext.rawFile;
      contextURL.displayName = 'Commit History Download Raw File URL Context';
      contextURL.url = '';
      contextURLs.push(contextURL);
      profileSetting.profile = 'bitbucket';
      profileSetting.contextURLs = contextURLs;
      return profileSetting;
    }

    dirtyCheck() {
      this.valuesChanged = true;
    }

    loadProfile() {
      this.profileSetting = this.codeClientSettingsService.loadProfileSetting();
      if(this.profileSetting && this.profileSetting.profile) {
        this.dbProfileSetting = {...this.profileSetting};
        if(this.profileSetting.apiProviderSetting) {
          this.selectedProvider = this.profileSetting.apiProviderSetting;
          let selectedProviderIndex = this.apiProviders.findIndex(apiProvider=>{
              if(apiProvider.value === this.selectedProvider.value) {
                return true;
              }            
          })
          this.apiProviders.splice(selectedProviderIndex,1);
          this.apiProviders.unshift(this.profileSetting.apiProviderSetting);
        }
      }
    }

    uploadProfile() {
      this.selectedProvider = this.uploadedProfileJson.apiProviderSetting;
      this.profileSetting = this.uploadedProfileJson;  
      let selectedProviderIndex = this.apiProviders.findIndex(apiProvider=>{
        if(apiProvider.value === this.selectedProvider.value) {
          return true;
        }            
      })
      this.apiProviders.splice(selectedProviderIndex,1);
      this.apiProviders.unshift(this.profileSetting.apiProviderSetting);   
    }

    importProfile(event:any) {
      this.dirtyCheck();
      var reader = new FileReader();      
			reader.readAsText(event.target.files[0]);
			reader.onload = (event:any) => { 
        this.uploadedProfileJson = JSON.parse(event.target.result); 
        this.uploadProfile();
			}
    }

    saveProfile() {
      this.matHeaderProgressData.setHidden(false);
      this.profileSetting.apiProviderSetting = this.selectedProvider;
      if(this.dbProfileSetting && this.dbProfileSetting.profile){
        this.codeClientSettingsService.updateProfileSetting(this.dbProfileSetting,this.profileSetting).then(()=>{
          this.matHeaderProgressData.setHidden(true);
        })
      }
      else {
        this.codeClientSettingsService.saveProfileSetting(this.profileSetting).then(()=>{
          this.matHeaderProgressData.setHidden(true);
        })
      }
      this.dialogRef.close(this.profileSetting);
    }

    closeProfile() {
      this.dialogRef.close(this.profileSetting);
    }
}
