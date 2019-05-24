import { Injectable } from '@angular/core';
import { CodeClientSetting } from '../model/codeclient-setting.model';
import { CodeClientSettingsRepository } from '../repo/codeclient-settings.repository';
import { CodeClientSettingsDataService } from './codeclient-data-settings.service';

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

}