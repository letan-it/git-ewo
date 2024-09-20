import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyDemoRoutingModule } from './emptydemo-routing.module';
import { EmptyDemoComponent } from './emptydemo.component';
import { SharedModule } from '../shared.module';
import { TableModule } from 'primeng/table';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
@NgModule({
    imports: [
        FormsModule,
        TagModule,
        CommonModule,
        EmptyDemoRoutingModule,
        SharedModule,
        TableModule,
        RadioButtonModule
    ],
    declarations: [EmptyDemoComponent]
})
export class EmptyDemoModule { }
