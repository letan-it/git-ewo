import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { SellOutEmployeeComponent } from './sell-out-employee.component';
import { SharedModule } from '../../shared.module';
import { SellOutEmployeeRoutingModule } from './sell-out-employee-routing.module';
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
        SellOutEmployeeRoutingModule,
        SharedModule,
        TableModule,
        RadioButtonModule,
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
    declarations: [SellOutEmployeeComponent]
})
export class SellOutEmployeeModule { }
