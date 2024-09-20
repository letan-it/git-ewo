import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddUserComponent } from './add-user.component'; 

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: AddUserComponent }]), 
    ],
    exports: [RouterModule],
})
export class AddUserRoutingModule {}
