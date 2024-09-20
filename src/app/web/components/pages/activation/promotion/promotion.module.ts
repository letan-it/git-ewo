import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { PromotionComponent } from './promotion.component';
import { PromotionRoutingModule } from './promotion-routing.module';

import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DropdownModule } from 'primeng/dropdown';
import { MessagesModule } from 'primeng/messages';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { StyleClassModule } from 'primeng/styleclass';
import { PromotionDetailsComponent } from './promotion-details/promotion-details.component';
import { PromotionCreateComponent } from './promotion-create/promotion-create.component';
import { SharedModule } from '../../shared.module';


import { InputTextareaModule } from 'primeng/inputtextarea';
import { HttpClientModule } from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ChipModule } from 'primeng/chip';
import { TabViewModule } from 'primeng/tabview';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CalendarModule } from 'primeng/calendar';
import { TagModule } from 'primeng/tag';
import { PickListModule } from 'primeng/picklist';

@NgModule({
    imports: [
        FormsModule, CalendarModule, TagModule, PickListModule,
        CommonModule,
        PromotionRoutingModule,
        TableModule,
        RadioButtonModule,
        InputTextModule,
        ToolbarModule, ButtonModule, ToggleButtonModule, DropdownModule, MessagesModule,
        PaginatorModule, DialogModule, ImageModule, StyleClassModule,
        SharedModule,
        InputTextModule, InputTextareaModule, HttpClientModule,
        AngularEditorModule, ChipModule, TabViewModule, SplitButtonModule, ToastModule, ConfirmDialogModule,

    ],
    declarations: [PromotionComponent, PromotionDetailsComponent, PromotionCreateComponent]
})
export class PromotionModule { }
