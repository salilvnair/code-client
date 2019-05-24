import { Injectable } from '@angular/core';
import { CodeClientSettingsRepository } from '../repo/codeclient-settings.repository';
import { CodeClientSetting } from '../model/codeclient-setting.model';


const CONF_COLUMN_APP = 'app';
const CONF_COLUMN_APP_VALUE = 'codeclient';
@Injectable({
    providedIn: 'root'
})
export class CodeClientSettingsDataService {

    constructor(
        private codeClientSettingsRepo: CodeClientSettingsRepository
      ) {}

      selectCodeClientSettings() {
        return this.codeClientSettingsRepo.selectOneByColumnSync(
          CONF_COLUMN_APP,
          CONF_COLUMN_APP_VALUE
        );
      }
      saveCodeClientSettings(
        codeClientSetting: CodeClientSetting
      ): Promise<CodeClientSetting> {
        return this.codeClientSettingsRepo.save(codeClientSetting);
      }
      updateCodeClientSettings(
        oldSetting: CodeClientSetting,
        newSetting: CodeClientSetting
      ) {
        let updatedVal = this.codeClientSettingsRepo.update(oldSetting, newSetting);
        this.codeClientSettingsRepo.compactDatabase();
        return updatedVal;
      }

}