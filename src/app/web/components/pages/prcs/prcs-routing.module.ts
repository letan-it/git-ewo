import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PrcsComponent } from './prcs.component';
import { PrcsConfigComponent } from './prcs-config/prcs-config.component';
import { PrcsRequestComponent } from './prcs-request/prcs-request.component';
import { AddPlanComponent } from './prcs-create/add-plan/add-plan.component';
import { AddLeaveComponent } from './prcs-create/add-leave/add-leave.component';
import { AddOTComponent } from './prcs-create/add-ot/add-ot.component';
import { RemovePlanComponent } from './prcs-create/remove-plan/remove-plan.component';
import { ExplainWorkComponent } from './prcs-create/explain-work/explain-work.component';
import { EditWorkComponent } from './prcs-create/edit-work/edit-work.component';
import { NotificationTemplateComponent } from './prcs-config/notification-template/notification-template.component';
import { NoteListComponent } from './prcs-config/note-list/note-list.component';
import { LayoutTemplateComponent } from './prcs-config/layout-template/layout-template.component';
import { AddResultPlanComponent } from './prcs-create/add-result-plan/add-result-plan.component';
import { EmpployeeLeaveComponent } from './prcs-config/employee-leave/employee-leave.component';
import { ListLeaveComponent } from './prcs-config/list-leave/list-leave.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: PrcsComponent },
            { path: 'config', component: PrcsConfigComponent },
            { path: 'request', component: PrcsRequestComponent },
            { path: 'request-add-plan', component: AddPlanComponent },
            { path: 'request-add-leave', component: AddLeaveComponent },
            { path: 'request-add-OT', component: AddOTComponent },
            {
                path: 'request-add-result-plan',
                component: AddResultPlanComponent,
            },
            { path: 'request-remove-plan', component: RemovePlanComponent },
            { path: 'request-explain-work', component: ExplainWorkComponent },
            { path: 'request-edit-work', component: EditWorkComponent },

            {
                path: 'notification-template',
                component: NotificationTemplateComponent,
            },
            { path: 'note-list', component: NoteListComponent },
            { path: 'layout-template', component: LayoutTemplateComponent },
            { path: 'emp-leave', component: EmpployeeLeaveComponent },
            { path: 'list-leave', component: ListLeaveComponent },
        ]),
    ],
    exports: [RouterModule],
})
export class PrcsRoutingModule {}
