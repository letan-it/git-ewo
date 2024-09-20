

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router'; 
import { TransactionComponent } from './transaction.component';
import { CreateTransactionComponent } from './create-transaction/create-transaction.component';
import { SummaryLeaderComponent } from './summary-leader/summary-leader.component';
import { TransferItemComponent } from './transfer-item/transfer-item.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: TransactionComponent },
        { path: 'create', component: CreateTransactionComponent },
        { path: 'summary-leader', component: SummaryLeaderComponent },
        { path: 'transfer-sa', component: TransferItemComponent },
        {
            path: '',
            loadChildren: () =>
                import('./transaction.module').then(
                    (m) => m.TransactionModule
                ),
        },
    ])],
    exports: [RouterModule],

    
})
export class TransactionRoutingModule { }
