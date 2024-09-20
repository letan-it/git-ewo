import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router'; 
import { QuickTestComponent } from './quick-test.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: QuickTestComponent },
        {
            path: '',
            loadChildren: () =>
                import('./quick-test.module').then(
                    (m) => m.QuickTestModule
                ),
        },
    ])],
    exports: [RouterModule],

    
})
export class QuickTestRoutingModule { }
