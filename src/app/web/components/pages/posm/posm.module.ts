import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PosmRoutingModule } from './posm-routing.module';
import { PosmComponent } from './posm.component';
import { SharedModule } from '../shared.module';
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
import { PosmDetailsComponent } from './posm-details/posm-details.component';

@NgModule({
    imports: [
        CommonModule,
        PosmRoutingModule,
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
    declarations: [PosmComponent,PosmDetailsComponent]
})
export class PosmModule { }
