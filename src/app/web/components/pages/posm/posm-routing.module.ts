import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PosmComponent } from './posm.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: PosmComponent },
        {
            path: 'reason',
            loadChildren: () =>
                import('./reason/reason.module').then((m) => m.ReasonModule),
        },
    ])],
    exports: [RouterModule]
})
export class PosmRoutingModule { }
