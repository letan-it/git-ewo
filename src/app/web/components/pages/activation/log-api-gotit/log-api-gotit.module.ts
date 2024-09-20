import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared.module';
import { LogApiGotitComponent } from './log-api-gotit.component';
import { LogApiGotitRoutingModule } from './log-api-gotit-routing.module';

import { InputTextareaModule } from 'primeng/inputtextarea';
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
// Import ngx-barcode module
import { NgxBarcodeModule } from 'ngx-barcode';
import { QRCodeModule } from 'angularx-qrcode';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { DetailLogApiComponent } from './detail-log-api/detail-log-api.component';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        LogApiGotitRoutingModule,
        SharedModule,
        TableModule,
        RadioButtonModule,
        CommonModule,
        SharedModule,
        InputTextareaModule,
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
        NgxBarcodeModule,
        QRCodeModule,
        ConfirmDialogModule,
        ToastModule,
        TagModule,
        RatingModule
    ],
    providers: [ConfirmationService],
    declarations: [LogApiGotitComponent, DetailLogApiComponent]
})
export class LogApiGotitModule { }
