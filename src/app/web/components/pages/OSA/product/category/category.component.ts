import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { EnumLocalStorage, EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { Pf } from 'src/app/_helpers/pf';
import { AppComponent } from 'src/app/app.component';
import { CategoryService } from 'src/app/web/service/category.service';
import { ExportService } from 'src/app/web/service/export.service';

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss'],
    providers: [ConfirmationService]
})
export class CategoryComponent {
    menu_id = 16;
    items_menu: any = [
        { label: ' MASTER' },
        {
            label: ' Product',
            icon: 'pi pi-database',
            routerLink: '/osa/product',
        },
        {
            label: ' Category',
            icon: 'pi pi-book'
        },
    ];
    home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };

    check_permissions() {
        const menu = JSON.parse(localStorage.getItem('menu') + '').filter(
            (item: any) => item.menu_id == this.menu_id && item.check == 1
        );
        if (menu.length > 0) {
        } else {
            this.router.navigate(['/empty']);
        }
    }
    constructor(
        private _service: CategoryService,
        private _export: ExportService,
        private messageService: MessageService,
        private router: Router,
        private edService: EncryptDecryptService,
        private serviceExport: ExportService,
        private confirmationService: ConfirmationService
    ) { }

    ListCategory: any = [];

    // string category_name, string category_name_vi, string? company, string? barand_code,  string? brand, 
    //         string? brand_name_vi, string? division_code, string? division_name, string? market_code, string? market_name, string? market_name_vi
    category_name: any = null;
    id: any = null;
    company: any = null;
    brand: any = null;
    package: any = null;
    division: any = null;
    market: any = null;

    isLoading_Filter: boolean = false;
    color: any = '';
    LoadData() {
        this.isLoading_Filter = true;

        this.ListCategory = [];
        this._service.Get_Categories(
            Helper.ProjectID(),
            this.id,
            this.category_name,
            this.company,
            this.brand,
            this.package,
            this.division,
            this.market

        ).subscribe((data: any) => {

            if (data.result == EnumStatus.ok) {
                if (data.data.length > 0) {
                    this.ListCategory = data.data;
                    this.isLoading_Filter = false;
                } else {
                    this.ListCategory = []
                    this.isLoading_Filter = false
                }
            }
        });
    }

    showFilter: number = 1;
    ShowHideFilter() {
        if (this.showFilter == 1) {
            this.showFilter = 0;
        } else {
            this.showFilter = 1;
        }
    }

    userProfile: any;
    currentUser: any;
    itemsImport: any;

    ngOnInit(): void {
        this.check_permissions();
        this.LoadData();
        this.loadUser();

        this.itemsImport = [
            {
                label: 'Import Category',
                icon: 'pi pi-upload',
                command: () => {
                    this.ShowHideTemplate(1);
                },
            },
            { separator: true },
            {
                label: 'Close',
                icon: 'pi pi-times',
                command: () => {
                    this.close();
                },
            },
        ];
    }

    typeImport: number = 0;
    showTemplate: number = 0;
    ShowHideTemplate(value: any) {
        if (this.showTemplate == 0) {
            this.showTemplate = 1;
            this.typeImport = value;
            this.clearDataImport();
        } else {
            this.showTemplate = 0
        }

    }

    close() {
        this.showTemplate = 0;
    }

    dataError: any;
    dataMessError: any;
    clearDataImport() {
        this.dataError = undefined;
        this.dataMessError = undefined;
    }

    file!: any;
    // On file Select
    onChange(event: any) {
        this.clearDataImport();
        this.file = event.target.files[0];
    }

    @ViewChild('myInputFile') myInputFile: any;
    clearFileInput() {
        this.myInputFile.nativeElement.value = null;
        this.file = undefined;
    }

    getTemplate() {
        this._export.ewo_Categories_Export(Helper.ProjectID());
    }

    importTemplate() {
        if (Helper.IsNull(this.file) == true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter file',
            });
            return;
        } else {
            this.clearDataImport();
            const formDataUpload = new FormData();
            formDataUpload.append('files', this.file);

            this._service
                .ewo_Categories_ImportData(formDataUpload, Helper.ProjectID())
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.NofiResult('Page Category', 'Add category', 'Add a successful product from the Import file', 'success', 'Successfull');
                        this.LoadData();
                    } else {
                        if (data.data == null) {
                            this.dataMessError = data.message;


                            this.messageService.add({
                                severity: 'warn',
                                summary: 'Warning',
                                detail: this.dataMessError,
                            });
                        } else {
                            this.dataError = data.data;

                        }
                    }
                    this.clearFileInput();
                });
        }
    }

    addItem(newItem: boolean) {
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Success create category',
        });
        this.LoadData();
        this.ListCategoryCreate = newItem;
    }

    ListCategoryCreate: boolean = false;
    createListCategory() {
        this.ListCategoryCreate = true;
    }

    categoryDialog: boolean = false;
    category!: any;
    selectedCategory!: any;
    submitted: boolean = false;
    statuses!: any[];
    action: any = 'create';

    openNew() {
        this.category = {};
        this.submitted = false;
        this.categoryDialog = true;
        this.action = 'create';
    }

    deleteSelectedCategory() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected ListCategory?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.ListCategory = this.ListCategory.filter((val: any) => !this.selectedCategory?.includes(val));
                this.selectedCategory = null;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
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

    editCategory(category: any) {
        this.category = { ...category };
        this.categoryDialog = true;
        this.action = 'update';
    }

    deleteCategory(category: any) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + category.category_name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this._service
                    .Categories_Action(
                        Helper.ProjectID(),
                        category.category_id,
                        category.category_name,
                        category.category_name_vi,
                        category.company, category.brand_code, category.brand, category.brand_name_vi,
                        category.package, category.orders,
                        category.division_code, category.division_name,
                        category.market_code, category.market_name, category.market_name_vi,
                        category.color, 'delete'
                    )
                    .subscribe((data: any) => {
                        if (data.result == EnumStatus.ok) {
                            this.NofiResult('Page Category', 'Delete category', `Successfully delete the category ${category.category_name}`, 'success', 'Successfull');
                            this.clearCategory(data.data);
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
        this.categoryDialog = false;
        this.submitted = false;
    }

    saveCategory() {
        this.submitted = true;

        if (Helper.IsNull(this.category.orders) == true) {
            this.category.orders = 0;
        }

        if (
            this.NofiIsNull(this.category.category_name, 'category name') == 1 ||
            this.NofiIsNull(this.category.category_name_vi, 'category name vi') == 1 ||
            this.NofiSpace(this.category.company, 'Company') == 1 ||
            this.NofiSpace(this.category.brand_code, 'Brand code') == 1 ||
            this.NofiSpace(this.category.brand, 'Brand Name') == 1 ||
            this.NofiSpace(this.category.brand_name_vi, 'Brand name vi') == 1 ||

            this.NofiSpace(this.category.package, 'Package') == 1 ||
            this.checkNumber(this.category.orders, 'Orders') == 1 ||
            this.NofiSpace(this.category.division_code, 'Division code') == 1 ||
            this.NofiSpace(this.category.division_name, 'Division name') == 1 ||

            this.NofiSpace(this.category.market_code, 'Market code') == 1 ||
            this.NofiSpace(this.category.market_name, 'Market name') == 1 ||
            this.NofiSpace(this.category.market_name_vi, 'Market name vi') == 1 ||
            this.NofiSpace(this.category.color, 'Color') == 1
        ) {
            return;
        } else {

            // const categoryList = this.ListCategory.filter(
            //     (x: any) => x.category_id != this.category.category_id &&
            //         x.category_name.toUpperCase() == this.category.category_name.toUpperCase());

            // const categoryViList = this.ListCategory.filter(
            //     (x: any) => x.category_id != this.category.category_id &&
            //         x.category_name_vi.toUpperCase() == this.category.category_name_vi.toUpperCase());


            // if (this.checkExist(categoryList, 'Category name') == 1 ||
            //     this.checkExist(categoryViList, 'Category name vi') == 1) {
            //     return;
            // } else {

            this._service
                .Categories_Action(
                    Helper.ProjectID(),
                    this.action == 'create' ? 0 : this.category.category_id,
                    this.category.category_name,
                    this.category.category_name_vi,
                    this.category.company, this.category.brand_code, this.category.brand, this.category.brand_name_vi,
                    this.category.package, this.category.orders,
                    this.category.division_code, this.category.division_name,
                    this.category.market_code, this.category.market_name, this.category.market_name_vi,
                    this.category.color, this.action
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.NofiResult('Page Category', this.action,
                            this.action == 'create' ? `Successfully create the category ${this.category.category_name}` :
                                `Successfully update the category ${this.category.category_name}`, 'success', 'Successfull');
                        this.clearCategory(data.data)
                        // return;

                    }
                });


            // }

        }

    }

    clearCategory(data: any) {
        this.ListCategory = [...data];
        this.categoryDialog = false;
        this.category = {};
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.ListCategory.length; i++) {
            if (this.ListCategory[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
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

    NofiSpace(value: any, name: any): any {
        if (Helper.IsNull(value) != true) {
            if (Pf.checkSpace(value) == false) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: name + ' wrong format',
                });
                return 1;
            }
        }
        return 0;
    }

    NofiIsNull(value: any, name: any): any {
        if (Helper.IsNull(value) == true || Pf.checkSpace(value) != true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a ' + name,
            });
            return 1;
        }
        return 0;
    }

    checkNumber(value: any, name: any): any {
        if (Helper.number(value) != true && Helper.IsNull(value) != true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: name + ' wrong format',
            });
            return 1;
        }
        return 0;
    }
    checkExist(value: any, name: any): any {
        if (value.length > 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: name + ' already exist',
            });
            return 1;
        }
        return 0;
    }

    export() {
        this.serviceExport.ewo_Categories_RawData(
            Helper.ProjectID(),
            this.category_name,
            this.company,
            this.brand,
            this.package,
            this.division,
            this.market
        );
    }

    user_profile: any;

    loadUser() {
        let _u = localStorage.getItem(EnumLocalStorage.user);

        this.currentUser = JSON.parse(
            this.edService.decryptUsingAES256(_u)
        );
        this.currentUser.employee[0]._status =
            this.currentUser.employee[0].status == 1 ? true : false;
        this.userProfile = this.currentUser.employee[0];

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
