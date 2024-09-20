import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterRoutingModule } from '../store-router/store-router-routing.module';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { MessagesModule } from 'primeng/messages';
import { SupplierRoutingModule } from './store-supplier-routing.module';
import { StoreSupplierComponent } from './store-supplier.component';
import { SharedModule } from '../../shared.module';

@NgModule({
    imports: [
        CommonModule,
        SupplierRoutingModule,
        CommonModule,
        RouterRoutingModule,
        TableModule,
        CheckboxModule,
        FormsModule,
        ToolbarModule,
        SplitButtonModule,
        InputTextModule,
        DropdownModule,
        PaginatorModule,
        DialogModule,
        MessagesModule,
        SharedModule,
    ],
    declarations: [],
})
export class SupplierModule {}
