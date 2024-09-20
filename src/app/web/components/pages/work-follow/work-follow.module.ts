import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineModule } from 'primeng/timeline';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { WorkFollowComponent } from './work-follow.component';
import { WorkFollowRoutingModule } from './work-follow.routing.module';
import { TaskListComponent } from './task-list/task-list.component';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TaskStatusComponent } from './control/task-status/task-status.component';
import { ToastModule } from 'primeng/toast';
import { MultiSelectModule } from 'primeng/multiselect';
import { EmployeeTaskComponent } from './control/employee-task/employee-task.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DialogModule } from 'primeng/dialog';
import { TaskItemComponent } from './task-list/task-item/task-item.component';
import { EditorModule } from 'primeng/editor';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ListboxModule } from 'primeng/listbox';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { CalendarModule } from 'primeng/calendar';
import { TaskDetailComponent } from './task-list/task-detail/task-detail.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { BadgeModule } from 'primeng/badge';

@NgModule({
    imports: [
        CommonModule, InputNumberModule, BadgeModule,
        TimelineModule,
        ButtonModule,
        InputTextModule,
        FormsModule,
        CardModule,
        WorkFollowRoutingModule,
        CheckboxModule,
        AvatarModule,
        MenuModule,
        AvatarGroupModule,
        TagModule,
        ChipModule,
        DropdownModule,
        ToastModule,
        MultiSelectModule,
        OverlayPanelModule,
        DialogModule,
        EditorModule,
        AngularEditorModule,
        ListboxModule,
        DynamicDialogModule,
        CalendarModule
    ],
    declarations: [WorkFollowComponent, TaskListComponent,
        TaskStatusComponent, EmployeeTaskComponent, TaskItemComponent, TaskDetailComponent
    ]
})
export class WorkFollowModule { }
