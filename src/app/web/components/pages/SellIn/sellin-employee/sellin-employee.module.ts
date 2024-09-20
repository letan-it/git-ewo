import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { SellinEmployeeRoutingModule } from './sellin-employee-routing.module';
import { SharedModule } from '../../shared.module';
import { SellinEmployeeComponent } from './sellin-employee.component';

import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { StyleClassModule } from 'primeng/styleclass';
import { TooltipModule } from 'primeng/tooltip';
import { TabViewModule } from 'primeng/tabview';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { PaginatorModule } from 'primeng/paginator';
import { ImageModule } from 'primeng/image';
@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        SellinEmployeeRoutingModule,
        SharedModule,
        TableModule,
        RadioButtonModule,
        DropdownModule,
        ToastModule,
        ToolbarModule,
        TagModule,
        DialogModule,
        ConfirmDialogModule,
        StyleClassModule,
        TooltipModule,
        TabViewModule,
        InputTextModule,
        ToggleButtonModule,
        ButtonModule,
        SplitButtonModule,
        PaginatorModule,
        ImageModule
    ],
    declarations: [SellinEmployeeComponent]
})
export class SellinEmployeeModule { }
