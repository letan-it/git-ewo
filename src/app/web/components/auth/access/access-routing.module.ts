import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccessComponent } from './access.component';
import { PublishImageComponent } from '../publish-image/publish-image.component';
import { ViewComponent } from 'src/app/app-powerbi/view/view.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: AccessComponent },
        { path: 'images/:id', component: PublishImageComponent },
        { path: 'view', component: ViewComponent }
    ])],
    exports: [RouterModule]
})
export class AccessRoutingModule { }
