import { NgModule } from "@angular/core";
import {
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatOptionModule,
  MatCardModule,
  MatButtonModule,
  MatIconModule,
  MatRippleModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSidenavModule,
  MatMenuModule,
  MatGridListModule,
  MatToolbarModule,
  MatListModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatDialogModule,
  MatSnackBarModule,
  MatProgressBarModule,
  MatSlideToggleModule,
  MatTabsModule,
  MatCheckboxModule,
  MatBadgeModule,
  MatChipsModule
} from "@angular/material";

const IMPORT_EXPORT_MAT_MODULE_ARRAY = [
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatCardModule,
  MatButtonModule,
  MatIconModule,
  MatRippleModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSidenavModule,
  MatListModule,
  MatToolbarModule,
  MatGridListModule,
  MatMenuModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatDialogModule,
  MatOptionModule,
  MatSnackBarModule,
  MatProgressBarModule,
  MatSlideToggleModule,
  MatTabsModule,
  MatCheckboxModule,
  MatBadgeModule,
  MatChipsModule,
  MatMenuModule
];

@NgModule({
  imports: [IMPORT_EXPORT_MAT_MODULE_ARRAY],
  exports: [IMPORT_EXPORT_MAT_MODULE_ARRAY]
})
export class MaterialModule {}