import { Component } from '@angular/core';
import {
    ConfirmEventType,
    ConfirmationService,
    MessageService,
} from 'primeng/api';
import { EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { Pf } from 'src/app/_helpers/pf';
import { AppComponent } from 'src/app/app.component';
import { ExportService } from 'src/app/web/service/export.service';
import { ProductService } from 'src/app/web/service/product.service';
import { ShopsService } from 'src/app/web/service/shops.service';
import { SupplierService } from 'src/app/web/service/supplier.service';

@Component({
    selector: 'app-store-supplier',
    templateUrl: './store-supplier.component.html',
    styleUrls: ['./store-supplier.component.scss'],
    providers: [ConfirmationService],
})
export class StoreSupplierComponent {
    supplierDialog: boolean = false;

    suppliers!: any[];

    supplier!: any;

    selectedProducts!: any[] | null;

    submitted: boolean = false;

    statuses!: any[];
    items_menu: any = [
        { label: ' PROJECT' },
        { label: ' Store', icon: 'pi pi-home', routerLink: '/stores' },
        { label: ' Supplier', icon: 'pi pi-star' },
    ];
    home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
    constructor(
        private _service: SupplierService,
        private exportService: ExportService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit() {
        this._service
            .Supplier_GetList(Helper.ProjectID())
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    if (data.data.length > 0) {
                        this.suppliers = data.data;
                        this.suppliers = this.suppliers.map((item: any) => ({
                            ...item,
                            _status: item.status == 1 ? true : false,
                        }));

                    }
                }
            });
        this.statuses = [
            { label: 'Active', value: 1 },
            { label: 'In Active', value: 0 },
        ];
    }

    action: any = 'create';
    openNew() {
        this.supplier = {};
        this.submitted = false;
        this.supplierDialog = true;
        this.action = 'create';
    }

    deleteSelectedSupplier() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected suppliers?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.suppliers = this.suppliers.filter(
                    (val) => !this.selectedProducts?.includes(val)
                );
                this.selectedProducts = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Products Deleted',
                    life: 3000,
                });
            },
        });
    }

    editSupplier(supplier: any) {
        this.supplier = { ...supplier };
        this.supplier._status = supplier.status == 1 ? true : false;
        this.supplierDialog = true;
        this.action = 'update';
    }

    deleteSupplier(supplier: any) {
        console.log(
            '🚀 ~ file: store-supplier.component.ts:86 ~ StoreSupplierComponent ~ deleteSupplier ~ supplier:',
            supplier
        );

        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + supplier.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this._service
                    .Suppliers_Action(
                        Helper.ProjectID(),
                        supplier.supplier_id,
                        supplier.supplier_code,
                        supplier.supplier_name,
                        supplier._status == true ? 1 : 0,
                        'delete'
                    )
                    .subscribe((data: any) => {
                        if (data.result == EnumStatus.ok) {
                            // this.supplier = {};
                            this.clearSupplier(this.action, data.data);
                            this.NofiResult('Page Supplier', 'Delete supplier', 'Delete the supplier successfully', 'success', 'Successfull');

                        }
                    });
            },
            reject: (type: any) => {
                switch (type) {
                    case ConfirmEventType.REJECT:
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Rejected',
                            detail: 'You have rejected',
                        });
                        break;
                    case ConfirmEventType.CANCEL:
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Cancelled',
                            detail: 'You have cancelled',
                        });
                        break;
                }
            },
        });
    }

    hideDialog() {
        this.supplierDialog = false;
        this.submitted = false;
    }

    saveSupplier() {
        this.submitted = true;

        if (
            this.NofiIsNullCode(this.supplier.supplier_code, 'supplier code') ==
            1 ||
            this.NofiIsNull(this.supplier.supplier_name, 'supplier name') == 1
        ) {
            return;
        } else {
            this._service
                .Suppliers_Action(
                    Helper.ProjectID(),
                    this.action == 'create' ? 0 : this.supplier.supplier_id,
                    this.supplier.supplier_code,
                    this.supplier.supplier_name,
                    this.supplier._status == true ? 1 : 0,
                    this.action
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        if (data.data.length > 0) {

                            this.NofiResult('Page Supplier',
                                this.action, this.action == 'create' ? 'Create a successful supplier' : 'Update supplier successfully',
                                'success', 'Successfull');
                            this.clearSupplier(this.action, data.data);

                        }
                    }
                });
        }
    }

    clearSupplier(action: any, value: any) {

        if (action == 'create') {
            this.suppliers = value;
            this.supplierDialog = false;
            this.supplier = {};
        } else {
            this.suppliers = value;
            this.supplierDialog = false;
            this.supplier = {};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.suppliers.length; i++) {
            if (this.suppliers[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        var chars =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    getSeverity(status: string): any {
        switch (status) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warning';
            case 'OUTOFSTOCK':
                return 'danger';
        }
    }

    export() {
        this.exportService.Suppliers_GetList_Export(Helper.ProjectID());
    }

    NofiIsNull(value: any, name: any): any {
        let check = 0;
        if (value == 0) {
            value += '';
        }
        if (Helper.IsNull(value) == true || Pf.checkSpace(value) != true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a ' + name,
            });
            check = 1;
        }
        return check;
    }

    NofiIsNullCode(value: any, name: any): any {
        if (
            Helper.IsNull(value) == true ||
            Pf.checkSpaceCode(value) == true ||
            Pf.checkUnsignedCode(value) == true ||
            Pf.CheckCode(value) != true
        ) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a ' + name,
            });
            return 1;
        }
        return 0;
    }


    NofiResult(page: any, action: any, name: any, severity: any, summary: any) {
        this.messageService.add({
            severity: severity,
            summary: summary,
            detail: name,
            life: 3000,
        });

        AppComponent.pushMsg(
            page,
            action,
            name,
            severity == 'success' ? EnumStatus.ok : EnumStatus.error,
            0
        );

    }

}
