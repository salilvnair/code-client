
import { NgModule } from '@angular/core';
import { NgpaRepositoryModule } from '@salilvnair/ngpa';
import { AppComponent } from './app.component';
import { CodeClientModule } from './modules/codeclient.module';

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
