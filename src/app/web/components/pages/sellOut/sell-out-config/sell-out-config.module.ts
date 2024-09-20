import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { SellOutConfigComponent } from './sell-out-config.component';
import { SellOutConfigRoutingModule } from './sell-out-config-routing.module';

import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { SplitButtonModule } from 'primeng/splitbutton';
import { CheckboxModule } from 'primeng/checkbox';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FileUploadModule } from 'primeng/fileupload';
import { StyleClassModule } from 'primeng/styleclass';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { TagModule } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';

import { ConfirmationService } from 'primeng/api';

@NgModule({
    imports: [
        CommonModule,
        SellOutConfigRoutingModule,
        SharedModule,

        TableModule,
        DropdownModule,
        ToolbarModule,
        InputTextModule,
        SplitButtonModule,
        CheckboxModule,
        PaginatorModule,
        DialogModule,
        ConfirmDialogModule,
        ToastModule,
        SelectButtonModule,
        FileUploadModule,
        StyleClassModule,
        ConfirmPopupModule,
        TagModule,
        MultiSelectModule
    ],
    providers: [ConfirmationService],
    declarations: [SellOutConfigComponent]
})
export class SellOutConfigModule { }
