import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineModule } from 'primeng/timeline';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';

import { UsersComponent } from './users.component';
import { UsersRoutingModule } from './users-routing.module';
import { FormsModule } from '@angular/forms';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { MessagesModule } from 'primeng/messages';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { InputMaskModule } from 'primeng/inputmask';

import { UserDetailComponent } from './user-detail/user-detail.component';
import { SharedModule } from '../shared.module';
import { ImageModule } from 'primeng/image';
import { ListboxModule } from 'primeng/listbox';
import { CalendarModule } from 'primeng/calendar';
import { SkeletonModule } from 'primeng/skeleton';
import { StyleClassModule } from 'primeng/styleclass';
import { RadioButtonModule } from 'primeng/radiobutton';

@NgModule({
    imports: [
        RadioButtonModule,
        CommonModule,
        TimelineModule,
        ButtonModule,
        CardModule,
        UsersRoutingModule,
        FormsModule,
        TableModule,
        ToolbarModule,
        SplitButtonModule,
        InputTextModule,
        CheckboxModule,
        DropdownModule,
        ConfirmPopupModule,
        PaginatorModule,
        DialogModule,
        SharedModule,
        MessagesModule,
        PasswordModule,
        DividerModule,
        InputMaskModule,
        ImageModule,
        ListboxModule,
        SharedModule,
        CalendarModule,
        SkeletonModule,
        StyleClassModule
    ],
    declarations: [UsersComponent, UserDetailComponent],
})
export class UsersModule { }
