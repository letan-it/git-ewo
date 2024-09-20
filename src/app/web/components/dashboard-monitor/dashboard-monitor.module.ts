import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { DashboardMonitorComponent } from './dashboard-monitor.component';
// import { DashboardsRoutingModule } from '../dashboard/dashboard-routing.module';
import { DashboardMonitorRoutingModule } from './dashboard-monitor.routing.module';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';

@NgModule({
    imports: [
        FormsModule,
        DashboardMonitorRoutingModule,
        CommonModule,
        SkeletonModule,
        ButtonModule,
    ],
    declarations: [
        DashboardMonitorComponent
    ],
})
export class DashboardMonitorModule { }
