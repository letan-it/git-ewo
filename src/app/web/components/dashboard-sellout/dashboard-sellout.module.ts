import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../pages/shared.module';
import { DashboardSelloutComponent } from './dashboard-sellout.component';
import { DashboardSelloutRoutingModule } from './dashboard-sellout-routing.module';

import { ChartModule } from 'primeng/chart';
import { HighchartsChartModule } from 'highcharts-angular';

import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SidebarModule } from 'primeng/sidebar';
import { ToolbarModule } from 'primeng/toolbar';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MessagesModule } from 'primeng/messages';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';

import { ProgressBarModule } from 'primeng/progressbar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';

@NgModule({
    imports: [
        FormsModule, TabViewModule,
        CommonModule,
        DashboardSelloutRoutingModule,
        SharedModule,
        TableModule,
        RadioButtonModule,
        CommonModule,
        FormsModule,
        MenuModule,
        TableModule,
        StyleClassModule,
        PanelMenuModule,
        ButtonModule,
        DropdownModule,
        ProgressSpinnerModule,
        SidebarModule,
        ToolbarModule,
        SharedModule,
        BreadcrumbModule,
        CardModule,
        SkeletonModule,
        InputTextModule,
        AutoCompleteModule,
        CalendarModule,
        ToggleButtonModule,
        ChartModule,
        HighchartsChartModule,
        MessagesModule,
        ConfirmDialogModule,
        MultiSelectModule,
        InputMaskModule,
        InputNumberModule,
        ToastModule,
        ProgressBarModule,
        OverlayPanelModule,
        DialogModule
    ],
    declarations: [DashboardSelloutComponent]
})
export class DashboardSelloutModule { }
