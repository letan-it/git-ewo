import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SmsComponent } from './sms.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: SmsComponent }
    ])],
    exports: [RouterModule]
})
export class SmsRoutingModule { }
