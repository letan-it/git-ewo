import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EnumLocalStorage, EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { AppComponent } from 'src/app/app.component';
import { ExportService } from 'src/app/web/service/export.service';
import { MastersService } from 'src/app/web/service/masters.service';
import { ShopsService } from 'src/app/web/service/shops.service';

@Component({
    selector: 'app-stores',
    templateUrl: './stores.component.html',
    styleUrls: ['./stores.component.scss'],
    providers: [ConfirmationService],
})
export class StoresComponent {
    menu_id = 7;
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
        private router: Router,
        private _service: ShopsService,
        private serviceExport: ExportService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private edService: EncryptDecryptService,
        private masterService: MastersService
    ) { }

    ListStatus: any = [
        { name: 'Active', code: '1' },
        { name: 'In-Active', code: '0' },
    ];
    selectStatus: any;
    products: any;
    is_test: string[] = [];
    display: boolean = false;
    ShopEdit: boolean = false;
    ShopCreate: boolean = false;

    shopDetail: any;
    message: string = '';

    update(item: any) {
        this.shopDetail = item;
        this.ShopEdit = true;
    }
    create() {
        this.ShopCreate = true;
    }
    OK() {
        this.ShopEdit = false;
        this.display = false;
    }
    showFiter: number = 1;
    ShowHideFiter() {
        if (this.showFiter == 1) {
            this.showFiter = 0;
        } else {
            this.showFiter = 1;
        }
    }
    checkAllTest: number = 0;

    shopinfo!: any;

    chooseAll() {
        this.checkAllTest == 1
            ? (this.checkAllTest = 0)
            : (this.checkAllTest = 1);

        this.checkAllTest == 1
            ? (this.ListShop = this.ListShop.map((item: any) => ({
                ...item,
                checked: true,
            })))
            : (this.ListShop = this.ListShop.map((item: any) => ({
                ...item,
                checked: false,
            })));
    }

    shop_code: string = '';
    customer_shop_code: string = '';
    project_shop_code: string = '';

    items: any;
    itemsRawData: any;
    itemsData: any;

    getFormatedDate(date: Date, format: string) {
        const datePipe = new DatePipe('en-US');
        return datePipe.transform(date, format);
    }
    selectMonth: any;
    ListMonth: any = [];
    PlanDate: any;
    getMonth(date: Date, format: string) {
        const today = new Date();
        const year = today.getFullYear();
        const monthToday = today.getMonth() + 1;
        const datePipe = new DatePipe('en-US');
        let monthNow = parseInt(datePipe.transform(date, format) as any) || 0;
        if (monthNow < 12) {
            monthNow++;
        }
        // for (let month = monthToday; month <= 12; month++) {
        //     const monthString = month.toString().padStart(2, '0');
        //     const yearMonth = `${year} - Tháng ${monthString}`;
        //     this.ListMonth.push({
        //         name: yearMonth,
        //         code: `${year}${monthString}`,
        //     });
        //     if (month == monthNow - 1) {
        //         this.selectMonth = {
        //             name: yearMonth,
        //             code: `${year}${monthString}`,
        //         };
        //     }
        // }

        const dataMonth = Helper.getMonth()
        this.ListMonth = dataMonth.ListMonth

        const monthString = monthToday.toString().padStart(2, '0')
        const currentDate = parseInt(year + monthString)
        if (Helper.IsNull(this.selectMonth) == true) {
            this.selectMonth = this.ListMonth?.find((i: any) => (i?.code == currentDate))
        }

        // this.month = year + monthString;

    }
    selectedShop: any = [];

    currentUser: any;
    userProfile: any;

    itemsDataTarget: any;
    itemsDataProject: any;

    project_id: any;
    itemsImport: any;
    template_areas: any = 'assets/template/template_shop_areas_import.xlsx';
    template_manager: any = 'assets/template/template_shop_manager_import.xlsx';
    template_supplier: any =
        'assets/template/template_shop_supplier_import.xlsx';

    listAreas: any = [];
    items_menu: any;
    home: any;
    ngOnInit() {
        this.items_menu = [
            { label: ' PROJECT' },
            { label: ' Store', icon: 'pi pi-home' },
            // { label: ' Add user', icon: 'pi pi-user-plus' },
        ];
        this.home = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
        this.masterService
            .ewo_GetMaster(Helper.ProjectID())
            .subscribe((data: any) => {
                this.listAreas = [];
                data.data.forEach((element: any) => {
                    if (
                        element.project_id == Helper.ProjectID() &&
                        element.ListCode == 'Shop.Areas' &&
                        element.Status == 1
                    ) {
                        this.listAreas.push({
                            code: element.Code,
                            name: element.Code,
                        });
                    }
                });
            });

        this.check_permissions();
        // this.showFiter = 0;

        this.project_id = Helper.ProjectID();
        let _u = localStorage.getItem(EnumLocalStorage.user);

        this.currentUser = JSON.parse(this.edService.decryptUsingAES256(_u));
        this.userProfile = this.currentUser.employee[0];

        this.items = [
            {
                label: 'Shop router',
                icon: 'pi pi-sitemap',
                command: () => {
                    this.createStoreRouter();
                },
            },
            { separator: true },
            {
                label: 'Shop type',
                icon: 'pi pi-caret-right',
                command: () => {
                    this.createStoreType();
                },
            },
            { separator: true },
            {
                label: 'Shop channel',
                icon: 'pi pi-caret-right',
                command: () => {
                    this.createStoreChannel();
                },
            },
            { separator: true },
            {
                label: 'Shop Target',
                icon: 'pi pi-thumbs-up',
                command: () => {
                    this.viewShopTarget();
                },
            },
            { separator: true },
            {
                label: 'Shop Supplier',
                icon: 'pi pi-star',
                command: () => {
                    this.viewShopSupplier();
                },
            },
        ];


        this.itemsRawData = [

            {
                label: 'Shop List',
                icon: 'pi pi-file-export',
                command: () => {
                    this.export(1);
                },
            },
            { separator: true },
            {
                label: 'Shop Areas',
                icon: 'pi pi-file-export',
                command: () => {
                    this.export(2);
                },
            },
            { separator: true },
            {
                label: 'Shop Manager',
                icon: 'pi pi-file-export',
                command: () => {
                    this.export(3);
                },
            },
            { separator: true },
            {
                label: 'Shop Supplier',
                icon: 'pi pi-file-export',
                command: () => {
                    this.export(4);
                },
            }
        ];




        this.itemsData = [
            {
                label: 'Shop',
                icon: 'pi pi-shopping-bag',
                command: () => {
                    this.export(1);
                },
            },
            { separator: true },
            {
                label: 'Shop by month',
                icon: 'pi pi-calendar-times',
                command: () => {
                    this.exportShopByMonth();
                },
            },
        ];

        this.itemsDataTarget = [
            {
                label: 'Add item',
                icon: 'pi pi-plus',
                command: () => {
                    this.addTarget();
                },
            },
            { separator: true },
            {
                label: 'Add All (' + this.totalRecords + ' item)',
                icon: 'pi pi-plus',
                command: () => {
                    this.addAllTarget();
                },
            },
        ];

        this.itemsDataProject = [
            {
                label: 'Add item',
                icon: 'pi pi-plus',
                command: () => {
                    this.addProject();
                },
            },
            { separator: true },
            {
                label: 'Add All (' + this.totalRecords + ' item)',
                icon: 'pi pi-plus',
                command: () => {
                    this.addAllProject();
                },
            },
        ];


        let newDate = new Date();
        this.PlanDate = this.getFormatedDate(newDate, 'YYYY-MM-dd');
        this.getMonth(newDate, 'MM');

        this.itemsImport = [
            {
                label: 'Import Shops',
                icon: 'pi pi-upload',
                command: () => {
                    this.ShowHideTemplate(1);
                },
            },
            { separator: true },
            {
                label: 'Import Areas',
                icon: 'pi pi-upload',
                command: () => {
                    this.ShowHideTemplate(2);
                },
            },
            { separator: true },
            {
                label: 'Import Manager',
                icon: 'pi pi-upload',
                command: () => {
                    this.ShowHideTemplate(3);
                },
            },
            { separator: true },
            {
                label: 'Import Supplier',
                icon: 'pi pi-upload',
                command: () => {
                    this.ShowHideTemplate(4);
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

        this.template_areas += '?v=' + newDate.toUTCString();
        this.template_manager += '?v=' + newDate.toUTCString();
        this.template_supplier += '?v=' + newDate.toUTCString();
    }

    item_ShopType: number = 0;
    selectShopType(event: any) {
        this.item_ShopType = event != null ? event.code : 0;
    }
    item_ShopRouter: number = 0;
    selectShopRouter(event: any) {
        this.item_ShopRouter = event != null ? event.code : 0;
    }
    item_channel: number = 0;
    selectedChannel(event: any) {
        this.item_channel = event != null ? event.code : 0;
    }
    item_Province: any;
    selectProvince(event: any) {
        this.item_Province = event != null ? event : 0;
    }
    item_District: any;
    selectDistrict(event: any) {
        this.item_District = event != null ? event : 0;
    }
    item_Ward: any = 0;
    selectWard(event: any) {
        this.item_Ward = event != null ? event : 0;
    }
    item_ASM: number = 0;
    selectASM(event: any) {
        this.item_ASM = event != null ? event.code : 0;
    }

    onDetail(shop: any) {
        if (shop.hide == 1) {
            shop.hide = 0;
        } else {
            shop.hide = 1;
        }
    }
    isLoading_Filter: any = false;

    ListShop: any = [];
    is_loadForm: number = 0;
    filter(pageNumber: number) {

        let is_test = 0;
        this.is_loadForm = 1;
        if (pageNumber == 1) {
            this.first = 0;
            this.totalRecords = 0;
            // this.rows  = 20;
            this._pageNumber = 1;
        }

        this.ListShop = [];
        this.isLoading_Filter = true;
        this._service
            .ewoGetShopList(
                this.rows,
                pageNumber,
                Helper.ProjectID(),
                this.shop_code,
                this.customer_shop_code,
                this.project_shop_code,
                this.item_ShopType,
                this.item_Province == null ? 0 : this.item_Province.code,
                this.item_District == null ? 0 : this.item_District.code,
                this.item_Ward == null ? 0 : this.item_Ward.code,
                this.item_channel,
                this.item_ShopRouter,
                this.selectStatus == null ? -1 : this.selectStatus.code,
                this.item_ASM,
                this.itemAreas,
                this.itemSupplier_id
            )
            .subscribe((data: any) => {
                this.is_loadForm = 0;
                if (data.result == EnumStatus.ok) {
                    if (data.data.length > 0) {
                        this.ListShop = data.data;
                        console.log("🚀 ~ file: stores.component.ts:448 ~ StoresComponent ~ .subscribe ~ this.ListShop:", this.ListShop)

                        this.ListShop = this.ListShop.map((item: any) => ({
                            ...item,
                            _check_location:
                                item.check_location == 1 ? true : false,
                            _verify: item.verify == 1 ? true : false,
                            _status: item.status == 1 ? true : false,
                            checked: false,
                        }));

                        this.ListShop.forEach((element: any) => {
                            element.shopinfo = JSON.parse(element.shopinfo);
                            element.shopinfobymonth = JSON.parse(
                                element.shopinfobymonth
                            );
                            element.employeeShops = JSON.parse(
                                element.employeeShops
                            );
                        });

                        this.ListShop.forEach((element: any) => {
                            element.shopinfoProject = element.shopinfo.filter((data: any) => data.project_id == Helper.ProjectID())
                        });
                        // this.ListShop.shopinfoProject = this.ListShop.shopinfo.filter((data: any) => data.project_id = Helper.ProjectID())

                        this.ListShop.forEach((element: any) => {
                            if (element.employeeShops != null) {
                                element.employeeShops =
                                    element.employeeShops.map((data: any) => ({
                                        ...data,
                                        _IsActive:
                                            data.IsActive == 1 ? true : false,
                                    }));
                            }
                        });

                        this.totalRecords = this.ListShop[0].TotalRows;

                        this.itemsDataTarget = [
                            {
                                label:
                                    'Add (' +
                                    this.selectedShop.length +
                                    ') item',
                                icon: 'pi pi-plus',
                                command: () => {
                                    this.addTarget();
                                },
                            },
                            { separator: true },
                            {
                                label:
                                    'Add All (' + this.totalRecords + ') item)',
                                icon: 'pi pi-plus',
                                command: () => {
                                    this.addAllTarget();
                                },
                            },
                        ];
                        this.itemsDataProject = [
                            {
                                label: 'Add (' + this.selectedShop.length + ') item',
                                icon: 'pi pi-plus',
                                command: () => {
                                    this.addProject();
                                },
                            },
                            { separator: true },
                            {
                                label: 'Add All (' + this.totalRecords + ') item)',
                                icon: 'pi pi-plus',
                                command: () => {
                                    this.addAllProject();
                                },
                            },
                        ];

                        // this.ListShop.forEach((element: any) => {
                        //     element.shopinfo = element.shopinfo.filter(
                        //         (data: any) =>
                        //             data.project_id == Helper.ProjectID()
                        //     );
                        // });

                        console.log("🚀 ~ file: stores.component.ts:528 ~ StoresComponent ~ .subscribe ~ this.ListShop:", this.ListShop)

                        this.isLoading_Filter = false;
                    } else {
                        this.isLoading_Filter = false;

                        this.message = 'No data';
                        this.display = true;
                    }
                }
            });
    }

    export(value: any) {
        if (value == 1) {
            let is_test = 0;
            this.serviceExport.ewo_ExportShopList(
                this.totalRecords,
                1,
                Helper.ProjectID(),
                this.shop_code,
                this.customer_shop_code,
                this.project_shop_code,
                this.item_ShopType,
                this.item_Province == null ? 0 : this.item_Province.code,
                this.item_District == null ? 0 : this.item_District.code,
                this.item_Ward == null ? 0 : this.item_Ward.code,
                this.item_channel,
                this.item_ShopRouter,
                this.selectStatus == null ? -1 : this.selectStatus.code,
                this.item_ASM
            );
        } else if (value == 2) {
            this.serviceExport.ewo_Shop_Export(Helper.ProjectID(), 'ewo_ShopAreas_Export')
        } else if (value == 3) {
            this.serviceExport.ewo_Shop_Export(Helper.ProjectID(), 'ewo_EmployeeShops_Export')
        } else if (value == 4) {
            this.serviceExport.ewo_Shop_Export(Helper.ProjectID(), 'Shop_Supplier_Export')
        }

    }

    exportShopByMonth() { }
    exportTemplate() {
        this._service.ewo_Shop_GetTemplate_Audit(Helper.ProjectID());
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

            if (this.typeImport == 1) {
                this._service
                    .ewo_Shop_ImportData_Audit(formDataUpload, Helper.ProjectID())
                    .subscribe((data: any) => {
                        if (data.result == EnumStatus.ok) {
                            this.NofiResult('Page Shop', 'Create Shop', 'Create Shop Successfull', 'success', 'Successfull');
                            this.filter(1);
                        } else {
                            if (data.data == null) {
                                this.dataMessError = data.message;

                                this.messageService.add({
                                    severity: 'warn',
                                    summary: 'Warning',
                                    detail: this.dataMessError,
                                });
                            } else {
                                this.dataShopError = data.data;
                            }
                        }
                        this.clearFileInput()
                    })
            } else if (this.typeImport == 2) {
                this._service
                    .ewo_ShopAreas_ImportData(
                        formDataUpload,
                        Helper.ProjectID()
                    )
                    .subscribe((data: any) => {
                        if (data.result == EnumStatus.ok) {
                            this.NofiResult('Page Shop', 'Add successful area', 'Add successful area for the store', 'success', 'Successfull');

                            this.filter(1);
                        } else {
                            if (data.data == null) {
                                this.dataMessError = data.message;

                                this.messageService.add({
                                    severity: 'warn',
                                    summary: 'Warning',
                                    detail: 'Please select the correct file to import template file',
                                });
                            } else {
                                this.dataError = data.data;
                            }
                        }

                        this.clearFileInput();
                    });
            } else if (this.typeImport == 3) {
                this._service
                    .ewo_EmployeeShops_ImportData(
                        formDataUpload,
                        Helper.ProjectID()
                    )
                    .subscribe((data: any) => {
                        if (data.result == EnumStatus.ok) {

                            this.NofiResult('Page Shop', 'Add successful manager', 'Add successful manager for the store', 'success', 'Successfull');

                            this.filter(1);
                        } else {
                            if (data.data == null) {
                                this.dataMessError = data.message;

                                this.messageService.add({
                                    severity: 'warn',
                                    summary: 'Warning',
                                    detail: 'Please select the correct file to import template file',
                                });
                            } else {
                                this.dataManagerError = data.data;
                            }
                        }

                        this.clearFileInput();
                    });
            } else if (this.typeImport == 4) {
                this._service
                    .Shop_Supplier_ImportData(
                        formDataUpload,
                        Helper.ProjectID()
                    )
                    .subscribe((data: any) => {
                        if (data.result == EnumStatus.ok) {
                            this.NofiResult('Page Shop', 'Add successful supplier', 'Add successful supplier for the store', 'success', 'Successfull');

                            this.filter(1);
                        } else {
                            if (data.data == null) {
                                this.dataMessError = data.message;

                                this.messageService.add({
                                    severity: 'warn',
                                    summary: 'Warning',
                                    detail: 'Please select the correct file to import template file',
                                });
                            } else {
                                this.dataSupplierError = data.data;
                            }
                        }

                        this.clearFileInput();
                    });
            }
        }
    }

    first: number = 0;
    totalRecords: number = 0;
    rows: number = 20;
    _pageNumber: number = 1;

    onPageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
        this._pageNumber = (this.first + this.rows) / this.rows;
        this.filter(this._pageNumber);
    }

    createStoreRouter() {
        this.router.navigate(['/stores/router']);
    }
    createStoreType() {
        this.router.navigate(['/stores/type']);
    }
    createStoreChannel() {
        this.router.navigate(['/stores/channel']);
    }
    viewShopTarget() {
        this.router.navigate(['/stores/target']);
    }
    viewShopSupplier() {
        this.router.navigate(['/stores/supplier']);
    }
    addItem(newItem: boolean) {
        // this.messageService.add({
        //     severity: 'success',
        //     summary: 'Success',
        //     detail: 'Success Update Shop',
        // });
        this.filter(1);
        this.ShopEdit = newItem;
    }

    displayShopInfo(newItem: boolean) {
        if (newItem == true) {
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Update shop info project successful',
            });
            // this.filter(1)
        }
    }

    displayShopForm(newItem: boolean) {
        // this.messageService.add({
        //     severity: 'success',
        //     summary: 'Success',
        //     detail: 'Success Create Shop',
        // });
        this.filter(1);
        this.ShopCreate = newItem;
    }

    // item_Project: any=0;
    // selectProject(event: any) {
    //     this.item_Project = event != null ? event.Id : 0;

    // }

    showAddremoveTarget: number = 0;
    viewAddremoveTarget() {
        this.showAddremoveTarget == 0
            ? (this.showAddremoveTarget = 1)
            : (this.showAddremoveTarget = 0);
    }

    showAddRemoveProject: number = 0;
    viewAddRemoveProject() {
        this.showAddRemoveProject == 0 ? this.showAddRemoveProject = 1 : this.showAddRemoveProject = 0;
    }

    item_Project: any = 0;
    selectProject(event: any) {
        this.item_Project = event != null ? event.Id : 0;

    }

    addProject() {

        if (this.item_Project == 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Waning',
                detail: 'Please enter project',
            });
            return;
        }

        if (this.selectedShop.length == 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Waning',
                detail: 'Please enter shop',
            });
            return;
        }
        else {
            let shopListAdd = '';
            for (var i = 0; i < this.selectedShop.length; i++) {
                shopListAdd += this.selectedShop[i].shop_id + ' ';
            }
            this._service
                .ewo_ShopInfoProject_ListShop_Action(
                    shopListAdd,
                    Helper.ProjectID(),
                    this.item_Project,
                    'add')
                .subscribe((data: any) => {


                    if (data.result == EnumStatus.ok) {

                        this.NofiResult('Page Shop', 'Add project', 'Add project successful', 'success', 'Successfull');
                        this.item_Project = 0
                        this.selectedShop = []
                        this.filter(1);
                        return;

                    }
                });

        }
    }
    addAllProject() {

        if (this.item_Project == 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Waning',
                detail: 'Please enter project',
            });
            return;
        }

        if (this.ListShop.length == 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Waning',
                detail: 'Please press the filter button',
            });
            return;
        }
        else {

            this._service
                .ewoGetShopList(this.totalRecords, 1, Helper.ProjectID(),
                    this.shop_code, this.customer_shop_code, this.project_shop_code, this.item_ShopType,
                    this.item_Province == null ? 0 : this.item_Province.code,
                    this.item_District == null ? 0 : this.item_District.code,
                    this.item_Ward == null ? 0 : this.item_Ward.code,
                    this.item_channel, this.item_ShopRouter,
                    this.selectStatus == null ? -1 : this.selectStatus.code,
                    this.item_ASM, this.itemAreas, this.itemSupplier_id
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        if (data.data.length > 0) {
                            this.AllShop = data.data;

                            let shoplistAdd = '';
                            for (var i = 0; i < this.AllShop.length; i++) {
                                shoplistAdd += this.AllShop[i].shop_id + ' ';
                            }

                            this._service
                                .ewo_ShopInfoProject_ListShop_Action(
                                    shoplistAdd,
                                    Helper.ProjectID(),
                                    this.item_Project,
                                    'add')
                                .subscribe((data: any) => {


                                    if (data.result == EnumStatus.ok) {

                                        this.NofiResult('Page Shop', 'Add project', 'Add project successful', 'success', 'Successfull');
                                        this.item_Project = 0
                                        this.selectedShop = []
                                        this.filter(1);
                                        return;

                                    }
                                });

                        }
                    }
                });

        }

    }

    removeProject(event: Event) {

        if (this.item_Project == 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Waning',
                detail: 'Please enter project',
            });
            return;
        }
        if (this.selectedShop.length == 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Waning',
                detail: 'Please enter shop',
            });
            return;
        }
        else {
            let shopListAdd = '';
            for (var i = 0; i < this.selectedShop.length; i++) {
                shopListAdd += this.selectedShop[i].shop_id + ' ';
            }

            this.confirmationService.confirm({
                target: event.target as EventTarget,
                message: 'Are you sure that you want to proceed?',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this._service
                        .ewo_ShopInfoProject_ListShop_Action(
                            shopListAdd,
                            Helper.ProjectID(),
                            this.item_Project,
                            'remove')
                        .subscribe((data: any) => {

                            if (data.result == EnumStatus.ok) {

                                this.NofiResult('Page Shop', 'Remove project', 'Remove project successful', 'success', 'Successfull');
                                this.item_Project = 0
                                this.selectedShop = []
                                this.filter(1);
                                return;

                            }
                        });
                },
                reject: () => {
                    this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
                    this.item_Project = 0
                    this.selectedShop = []
                    this.filter(1);
                    return;
                }
            });


        }

    }

    onChangChecked(event: any) { }

    onCheckboxChange(shop: any) {
        shop.checked == true ? (shop.checked = false) : (shop.checked = true);
    }

    onChoose() {
        this.itemsDataTarget = [
            {
                label: 'Add (' + this.selectedShop.length + ') item',
                icon: 'pi pi-plus',
                command: () => {
                    this.addTarget();
                },
            },
            { separator: true },
            {
                label: 'Add All (' + this.totalRecords + ') item)',
                icon: 'pi pi-plus',
                command: () => {
                    this.addAllTarget();
                },
            },
        ];

        this.itemsDataProject = [
            {
                label: 'Add (' + this.selectedShop.length + ') item',
                icon: 'pi pi-plus',
                command: () => {
                    this.addProject();
                },
            },
            { separator: true },
            {
                label: 'Add All (' + this.totalRecords + ') item)',
                icon: 'pi pi-plus',
                command: () => {
                    this.addAllProject();
                },
            },
        ];

    }

    addTarget() {
        if (Helper.IsNull(this.selectMonth) == true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Waning',
                detail: 'Please select month',
            });
            return;
        }

        if (this.selectedShop.length == 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Waning',
                detail: 'Please enter shop',
            });
            return;
        } else {
            let shopListAdd = '';
            for (var i = 0; i < this.selectedShop.length; i++) {
                shopListAdd += this.selectedShop[i].shop_id + ' ';
            }

            this._service
                .ShopInfo_byMonth_listShop_Action(
                    shopListAdd,
                    Helper.ProjectID(),
                    this.selectMonth.code,
                    'add'
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.NofiResult('Page Shop', 'Add target', 'Add target successful', 'success', 'Successfull');

                        this.selectMonth = '';
                        this.selectedShop = [];
                        this.filter(1);
                        return;
                    }
                });
        }
    }
    AllShop: any;
    addAllTarget() {
        if (Helper.IsNull(this.selectMonth) == true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Waning',
                detail: 'Please select month',
            });
            return;
        }

        if (this.ListShop.length == 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Waning',
                detail: 'Please press the filter button',
            });
            return;
        } else {
            this._service
                .ewoGetShopList(this.totalRecords, 1, Helper.ProjectID(),
                    this.shop_code, this.customer_shop_code, this.project_shop_code, this.item_ShopType,
                    this.item_Province == null ? 0 : this.item_Province.code,
                    this.item_District == null ? 0 : this.item_District.code,
                    this.item_Ward == null ? 0 : this.item_Ward.code,
                    this.item_channel, this.item_ShopRouter,
                    this.selectStatus == null ? -1 : this.selectStatus.code,
                    this.item_ASM, this.itemAreas, this.itemSupplier_id
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        if (data.data.length > 0) {
                            this.AllShop = data.data;

                            let shoplistAdd = '';
                            for (var i = 0; i < this.AllShop.length; i++) {
                                shoplistAdd += this.AllShop[i].shop_id + ' ';
                            }

                            this._service
                                .ShopInfo_byMonth_listShop_Action(
                                    shoplistAdd,
                                    Helper.ProjectID(),
                                    this.selectMonth.code,
                                    'add'
                                )
                                .subscribe((data: any) => {
                                    if (data.result == EnumStatus.ok) {
                                        this.NofiResult('Page Shop', 'Add all target', 'All all target successful', 'success', 'Successfull');

                                        this.selectMonth = '';
                                        this.selectedShop = [];
                                        this.filter(1);
                                        return;
                                    }
                                });
                        }
                    }
                });
        }
    }
    removeTarget(event: any) {
        if (Helper.IsNull(this.selectMonth) == true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Waning',
                detail: 'Please select month',
            });
            return;
        }

        if (this.selectedShop.length == 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Waning',
                detail: 'Please enter shop',
            });
            return;
        } else {
            let shopListAdd = '';
            for (var i = 0; i < this.selectedShop.length; i++) {
                shopListAdd += this.selectedShop[i].shop_id + ' ';
            }

            this.confirmationService.confirm({
                target: event.target as EventTarget,
                message: 'Are you sure that you want to proceed?',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this._service
                        .ShopInfo_byMonth_listShop_Action(
                            shopListAdd,
                            Helper.ProjectID(),
                            this.selectMonth.code,
                            'remove'
                        )
                        .subscribe((data: any) => {
                            if (data.result == EnumStatus.ok) {
                                this.NofiResult('Page Shop', 'Remove target', 'Remove target successful', 'success', 'Successfull');
                                this.selectMonth = '';
                                this.selectedShop = [];
                                this.filter(1);
                                return;
                            }
                        });
                },
                reject: () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Rejected',
                        detail: 'You have rejected',
                    });
                    this.selectMonth = '';
                    this.selectedShop = [];
                    this.filter(1);
                    return;
                },
            });
        }
    }

    itemAreas: any = '';
    selectAreas(event: any) {
        this.itemAreas = event != null ? event.code : '';
    }

    itemSupplier_id: any = 0;
    selectSupplier(event: any) {
        this.itemSupplier_id = event != null ? event.code : 0;
    }

    dataError: any;
    dataManagerError: any;
    dataSupplierError: any;
    dataShopError: any;
    dataMessError: any;
    clearDataImport() {
        this.dataError = undefined;
        this.dataManagerError = undefined;
        this.dataSupplierError = undefined;
        this.dataShopError = undefined;
        this.dataMessError = undefined;
    }

    typeImport: number = 0;
    showTemplate: number = 0;
    ShowHideTemplate(value: any) {
        this.showTemplate = 1;
        this.typeImport = value;
        this.clearDataImport();
    }
    close() {
        this.showTemplate = 0;
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
