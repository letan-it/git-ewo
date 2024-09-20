import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { plansComponent } from './plans.component';

@NgModule({

    imports: [RouterModule.forChild(
        [{ path: '', component: plansComponent },
        {
            path: 'shift',
            loadChildren: () =>
                import('./shift/shift.module').then(
                    (m) => m.shiftModule
                ),
        },
        ])],
    exports: [RouterModule],
})
export class plansRoutingModule { }
