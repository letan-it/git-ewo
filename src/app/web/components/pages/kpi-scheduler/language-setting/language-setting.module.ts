import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { TimelineModule } from 'primeng/timeline';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
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
import { RadioButtonModule } from 'primeng/radiobutton';
import { StyleClassModule } from 'primeng/styleclass';
import { LanguageSettingComponent } from './language-setting.component';
import { SharedModule } from '../shared.module';
import { LanguageSettingRoutingModule } from './lanuage-setting-routing.module';
import { AutoCompleteModule } from 'primeng/autocomplete';
@NgModule({
    imports: [
        LanguageSettingRoutingModule,
        FormsModule,
        AutoCompleteModule,
        CommonModule,
        SharedModule,
        TableModule,
        RadioButtonModule,
        CommonModule,
        SharedModule,
        DropdownModule,
        CommonModule,
        TimelineModule,
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
        StyleClassModule
    ],
    declarations: [LanguageSettingComponent]
})
export class LanguageSettingModule { }
