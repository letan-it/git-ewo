import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineModule } from 'primeng/timeline';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { attendancesRoutingModule } from './attendances-routing.module';
import { attendancesComponent } from './attendances.component';

@NgModule({
    imports: [
        CommonModule,
        TimelineModule,
        ButtonModule,
        CardModule,
        attendancesRoutingModule,
    ],
    declarations: [attendancesComponent],
})
export class attendancesModule {}
