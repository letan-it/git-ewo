import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailPromoComponent } from './detail-promo.component';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { HttpClientModule} from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ImageModule } from 'primeng/image';
import { StyleClassModule } from 'primeng/styleclass';
import { ChipModule } from 'primeng/chip';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { SplitButtonModule } from 'primeng/splitbutton';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
  declarations: [DetailPromoComponent],
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    InputTextModule,
    InputTextareaModule,
    InputTextareaModule,
    ButtonModule,
    AngularEditorModule ,
    HttpClientModule,
    ImageModule,
    StyleClassModule,
    ChipModule,
    TabViewModule,
    TableModule,
    SplitButtonModule,
    DialogModule,
    ToastModule,
    ToolbarModule,
    ConfirmDialogModule,
    CheckboxModule
  ],
  exports:[DetailPromoComponent]
})
export class DetailPromoModule { }
