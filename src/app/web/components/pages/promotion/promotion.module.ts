import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromotionRoutingModule } from './promotion-routing.module';
import { PromotionComponent } from './promotion.component';
import { SharedModule } from "../shared.module";
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';

@NgModule({
    declarations: [
        PromotionComponent
    ],
    imports: [
        CommonModule,
        PromotionRoutingModule,
        SharedModule,
        TabViewModule,
        TableModule,
        DropdownModule,
        FormsModule,
        InputTextModule,
        ToolbarModule,
        ToggleButtonModule,
        ButtonModule,
        SplitButtonModule,
        PaginatorModule,
        DialogModule,
        ImageModule
    ]
})
export class PromotionModule { }
