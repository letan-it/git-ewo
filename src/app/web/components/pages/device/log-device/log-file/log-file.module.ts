import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogFileComponent } from './log-file.component';
import { SharedModule } from '../../../shared.module';
import { LogFileRoutingModule } from './log-file-routing.module';

import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { PaginatorModule } from 'primeng/paginator';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { StyleClassModule } from 'primeng/styleclass';

@NgModule({
    imports: [
        CommonModule,
        LogFileRoutingModule,
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
        StyleClassModule
    ],
    declarations: [LogFileComponent]
})
export class LogFileModule { }
