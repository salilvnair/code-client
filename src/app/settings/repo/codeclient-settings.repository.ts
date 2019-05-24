import { Injectable } from '@angular/core';
import { NeDBRepository } from "@salilvnair/ngpa";
import { CodeClientSetting } from '../model/codeclient-setting.model';

@Injectable({
    providedIn: 'root'
})
export class CodeClientSettingsRepository extends NeDBRepository<CodeClientSetting> {
  returnEntityInstance(): CodeClientSetting {
    return new CodeClientSetting();
  }
}