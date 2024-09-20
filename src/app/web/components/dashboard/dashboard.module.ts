import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard.component';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { DashboardsRoutingModule } from './dashboard-routing.module';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SidebarModule } from 'primeng/sidebar';
import { ToolbarModule } from 'primeng/toolbar';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CardModule } from 'primeng/card';
import { PieModule } from './pie/pie.module';
import { SkeletonModule } from 'primeng/skeleton';
import { BarchartModule } from './column/barchart.module';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { BarModule } from './bar/bar.module';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SharedModule } from '../pages/shared.module';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ChartModule,
        MenuModule,
        TableModule,
        StyleClassModule,
        PanelMenuModule,
        ButtonModule,
        DashboardsRoutingModule,
        DropdownModule,
        ProgressSpinnerModule,
        SidebarModule,
        ToolbarModule,
        SharedModule,
        BreadcrumbModule,
        CardModule,
        PieModule,
        SkeletonModule,
        BarchartModule,
        InputTextModule,
        AutoCompleteModule,
        CalendarModule,
        BarModule,
        ToggleButtonModule

    ],
    declarations: [DashboardComponent],
})
export class DashboardModule { }
