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
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SidebarModule } from 'primeng/sidebar';
import { TabMenuModule } from 'primeng/tabmenu';
import { RippleModule } from 'primeng/ripple';
import { PanelModule } from 'primeng/panel';

import { SharedModule } from 'src/app/web/components/pages/shared.module';
import { DashboardReportRoutingModule } from './dashboard-report-routing.module';
import { DashboardReportComponent } from './dashboard-report.component';
import { EmployeesReportComponent } from './employees-report/employees-report.component';
import { SelloutReportComponent } from './sellout-report/sellout-report.component';

import { DetailInfoComponent } from './detail-info/detail-info.component';
import { EditProfileComponent } from './detail-info/edit-profile/edit-profile.component';
import { PasswordComponent } from './detail-info/password/password.component';
import { DeviceInfoComponent } from './detail-info/device-info/device-info.component';
import { ManagerComponent } from './detail-info/manager/manager.component';
import { AttendanceReportComponent } from './attendance-report/attendance-report.component';
import { EmployeeWorkingComponent } from './attendance-report/employee-working/employee-working.component';
import { EmployeeQuitComponent } from './attendance-report/employee-quit/employee-quit.component';
import { ContactComponent } from './contact/contact.component';
 
@NgModule({
    declarations: [
        DashboardReportComponent,
        EmployeesReportComponent,
        AttendanceReportComponent,
        SelloutReportComponent,
        EmployeeWorkingComponent,
        EmployeeQuitComponent,
        ContactComponent,

        DetailInfoComponent,
        EditProfileComponent,
        PasswordComponent,
        DeviceInfoComponent,
        ManagerComponent
    ],
    imports: [
        DashboardReportRoutingModule,

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
        ScrollPanelModule,
        SidebarModule,
        TabMenuModule,
        RippleModule,
        PanelModule,

        SharedModule
    ]
})
export class DashboardReportModule { }
