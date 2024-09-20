import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterRoutingModule } from './store-router-routing.module';
import { RouterComponent } from './store-router.component';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { StoreRouterDetailComponent } from './store-router-detail/store-router-detail.component';
import { MessagesModule } from 'primeng/messages';
import { SharedModule } from '../../shared.module';

@NgModule({
    imports: [
        CommonModule,
        RouterRoutingModule,
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
        SharedModule,
    ],
    declarations: [RouterComponent, StoreRouterDetailComponent],
})
export class RouterModule {}
