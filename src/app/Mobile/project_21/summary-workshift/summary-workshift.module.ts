import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DropdownModule } from 'primeng/dropdown';
import { TimelineModule } from 'primeng/timeline';
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
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AccordionModule } from 'primeng/accordion';
// import { BrowserModule } from '@angular/platform-browser'; 
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { FieldsetModule } from 'primeng/fieldset';
// import { MeterGroupModule } from 'primeng/metergroup';  
import { RippleModule } from 'primeng/ripple';
import { OrganizationChartModule } from 'primeng/organizationchart';

import { SharedModule } from 'src/app/web/components/pages/shared.module';
import { SummaryWorkshiftComponent } from './summary-workshift.component';
import { ReportWorkshiftComponent } from './report-workshift/report-workshift.component';
import { SummaryWorkshiftRoutingModule } from './summary-workshift-routing.module';
import { ReportSummaryByDateComponent } from './report-summary-by-date/report-summary-by-date.component';
 

@NgModule({
    declarations: [SummaryWorkshiftComponent, ReportWorkshiftComponent, ReportSummaryByDateComponent],
    imports: [
        SummaryWorkshiftRoutingModule,FieldsetModule, RippleModule,OrganizationChartModule,
        FormsModule,
        AutoCompleteModule,
        CommonModule,
        SharedModule,
        TableModule,
        RadioButtonModule,
        DropdownModule,
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
        StyleClassModule,
        AccordionModule,
        // BrowserModule,
        // BrowserAnimationsModule
    ]
})
export class SummaryWorkshiftModule { }
