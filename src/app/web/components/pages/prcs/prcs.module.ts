import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared.module';
import { PrcsComponent } from './prcs.component';
import { PrcsConfigComponent } from './prcs-config/prcs-config.component';
import { PrcsDetailComponent } from './prcs-config/prcs-detail/prcs-detail.component';
import { PrcsRequestComponent } from './prcs-request/prcs-request.component';
import { PrcsRoutingModule } from './prcs-routing.module';

import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ToastModule } from 'primeng/toast';
import { StyleClassModule } from 'primeng/styleclass';
import { StepsModule } from 'primeng/steps';
import { TimelineModule } from 'primeng/timeline';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmationService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { AddPlanComponent } from './prcs-create/add-plan/add-plan.component';
import { AccordionModule } from 'primeng/accordion';
import { CalendarModule } from 'primeng/calendar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TagModule } from 'primeng/tag';
import { TabViewModule } from 'primeng/tabview';
import { AceEditorModule } from 'ng2-ace-editor';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { GalleriaModule } from 'primeng/galleria';
import { MultiSelectModule } from 'primeng/multiselect';
import { ImageModule } from 'primeng/image';
import { CarouselModule } from 'primeng/carousel';
import { BadgeModule } from 'primeng/badge';
import { SplitterModule } from 'primeng/splitter';
//
import { WorkingPlanComponent } from './prcs-request/working-plan/working-plan.component';
import { AddLeaveComponent } from './prcs-create/add-leave/add-leave.component';
import { AddOTComponent } from './prcs-create/add-ot/add-ot.component';
import { RemovePlanComponent } from './prcs-create/remove-plan/remove-plan.component';
import { EditWorkComponent } from './prcs-create/edit-work/edit-work.component';
import { ExplainWorkComponent } from './prcs-create/explain-work/explain-work.component';
import { NotificationTemplateComponent } from './prcs-config/notification-template/notification-template.component';
import { NoteListComponent } from './prcs-config/note-list/note-list.component';
import { ControlProcessListComponent } from '../../control/control-process-list/control-process-list.component';
import { AddPlanItemComponent } from './prcs-create/add-plan/add-plan-item/add-plan-item.component';
import { ExplanationComponent } from './prcs-request/explanation/explanation.component';
import { LayoutTemplateComponent } from './prcs-config/layout-template/layout-template.component';
import { AddResultPlanComponent } from './prcs-create/add-result-plan/add-result-plan.component';
import { EmpployeeLeaveComponent } from './prcs-config/employee-leave/employee-leave.component';
import { ListLeaveComponent } from './prcs-config/list-leave/list-leave.component';
// import { RemovePlanItemComponent } from './prcs-create/remove-plan/remove-plan-item/remove-plan-item.component';

@NgModule({
    imports: [
        CommonModule,
        PrcsRoutingModule,
        SharedModule,
        CalendarModule,
        TableModule,
        ToolbarModule,
        InputTextModule,
        PaginatorModule,
        DialogModule,
        ConfirmDialogModule,
        KeyFilterModule,
        ToastModule,
        StyleClassModule,
        StepsModule,
        TimelineModule,
        CheckboxModule,
        CardModule,
        AccordionModule,
        OverlayPanelModule,
        DropdownModule,
        ConfirmPopupModule,
        SplitButtonModule,
        TagModule,
        TabViewModule,
        AceEditorModule,
        NgxJsonViewerModule,
        GalleriaModule,
        MultiSelectModule,
        ImageModule,
        CarouselModule,
        BadgeModule,
        SplitterModule,
    ],
    providers: [ConfirmationService],
    declarations: [
        PrcsComponent,
        PrcsConfigComponent,
        PrcsDetailComponent,
        PrcsRequestComponent,
        // Plan
        AddPlanComponent,
        AddPlanItemComponent,
        WorkingPlanComponent,
        // Leave
        AddLeaveComponent,
        // OT
        AddOTComponent,
        // Add result plan
        AddResultPlanComponent,
        // Remove Plan
        RemovePlanComponent,
        // Edit Work
        EditWorkComponent,
        // Explain Work
        ExplainWorkComponent,
        ExplanationComponent,

        NotificationTemplateComponent,
        NoteListComponent,
        LayoutTemplateComponent,

        EmpployeeLeaveComponent,
        ListLeaveComponent,
    ],
})
export class PrcsModule {}
