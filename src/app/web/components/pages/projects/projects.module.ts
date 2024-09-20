import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineModule } from 'primeng/timeline';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { projectsRoutingModule } from './projects-routing.module';
import { projectsComponent } from './projects.component'; 

@NgModule({
    imports: [
        CommonModule,
        TimelineModule,
        ButtonModule,
        CardModule,
        projectsRoutingModule
    ],
    declarations: [projectsComponent],
})
export class projectsModule {}
