import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardASOComponent } from './dashboard-aso.component';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { DashboardsNemoRoutingModule } from './dashboard-aso-routing.module';
import { DropdownModule } from 'primeng/dropdown';
import { AvatarModule } from 'primeng/avatar';
import { ListboxModule } from 'primeng/listbox';
import { CalendarModule } from 'primeng/calendar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CheckboxModule } from 'primeng/checkbox'; 
import { ToolbarModule } from 'primeng/toolbar'; 

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
        DashboardsNemoRoutingModule,
        DropdownModule,
        AvatarModule,
        ListboxModule,
        CalendarModule,
        SelectButtonModule,
        CheckboxModule,
        ToolbarModule
    ],
    declarations: [DashboardASOComponent],
})
export class DashboardASOModule {}
