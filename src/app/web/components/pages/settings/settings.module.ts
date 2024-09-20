import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared.module';
import { SettingsRoutingModule } from './settings-routing.module';
import { DropdownModule } from 'primeng/dropdown';
import { TimelineModule } from 'primeng/timeline';
import { FormsModule } from '@angular/forms';
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
import { MegaMenuModule } from 'primeng/megamenu';
import { ImageModule } from 'primeng/image';
import { SettingsComponent } from './settings.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { FieldsetModule } from 'primeng/fieldset';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { AceEditorModule } from 'ng2-ace-editor';
import { RadioButtonModule } from 'primeng/radiobutton';

@NgModule({
    imports: [RadioButtonModule,
        CommonModule,
        SettingsRoutingModule,
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
        SharedModule,
        MessagesModule,
        InputMaskModule,
        ListboxModule,
        CalendarModule,
        MegaMenuModule,
        ImageModule,
        ConfirmDialogModule,
        TagModule,
        ToastModule,
        FileUploadModule,
        InputTextareaModule,
        NgxJsonViewerModule,
        AceEditorModule,
        FieldsetModule,
        ScrollPanelModule,
    ],
    declarations: [SettingsComponent],
})
export class SettingsModule { }
