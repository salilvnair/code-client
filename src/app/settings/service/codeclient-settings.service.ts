import { Injectable } from '@angular/core';
import { CodeClientSetting } from '../model/codeclient-setting.model';
import { CodeClientSettingsDataService } from './codeclient-data-settings.service';
import { ProfileSetting } from '../model/profile-setting.model';

@Injectable({
    providedIn:'root'
})
export class CodeClientSettingService {

    constructor(private codeClientSettingsDataService: CodeClientSettingsDataService){}

    saveSetting(codeClientSetting:CodeClientSetting): Promise<CodeClientSetting> {
        return this.codeClientSettingsDataService.saveCodeClientSettings(codeClientSetting);
    }

    updateSetting(oldCodeClientSetting:CodeClientSetting, newCodeClientSetting:CodeClientSetting): Promise<CodeClientSetting> {
        return this.codeClientSettingsDataService.updateCodeClientSettings(oldCodeClientSetting, newCodeClientSetting);
    }

    loadSetting(): CodeClientSetting {
        return this.codeClientSettingsDataService.selectCodeClientSettings();
    }

    saveProfileSetting(profileSetting:ProfileSetting): Promise<ProfileSetting> {
        return this.codeClientSettingsDataService.saveCodeClientProfileSetting(profileSetting);
    }

    updateProfileSetting(oldCodeClientSetting:ProfileSetting, newCodeClientSetting:ProfileSetting): Promise<ProfileSetting> {
        return this.codeClientSettingsDataService.updateCodeClientProfileSetting(oldCodeClientSetting, newCodeClientSetting);
    }

    loadProfileSetting(): ProfileSetting {
        return this.codeClientSettingsDataService.selectCodeClientProfileSetting();
    }

}