import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineModule } from 'primeng/timeline';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';

import { ToolbarModule } from 'primeng/toolbar';
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { ComplianceFeedbackComponent } from './compliance-feedback.component';
import { ComplianceFeedbackRoutingModule } from './compliance-feedback-routing.module';
import { StyleClassModule } from 'primeng/styleclass';
@NgModule({
    imports: [
        CommonModule,
        TimelineModule,
        ButtonModule,
        CardModule,
        TableModule,

        DropdownModule,
        ToolbarModule,
        ComplianceFeedbackRoutingModule,
        FormsModule,
        PaginatorModule,
        StyleClassModule
    ],
    declarations: [ComplianceFeedbackComponent],
})
export class ComplianceFeedbackModule { }
