import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RouterComponent } from './store-router.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: RouterComponent }, 
    ])],
    
    exports: [RouterModule]
})
export class RouterRoutingModule { }
