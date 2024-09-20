import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared.module';
import { OolListComponent } from './ool-list.component';
import { DropdownModule } from 'primeng/dropdown';
import { TimelineModule } from 'primeng/timeline';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { MessagesModule } from 'primeng/messages';
import { InputMaskModule } from 'primeng/inputmask';
import { ListboxModule } from 'primeng/listbox';
import { CalendarModule } from 'primeng/calendar';
import { ImageModule } from 'primeng/image';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TabViewModule } from 'primeng/tabview';
import { StyleClassModule } from 'primeng/styleclass';
import { OolListRoutingModule } from './ool-list-routing.module';
import { OolItemComponent } from './ool-item/ool-item.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AceEditorModule } from 'ng2-ace-editor';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { OolItemAnswersComponent } from './ool-item/ool-item-answers/ool-item-answers.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { ChipsModule } from 'primeng/chips';
@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        SharedModule,
        TableModule,
        RadioButtonModule,
        CommonModule,
        SharedModule,
        DropdownModule,
        CommonModule,
        TimelineModule,
        FormsModule,
        ButtonModule,
        CardModule,
        TableModule,
        ToolbarModule,
        SplitButtonModule,
        InputTextModule,
        CheckboxModule,
        DropdownModule,
        PaginatorModule,
        DialogModule,
        MessagesModule,
        InputMaskModule,
        ListboxModule,
        CalendarModule,
        ImageModule,
        ConfirmPopupModule,
        ToastModule,
        ConfirmDialogModule,
        FileUploadModule,
        OverlayPanelModule,
        TabViewModule,
        StyleClassModule,
        OolListRoutingModule,
        InputTextareaModule,
        AngularEditorModule,
        AceEditorModule,
        NgxJsonViewerModule,
        MultiSelectModule,
        ChipsModule
    ],
    declarations: [OolListComponent, OolItemComponent, OolItemAnswersComponent]

})
export class OolListModule { }
