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
import { CalendarModule } from 'primeng/calendar';
import { ImageModule } from 'primeng/image';
import { GroupProductRoutingModule } from './group-product-routing.module';
import { GroupProductComponent } from './group-product.component';
import { SharedModule } from '../../../shared.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { StyleClassModule } from 'primeng/styleclass';
import { ConfirmationService } from 'primeng/api';

@NgModule({
    imports: [
        CommonModule,
        GroupProductRoutingModule,
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
        CalendarModule,
        ImageModule,
        ConfirmDialogModule,
        ToastModule,
        ColorPickerModule,
        ConfirmPopupModule,
        StyleClassModule
    ],
    providers: [ConfirmationService],
    declarations: [GroupProductComponent]
})
export class GroupProductModule { }
