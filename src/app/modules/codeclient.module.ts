import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxFileExplorerModule } from '@salilvnair/ngx-file-explorer';
import { NgxDiffModule } from '@salilvnair/ngx-diff';
import { CommitHistoryComponent } from '../client/bitbucket/commit-history/commit-history.component';
import { HttpAuthInterceptor } from '../api/interceptor/http-auth.interceptor';
import { MaterialModule } from './material.module';
import { MatSvgIconComponent } from '../util/mat-svg-icon/mat-svg-icon.component';
import { CopyToClipboard } from '../util/directives/copy-to-clipboard.directive';
import { MatHeaderProgressComponent } from '../util/mat-header-progress/mat-header-progress.component';
import { CommitHistoryFilter } from '../client/bitbucket/commit-history/commit-history-filter-dialog/commit-history-filter.component';
import { AppDateAdapter, APP_DATE_FORMATS } from '../util/date.adapter';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { CodeClientRoutingModule } from '../routes/codeclient-routing.module';
import { HeaderComponent } from '../header/header.component';
import { CodeClientSettingsComponent } from '../settings/codeclient-settings.component';
import { CodeClientSettingsWizardComponent } from '../settings/wizard/codeclient-settings-wizard.component';
import { CommitHistoryFileChangesDialog } from '../client/bitbucket/commit-history/commit-history-file-changes-dialog/commit-history-file-changes.component';
import { CodeClientProfileSettingComponent } from '../settings/profile/codeclient-profile-setting.component';
import { FileHistoryComponent } from '../client/bitbucket/file-history/file-history.component';
import { NotifierModule } from '@ngxeu/notifier';
import { NgxElectronUpdaterModule } from '@ngxeu/core';
import { MatContextMenuComponent } from '../util/mat-context-menu/mat-context-menu.component';


const HTTP_INTERCEPTOR_PROVIDER_ARRAY = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpAuthInterceptor, multi: true }
]

const MAT_CUSTOM_DATE_FORMAT_PROVIDER = [
  {
    provide: DateAdapter,
    useClass: AppDateAdapter
  },
  {
    provide: MAT_DATE_FORMATS,
    useValue: APP_DATE_FORMATS
  }
]

const COMPONENT_DECLARATION_EXPORT_ARRAY  = [
    CommitHistoryComponent,
    FileHistoryComponent,
    DashboardComponent,
    HeaderComponent,
    CodeClientSettingsComponent
]

const COMPONENT_DECLARATION_ENTRYPOINT_ARRAY = [
    CommitHistoryFilter,
    CodeClientSettingsWizardComponent,
    CommitHistoryFileChangesDialog,
    CodeClientProfileSettingComponent
]

const UTILITY_DECLATION_EXPORT_ARRAY = [
    MatHeaderProgressComponent,
]

const UTIL_DIRECTIVE_DECLARATION_EXPORT_ARRAY = [
    CopyToClipboard,
    MatSvgIconComponent,
    MatContextMenuComponent
  ];

const UTILITIY_IMPORT_EXPORT_ARRAY = [
    MaterialModule,
    FlexLayoutModule,
    NgxMatSelectSearchModule,
    NgxFileExplorerModule,
    NgxDiffModule,
    NgxElectronUpdaterModule,
    NotifierModule
]

const ANGULAR_CORE_IMPORT_EXPORT_ARRAY = [
    BrowserModule,
    FormsModule,    
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CodeClientRoutingModule
]

@NgModule({
  declarations: [
    COMPONENT_DECLARATION_EXPORT_ARRAY, 
    COMPONENT_DECLARATION_ENTRYPOINT_ARRAY,
    UTILITY_DECLATION_EXPORT_ARRAY,
    UTIL_DIRECTIVE_DECLARATION_EXPORT_ARRAY   
  ],
  imports: [
    ANGULAR_CORE_IMPORT_EXPORT_ARRAY,
    UTILITIY_IMPORT_EXPORT_ARRAY
  ],
  exports: [
    ANGULAR_CORE_IMPORT_EXPORT_ARRAY,
    UTILITIY_IMPORT_EXPORT_ARRAY,
    COMPONENT_DECLARATION_EXPORT_ARRAY, 
    UTILITY_DECLATION_EXPORT_ARRAY,
    UTIL_DIRECTIVE_DECLARATION_EXPORT_ARRAY   
  ],
  providers: [
    HTTP_INTERCEPTOR_PROVIDER_ARRAY,
    MAT_CUSTOM_DATE_FORMAT_PROVIDER
],
  entryComponents: [COMPONENT_DECLARATION_ENTRYPOINT_ARRAY]
})
export class CodeClientModule { }
