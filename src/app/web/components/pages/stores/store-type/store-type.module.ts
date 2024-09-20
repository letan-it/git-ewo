import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypeComponent } from './store-type.component';
import { RouterRoutingModule } from '../store-router/store-router-routing.module';
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
import { TypeRoutingModule } from './store-type-routing.module';
import { StoreTypeDetailComponent } from './store-type-detail/store-type-detail.component';
import { SharedModule } from '../../shared.module';

@NgModule({
    imports: [
        CommonModule,
        TypeRoutingModule,
        CommonModule,
        RouterRoutingModule,
        TableModule,
        CheckboxModule,
        FormsModule,
        ToolbarModule,
        SplitButtonModule,
        InputTextModule,
        DropdownModule,
        PaginatorModule,
        DialogModule,
        MessagesModule,
        SharedModule,
    ],
    declarations: [TypeComponent, StoreTypeDetailComponent],
})
export class TypeModule {}
