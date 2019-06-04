
import { NgModule } from '@angular/core';
import { NgpaRepositoryModule } from '@salilvnair/ngpa';
import { AppComponent } from './app.component';
import { CodeClientModule } from './modules/codeclient.module';
import { BrowseFilesComponent } from './client/bitbucket/browse-files/browse-files.component';
import { NgxFileExplorerModule } from '@salilvnair/ngx-file-explorer';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CodeClientModule,
    NgpaRepositoryModule.configure(
      { 
        applicationName:'codeclient',
        createExplicitDB:true,
        inMemoryDB:false,
        storeInUserHome:true
      }
    )
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
