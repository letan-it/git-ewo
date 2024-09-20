import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { PromotionShopComponent } from './promotion-shop.component';
import { SharedModule } from '../../../shared.module';
import { PromotionShopRoutingModule } from './promotion-shop-routing.module';

import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { TagModule } from 'primeng/tag';
@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        PromotionShopRoutingModule,
        SharedModule,
        TableModule,
        RadioButtonModule,
        TabViewModule, DropdownModule, InputTextModule, ToolbarModule, ToggleButtonModule, ButtonModule,
        SplitButtonModule, PaginatorModule, DialogModule, ImageModule, TagModule,
    ],
    declarations: [PromotionShopComponent]
})
export class PromotionShopModule { }
