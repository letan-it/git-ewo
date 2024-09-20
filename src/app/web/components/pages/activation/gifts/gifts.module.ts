import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared.module';
import { GiftsComponent } from './gifts.component';
import { GiftsRoutingModule } from './gifts-routing.module';


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
import { ColorPickerModule } from 'primeng/colorpicker';
import { StyleClassModule } from 'primeng/styleclass';
import { AceEditorModule } from 'ng2-ace-editor';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
// Import ngx-barcode module
import { NgxBarcodeModule } from 'ngx-barcode';
import { QRCodeModule } from 'angularx-qrcode';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        GiftsRoutingModule,
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
        ColorPickerModule,
        StyleClassModule,
        AceEditorModule,
        NgxJsonViewerModule,
        NgxBarcodeModule,
        QRCodeModule,
        ConfirmDialogModule,
        ToastModule,
        TagModule,
        RatingModule
    ],
    declarations: [GiftsComponent]
})
export class GiftsModule { }
