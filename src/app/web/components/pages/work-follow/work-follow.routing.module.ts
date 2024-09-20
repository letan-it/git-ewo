import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WorkFollowComponent } from './work-follow.component';
import { TaskListComponent } from './task-list/task-list.component';
 

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: WorkFollowComponent },
        { path: 'task-list', component: TaskListComponent }
    ])],
    exports: [RouterModule]
})
export class WorkFollowRoutingModule { }
