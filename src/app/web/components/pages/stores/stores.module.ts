import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineModule } from 'primeng/timeline';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { StoresRoutingModule } from './stores-routing.module';
import { StoresComponent } from './stores.component';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { StoreDetailComponent } from './store-detail/store-detail.component';

import { MessagesModule } from 'primeng/messages';
import { SharedModule } from '../shared.module';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ImageModule } from 'primeng/image';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ListboxModule } from 'primeng/listbox';
import { StoreProjectDetailComponent } from './store-detail/store-project-detail/store-project-detail.component';
import { SkeletonModule } from 'primeng/skeleton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { StoreSupplierComponent } from './store-supplier/store-supplier.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { StyleClassModule } from 'primeng/styleclass';

@NgModule({
    imports: [
        CommonModule,
        TimelineModule,
        FormsModule,
        ButtonModule,
        CardModule,
        StoresRoutingModule,
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
        FileUploadModule,
        ToastModule,
        ImageModule,
        ConfirmPopupModule,
        ListboxModule,
        SkeletonModule,
        ConfirmDialogModule,
        TagModule,
        BreadcrumbModule,
        StyleClassModule
    ],
    declarations: [
        StoresComponent,
        StoreDetailComponent,
        StoreProjectDetailComponent,
        StoreSupplierComponent,
    ],
})
export class StoresModule { }
