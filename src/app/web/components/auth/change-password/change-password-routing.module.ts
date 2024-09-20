import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChangePassWordComponent } from './change-password.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ChangePassWordComponent },
        ]),
    ],
    exports: [RouterModule],
})
export class ChangePassWordRoutingModule {}
