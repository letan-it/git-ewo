import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { TimelineModule } from 'primeng/timeline';
import { FormsModule } from '@angular/forms';
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
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { AccordionModule } from 'primeng/accordion';
import { SkeletonModule } from 'primeng/skeleton';
import { ChipModule } from 'primeng/chip';

import { SharedModule } from 'src/app/web/components/pages/shared.module';
// import { BrowserModule } from '@angular/platform-browser'; 
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { FieldsetModule } from 'primeng/fieldset';
// import { MeterGroupModule } from 'primeng/metergroup';  
import { RippleModule } from 'primeng/ripple';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { SupervisionComponent } from './supervision.component';
import { SupervisionRoutingModule } from './supervision-routing.module';
import { SubordinateListComponent } from './subordinate-list/subordinate-list.component';
import { WorkdayDetailComponent } from './workday-detail/workday-detail.component';
import { MonthlyTimesheetComponent } from './monthly-timesheet/monthly-timesheet.component';
import { EmployeeSelloutListComponent } from './employee-sellout-list/employee-sellout-list.component';
 
@NgModule({
    declarations: [
        SupervisionComponent, 
        SubordinateListComponent, 
        WorkdayDetailComponent, 
        MonthlyTimesheetComponent,
        EmployeeSelloutListComponent
    ],
    imports: [
        SupervisionRoutingModule, FieldsetModule, RippleModule, OrganizationChartModule,
        FormsModule,
        AutoCompleteModule,
        CommonModule,
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
        AvatarModule,
        AvatarGroupModule,
        AccordionModule,
        SkeletonModule,
        ChipModule,
        SharedModule
        // BrowserModule,
        // BrowserAnimationsModule
    ]
})
export class SupervisionModule { }
