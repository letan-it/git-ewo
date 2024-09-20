import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router'; 
import { TypeComponent } from './store-type.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: TypeComponent }
    ])],
    exports: [RouterModule]
})
export class TypeRoutingModule { }
