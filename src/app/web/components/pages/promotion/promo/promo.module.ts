import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromoRoutingModule } from './promo-routing.module';
import { PromoComponent } from './promo.component';
import { SharedModule } from "../../shared.module";
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DropdownModule } from 'primeng/dropdown';
import { MessagesModule } from 'primeng/messages';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CreatePromoModule } from '../create-promo/create-promo.module';
import { DetailPromoModule } from '../detail-promo/detail-promo.module';
import { ImageModule } from 'primeng/image';
import { StyleClassModule } from 'primeng/styleclass';


@NgModule({
    declarations: [PromoComponent],
    imports: [
        CommonModule,
        PromoRoutingModule,
        SharedModule,
        FormsModule,
        InputTextModule,
        ToolbarModule,
        ButtonModule,
        ToggleButtonModule,
        DropdownModule,
        MessagesModule,
        PaginatorModule,
        TableModule,
        DialogModule,
        CreatePromoModule,
        DetailPromoModule,
        ImageModule,
        StyleClassModule
    ]
})
export class PromoModule { }
