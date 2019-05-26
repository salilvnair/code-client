import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from '../dashboard/dashboard.component';
import { CommitHistoryComponent } from '../client/bitbucket/commit-history/commit-history.component';
import { CodeClientSettingsComponent } from '../settings/codeclient-settings.component';
import { FileHistoryComponent } from '../client/bitbucket/file-history/file-history.component';

const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {
    path: "dashboard",
    component: DashboardComponent
  },  
  {
    path: "commit-history",
    component: CommitHistoryComponent
  },
  {
    path: "file-history",
    component: FileHistoryComponent
  },
  {
    path: "settings",
    component: CodeClientSettingsComponent
  },
  {path: '**', redirectTo: 'dashboard'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class CodeClientRoutingModule {}
