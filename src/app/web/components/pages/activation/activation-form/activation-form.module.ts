import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared.module';
import { ActivationFormComponent } from './activation-form.component';
import { ActivationFormRoutingModule } from './activation-form-routing.module';



import { InputTextareaModule } from 'primeng/inputtextarea';
import { HttpClientModule } from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ChipModule } from 'primeng/chip';
import { TabViewModule } from 'primeng/tabview';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CalendarModule } from 'primeng/calendar';
import { TagModule } from 'primeng/tag';
import { PickListModule } from 'primeng/picklist';

import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DropdownModule } from 'primeng/dropdown';
import { MessagesModule } from 'primeng/messages';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { StyleClassModule } from 'primeng/styleclass';
import { ActivationFormDetailsComponent } from './activation-form-details/activation-form-details.component';
import { ActivationFormCreateComponent } from './activation-form-create/activation-form-create.component';


import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { InputMaskModule } from 'primeng/inputmask';
import { ListboxModule } from 'primeng/listbox';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { MultiSelectModule } from 'primeng/multiselect';
import { AceEditorModule } from 'ng2-ace-editor';

@NgModule({
    imports: [
        TimelineModule, CardModule, CheckboxModule, InputMaskModule, ListboxModule, NgxJsonViewerModule,
        ConfirmPopupModule, MultiSelectModule, AceEditorModule,
        FormsModule,
        CommonModule,
        ActivationFormRoutingModule,
        SharedModule,
        TableModule,
        RadioButtonModule,
        InputTextareaModule, HttpClientModule, AngularEditorModule, ChipModule, TabViewModule, SplitButtonModule, ToastModule,
        ConfirmDialogModule, CalendarModule, TagModule, PickListModule,
        InputTextModule, ToastModule, ToolbarModule, ButtonModule, ToggleButtonModule, DropdownModule,
        MessagesModule, PaginatorModule, DialogModule, ImageModule, StyleClassModule
    ],
    declarations: [
        ActivationFormComponent,
        ActivationFormDetailsComponent,
        ActivationFormCreateComponent,
    ]
})
export class ActivationFormModule { }
