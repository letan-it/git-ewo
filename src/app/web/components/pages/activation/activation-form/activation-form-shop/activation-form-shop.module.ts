import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared.module';
import { ActivationFormShopComponent } from './activation-form-shop.component';
import { ActivationFormShopRoutingModule } from './activation-form-shop-routing.module';


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
        FormsModule, TabViewModule, DropdownModule, InputTextModule, ToggleButtonModule, ToolbarModule,
        ButtonModule, SplitButtonModule, PaginatorModule, DialogModule, ImageModule, TagModule,
        CommonModule,
        ActivationFormShopRoutingModule,
        SharedModule,
        TableModule,
        RadioButtonModule
    ],
    declarations: [ActivationFormShopComponent]
})
export class ActivationFormShopModule { }
