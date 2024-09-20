import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { GalleriaModule } from 'primeng/galleria';

@NgModule({
    imports: [
        CommonModule,
        AuthRoutingModule,
         
    ]
})
export class AuthModule { }
