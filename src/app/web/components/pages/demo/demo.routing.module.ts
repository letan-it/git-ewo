import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DemoComponent } from './demo.component';
import { SmartBoothComponent } from './smart-booth/smart-booth.component';
import { ApiConfigComponent } from './api-config/api-config.component';
 
 

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DemoComponent },
        { path: 'smart-booth', component: SmartBoothComponent },
        { path: 'api-config', component: ApiConfigComponent }
    ])],
    exports: [RouterModule]
})
export class DemoRoutingModule { }
