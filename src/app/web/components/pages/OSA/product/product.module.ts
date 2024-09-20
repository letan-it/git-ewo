import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { ImageModule } from 'primeng/image';
import { SharedModule } from '../../shared.module';
import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ColorPickerModule } from 'primeng/colorpicker';
import { StyleClassModule } from 'primeng/styleclass';
// Import ngx-barcode module
import { NgxBarcodeModule } from 'ngx-barcode';
import { QRCodeModule } from 'angularx-qrcode';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MultiSelectModule } from 'primeng/multiselect';

@NgModule({
    imports: [
        CommonModule,
        ProductRoutingModule,
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
        NgxBarcodeModule,
        QRCodeModule,
        ConfirmDialogModule,
        ToastModule,
        MultiSelectModule
    ],
    declarations: [ProductComponent, ProductDetailsComponent]
})
export class ProductModule { }
