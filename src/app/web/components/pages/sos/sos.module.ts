import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared.module';
import { SosComponent } from './sos.component';
import { SosListComponent } from './sos-list/sos-list.component';
import { SosConfigComponent } from './sos-config/sos-config.component';
import { SosShopComponent } from './sos-shop/sos-shop.component';
import { SosRoutingModule } from './sos-routing.module';

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

import { ConfirmationService } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';

@NgModule({
    imports: [
        CommonModule,
        SosRoutingModule,
        SharedModule,
        MultiSelectModule,
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
    ],
    providers: [ConfirmationService],
    declarations: [
        SosComponent,
        SosListComponent,
        SosConfigComponent,
        SosShopComponent,
    ],
})
export class SosModule {}
