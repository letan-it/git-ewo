import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangePassWordRoutingModule } from './change-password-routing.module';
import { ChangePassWordComponent } from './change-password.component';
import { ButtonModule } from 'primeng/button';
import { LoginRoutingModule } from '../login/login-routing.module';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider'; 
import { MessagesModule } from 'primeng/messages'; 

@NgModule({
    imports: [
        CommonModule,
        ChangePassWordRoutingModule,
        ButtonModule,
        CommonModule,
        LoginRoutingModule,
        ButtonModule,
        PasswordModule,
        FormsModule,
        ToastModule,
        DividerModule,
        DialogModule,
        MessagesModule
        
    ],
    declarations: [ChangePassWordComponent],
})
export class ChangePassWordModule {}
