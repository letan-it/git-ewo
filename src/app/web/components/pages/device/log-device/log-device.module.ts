import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { LogDeviceComponent } from './log-device.component';
import { SharedModule } from '../../shared.module';
import { LogDeviceRoutingModule } from './log-device-routing.module';

import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { StyleClassModule } from 'primeng/styleclass';
import { SplitButtonModule } from 'primeng/splitbutton';

@NgModule({
    imports: [
        CommonModule,
        LogDeviceRoutingModule,
        SharedModule,

        TableModule,
        DropdownModule,
        ButtonModule,
        ToolbarModule,
        InputTextModule,
        PaginatorModule,
        ConfirmDialogModule,
        ToastModule,   
        CalendarModule,
        StyleClassModule,
        SplitButtonModule
    ],
    declarations: [LogDeviceComponent]
})
export class LogDeviceModule { }
