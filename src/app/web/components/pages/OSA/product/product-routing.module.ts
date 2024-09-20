import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';   
import { ProductComponent } from './product.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ProductComponent }, 
        {
            path: 'category',
            loadChildren: () =>
                import('./category/category.module').then((m) => m.CategoryModule),
        },
        {
            path: 'group-product',
            loadChildren: () =>
                import('./group-product/group-product.module').then((m) => m.GroupProductModule),
        },
    ])],
    exports: [RouterModule]
})
export class ProductRoutingModule { }
