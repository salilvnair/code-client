import { Injectable } from '@angular/core';
import { NeDBRepository } from "@salilvnair/ngpa";
import { ProfileSetting } from '../model/profile-setting.model';

@Injectable({
    providedIn: 'root'
})
export class CodeClientProfileSettingRepository extends NeDBRepository<ProfileSetting> {
  returnEntityInstance(): ProfileSetting {
    return new ProfileSetting();
  }
}