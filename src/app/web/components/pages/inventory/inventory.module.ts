import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared.module';
import { InventoryComponent } from './inventory.component';
import { InventoryConfigComponent } from './inventory-config/inventory-config.component';
import { InventoryReasonComponent } from './inventory-reason/inventory-reason.component';
import { InventoryShopComponent } from './inventory-shop/inventory-shop.component';
import { InventoryRoutingModule } from './inventory-routing.module';

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

import { ConfirmationService } from 'primeng/api';

@NgModule({
    imports: [
        CommonModule,
        InventoryRoutingModule,
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
        ConfirmPopupModule
    ],
    providers: [ConfirmationService],
    declarations: [InventoryComponent, InventoryConfigComponent, InventoryReasonComponent, InventoryShopComponent]
})
export class InventoryModule { }
