import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { TimelineModule } from 'primeng/timeline';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { MessagesModule } from 'primeng/messages';
import { InputMaskModule } from 'primeng/inputmask';
import { ListboxModule } from 'primeng/listbox';
import { CalendarModule } from 'primeng/calendar';
import { ImageModule } from 'primeng/image';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TabViewModule } from 'primeng/tabview';
import { RadioButtonModule } from 'primeng/radiobutton';
import { StyleClassModule } from 'primeng/styleclass'; 
import { SharedModule } from '../shared.module'; 
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TransactionComponent } from './transaction.component';
import { TransactionRoutingModule } from './transaction-routing.modunle';
import { CreateTransactionComponent } from './create-transaction/create-transaction.component';
import { DataViewModule } from 'primeng/dataview';
import { PanelModule } from 'primeng/panel';
import { SummaryLeaderComponent } from './summary-leader/summary-leader.component';
import { SidebarModule } from 'primeng/sidebar';
import { QRCodeModule } from 'angularx-qrcode';
import { FieldsetModule } from 'primeng/fieldset';
import { TagModule } from 'primeng/tag';
import { ConfirmTransactionComponent } from './confirm-transaction/confirm-transaction.component';
import { TransferItemComponent } from './transfer-item/transfer-item.component';
@NgModule({
    imports: [
        DataViewModule,SidebarModule,QRCodeModule,FieldsetModule,TagModule,
        PanelModule,
        TransactionRoutingModule,
        FormsModule,
        AutoCompleteModule,
        CommonModule,
        SharedModule,
        TableModule,
        RadioButtonModule,
        CommonModule,
        SharedModule,
        DropdownModule,
        CommonModule,
        TimelineModule,
        ButtonModule,
        CardModule,
        TableModule,
        ToolbarModule,
        SplitButtonModule,
        InputTextModule,
        CheckboxModule,
        DropdownModule,
        PaginatorModule,
        DialogModule,
        MessagesModule,
        InputMaskModule,
        ListboxModule,
        CalendarModule,
        ImageModule,
        ConfirmPopupModule,
        ToastModule,
        ConfirmDialogModule,
        FileUploadModule,
        OverlayPanelModule,
        TabViewModule,
        StyleClassModule
    ],
    declarations: [TransactionComponent,CreateTransactionComponent,SummaryLeaderComponent,ConfirmTransactionComponent,TransferItemComponent]
})
export class TransactionModule { }
