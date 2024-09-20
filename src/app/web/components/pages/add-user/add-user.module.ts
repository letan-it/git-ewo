import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineModule } from 'primeng/timeline';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AddUserComponent } from './add-user.component';
import { AddUserRoutingModule } from './add-user-routing.module';
import { FormsModule } from '@angular/forms';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { ImageModule } from 'primeng/image';
import { FileUploadModule } from 'primeng/fileupload';
import { AvatarModule } from 'primeng/avatar';
import { ToastModule } from 'primeng/toast';
import { PasswordModule } from 'primeng/password';
import { StyleClassModule } from 'primeng/styleclass';
import { SplitButtonModule } from 'primeng/splitbutton';
import { BadgeModule } from 'primeng/badge';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DropdownModule } from 'primeng/dropdown';
import { ListboxModule } from 'primeng/listbox';
import { PaginatorModule } from 'primeng/paginator';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { DatePipe } from '@angular/common';
import { SharedModule } from '../shared.module';

@NgModule({
    imports: [
        CommonModule,
        TimelineModule,
        FormsModule,
        InputMaskModule,
        InputNumberModule,
        CascadeSelectModule,
        MultiSelectModule,
        InputTextareaModule,
        InputTextModule,
        ButtonModule,
        CardModule,
        AddUserRoutingModule,
        ImageModule,
        FileUploadModule,
        AvatarModule,
        ToastModule,
        PasswordModule,
        SplitButtonModule,
        InputSwitchModule,
        SelectButtonModule,
        DropdownModule,
        ListboxModule,
        PaginatorModule,
        ConfirmPopupModule,
        CheckboxModule,
        ConfirmDialogModule,
        DividerModule,
        TableModule,
        CalendarModule,
        CheckboxModule,
        DatePipe,
        SharedModule,
    ],
    declarations: [AddUserComponent],
})
export class AddUserModule { }
