import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterStatusComponent } from './master-status.component';
import { SharedModule } from '../shared.module';
import { MasterStatusRoutingModule } from './master-status-routing.module';

import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ToastModule } from 'primeng/toast';
import { StyleClassModule } from 'primeng/styleclass';

import { ConfirmationService } from 'primeng/api';

@NgModule({
    imports: [
        CommonModule,
        MasterStatusRoutingModule,
        SharedModule,

        TableModule,
        ToolbarModule,
        InputTextModule,
        PaginatorModule,
        DialogModule,
        ConfirmDialogModule,
        KeyFilterModule,
        ToastModule,
        StyleClassModule   
    ],
    providers: [ConfirmationService],
    declarations: [MasterStatusComponent]
})
export class MasterStatusModule { }
