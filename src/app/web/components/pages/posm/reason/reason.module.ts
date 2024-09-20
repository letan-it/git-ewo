import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReasonRoutingModule } from './reason-routing.module'; 
import { SharedModule } from '../../shared.module';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { MessagesModule } from 'primeng/messages';
import { ImageModule } from 'primeng/image';
import { FileUploadModule } from 'primeng/fileupload'; 
import { ReasonComponent } from './reason.component';
import { ReasonDetailsComponent } from './reason-details/reason-details.component';

@NgModule({
    imports: [
        CommonModule,
        ReasonRoutingModule,
        SharedModule,
        TableModule,
        FormsModule,
        ToolbarModule,
        SplitButtonModule,
        InputTextModule,
        CheckboxModule,
        DropdownModule,
        PaginatorModule,
        DialogModule,
        MessagesModule,
        ImageModule,
        FileUploadModule
    ],
    declarations: [ReasonComponent,ReasonDetailsComponent]
})
export class ReasonModule { }
