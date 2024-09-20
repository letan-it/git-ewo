import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { AppComponent } from 'src/app/app.component';
import { OsaService } from 'src/app/web/service/osa.service';
import { Helper } from 'src/app/Core/_helper';
import { DatePipe } from '@angular/common';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { Pf } from 'src/app/_helpers/pf';
import { FileService } from 'src/app/web/service/file.service';
import * as FileSaver from 'file-saver';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-osa',
    templateUrl: './osa.component.html',
    styleUrls: ['./osa.component.scss'],
    providers: [ConfirmationService],
})
export class OsaComponent {
    constructor(
        private router: Router,
        private _service: OsaService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private edService: EncryptDecryptService,
        private fileService: FileService
    ) {}

    menu_id = 9;
    items_menu: any = [
        { label: ' SETTING KPI' },
        { label: ' OSA', icon: 'pi pi-box' },
    ];
    home: any = { icon: 'pi pi-chart-bar', routerLink: '/dashboard' };
    check_permissions() {
        if (JSON.parse(localStorage.getItem('menu') + '') != null) {
            const menu = JSON.parse(localStorage.getItem('menu') + '').filter(
                (item: any) => item.menu_id == this.menu_id && item.check == 1
            );
            if (menu.length > 0) {
            } else {
                this.router.navigate(['/empty']);
            }
        }
    }
    items: any;
    selectedCities: string[] = [];
    selectedQuantity: any;
    selectedPrice: any;
    selectedOOS: any;
    product_code: any;
    productFormular: any;
    confirm(event: Event, item: any) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure that you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.Ondelete(item);
            },
            reject: () => {},
        });
    }
    confirmUpdateFormular(event: Event) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure that you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.onUpdateFormular();
            },
            reject: () => {},
        });
    }
    onUpdateFormular() {
        this._service
            .File_formula_Action(
                Helper.ProjectID(),
                this.selectMonth.code,
                this.FileFormular.formular_result,
                this.FileFormular.formular_note
            )
            .subscribe((data) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Success update formular',
                });
                this.FilterFormular();
            });
    }
    Ondelete(item: any) {
        this._service
            .Product_formula_Action(
                Helper.ProjectID(),
                item.year_month,
                item.product_id + '',
                'delete'
            )
            .subscribe((data) => {
                this.FilterFormular();
            });
    }
    OnAdd() {
        this._service
            .Product_formula_Action(
                Helper.ProjectID(),
                this.selectMonth.code,
                this.product_code,
                'create'
            )
            .subscribe((data) => {
                this.FilterFormular();
                this.product_code = undefined;
            });
    }
    export_fileFormular() {
        this._service.Product_formula_DownloadFile(
            Helper.ProjectID(),
            this.selectMonth.code
        );
    }
    FilterFormular() {
        this._service
            .Product_formula_GetList(Helper.ProjectID(), this.selectMonth.code)
            .subscribe((data: any) => {
                this.productFormular = undefined;

                if (data.result == EnumStatus.ok) {
                    this.productFormular = data.data;
                }
            });
    }
    FileFormular: any;
    File_formula_GetList() {
        this._service
            .File_formula_GetList(Helper.ProjectID(), this.selectMonth.code)
            .subscribe((data: any) => {
                this.FileFormular = undefined;

                if (data.result == EnumStatus.ok) {
                    this.FileFormular = data.data[0];
                }
            });
    }
    loadFormular() {
        this.FilterFormular();
        this.File_formula_GetList();
    }

    cols!: Column[];
    exportColumns!: ExportColumn[];
    project:any 
    projectName() {
        let _u = localStorage.getItem(EnumLocalStorage.user);
        this.project = JSON.parse(
            this.edService.decryptUsingAES256(_u)
        ).projects.filter(
            (d: any) => d.project_id == Helper.ProjectID()
        )[0];
        console.log(this.project);
    }
    ngOnInit(): void {
        this.projectName();
        this.cols = [
            // { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
            {
                field: 'error_name',
                header: 'Error Name',
                customExportHeader: 'Error Name',
            },
            { field: 'product_code', header: 'Product Code' },
            { field: 'shop_code', header: 'Shop Code' },
            { field: 'target', header: 'Target' },
        ];
        this.exportColumns = this.cols.map((col: any) => ({
            title: col.header,
            dataKey: col.field,
        }));

        this.check_permissions();
        this.items = [
            // {
            //     label: 'Osa',
            //     icon: 'pi pi-box',
            //     command: () => {
            //         this.viewOSA();
            //     },
            // },
            // { separator: true },
            {
                label: 'Reason',
                icon: 'pi pi-question-circle',
                command: () => {
                    this.viewReason();
                },
            },
            { separator: true },
            {
                label: 'Product',
                icon: 'pi pi-cart-plus',
                command: () => {
                    this.viewProduct();
                },
            },
            { separator: true },
            {
                label: 'Category',
                icon: 'pi pi-briefcase',
                command: () => {
                    this.viewCategory();
                },
            },
        ];

        this.loadOsaForm();
        let newDate = new Date();
        this.PlanDate = this.getFormatedDate(newDate, 'YYYY-MM-dd');
        this.getMonth(newDate, 'MM');

        this.loadUser();
        this.loadOSAFormulaList();
        this.FilterFormular();
        this.File_formula_GetList();
    }
    add_product: boolean = false;
    quantity: boolean = false;
    price: boolean = false;
    oos: boolean = false;
    ooc: boolean = false;
    facing: boolean = false;

    ListOsaCreate: boolean = false;

    addItem(newItem: boolean) {
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Success create osa',
        });
        this.ListOsaCreate = newItem;
    }

    OSAFormAction() {
        if (this.OSAFormList.length > 0) {
            this._service
                .OSA_form_Action(
                    Helper.ProjectID(),
                    this.OSAFormList[0]._quantity == true ? 1 : 0,
                    this.OSAFormList[0]._price == true ? 1 : 0,
                    this.OSAFormList[0]._oos == true ? 1 : 0,
                    this.OSAFormList[0]._ooc == true ? 1 : 0,
                    this.OSAFormList[0]._facing == true ? 1 : 0,
                    this.OSAFormList[0]._add_product == true ? 1 : 0
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.OSAFormList = [];
                        if (data.data == 1) {
                            this.NofiResult(
                                'Page OSA',
                                'Update OSA',
                                'Update OSA Successfull',
                                'success',
                                'Successfull'
                            );
                            this.loadOsaForm();
                        }
                    }
                });
        } else {
            this.ListOsaCreate = true;
        }
    }

    clear() {
        this.add_product = false;
        this.quantity = false;
        this.price = false;
        this.oos = false;
        this.ooc = false;
        this.facing = false;
    }
    CreateOSAForm(event: any) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure that you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this._service
                    .OSA_form_Action(
                        Helper.ProjectID(),
                        this.quantity == true ? 1 : 0,
                        this.price == true ? 1 : 0,
                        this.oos == true ? 1 : 0,
                        this.ooc == true ? 1 : 0,
                        this.facing == true ? 1 : 0,
                        this.add_product == true ? 1 : 0
                    )
                    .subscribe((data: any) => {
                        if (data.result == EnumStatus.ok) {
                            this.OSAFormList = [];
                            if (data.data == 1) {
                                this.NofiResult(
                                    'Page OSA',
                                    'Create OSA',
                                    'Create OSA successfull',
                                    'success',
                                    'Successfull'
                                );
                                this.ListOsaCreate = false;
                                this.loadOsaForm();
                            }
                        }
                    });
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'You have rejected',
                });

                this.ListOsaCreate = false;
                this.loadOsaForm();
                this.clear();
                return;
            },
        });
    }

    OSAFormList: any = [];
    loadOsaForm() {
        this._service.GetOSA_form(Helper.ProjectID()).subscribe((data: any) => {
            if (data.result == EnumStatus.ok) {
                if (data.data.length > 0) {
                    this.OSAFormList = data.data;
                    this.OSAFormList = this.OSAFormList.map((item: any) => ({
                        ...item,
                        _add_product: item.add_product == 1 ? true : false,
                        _quantity: item.quantity == 1 ? true : false,
                        _price: item.price == 1 ? true : false,
                        _oos: item.oos == 1 ? true : false,
                        _ooc: item.ooc == 1 ? true : false,
                        _facing: item.facing == 1 ? true : false,
                    }));
                }
            }
        });
    }
    viewOSA() {}

    viewReason() {
        this.router.navigate(['/osa/reason']);
    }

    viewProduct() {
        this.router.navigate(['/osa/product']);
    }

    viewCategory() {
        this.router.navigate(['/osa/product/category']);
    }

    showFiter: number = 1;
    ShowHideFiter() {
        if (this.showFiter == 1) {
            this.showFiter = 0;
        } else {
            this.showFiter = 1;
        }
    }

    PlanDate: any;
    getFormatedDate(date: Date, format: string) {
        const datePipe = new DatePipe('en-US');
        return datePipe.transform(date, format);
    }

    month: any = '';
    shop_code: any = '';

    item_Product: any = 0;
    itemProduct: any = null;
    selectProduct(event: any) {
        this.itemProduct = event != null ? event : null;
        this.item_Product = event != null ? event.id : 0;
    }

    item_yearMonth: any = 0;
    selectYearMonth(event: any) {
        console.log(
            '🚀 ~ file: osa.component.ts:329 ~ OsaComponent ~ selectYearMonth ~ event:',
            event
        );
        this.item_yearMonth = event != null ? event : 0;
        console.log(
            '🚀 ~ file: osa.component.ts:331 ~ OsaComponent ~ selectYearMonth ~ this.item_yearMonth:',
            this.item_yearMonth
        );
    }

    selectMonth: any;
    ListMonth: any = [];

    getMonth(date: Date, format: string) {
        const today = new Date();
        const year = today.getFullYear();
        const monthToday = today.getMonth() + 1;
        const datePipe = new DatePipe('en-US');
        let monthNow = parseInt(datePipe.transform(date, format) as any) || 0;
        if (monthNow < 12) {
            monthNow++;
        }
        const dataMonth = Helper.getMonth();
        this.ListMonth = dataMonth.ListMonth;

        // const monthString = monthToday.toString().padStart(2, '0');
        // if (Helper.IsNull(this.selectMonth) == true) {
        //     this.selectMonth = {
        //         name: `${year} - Tháng ${monthToday}`,
        //         code: parseInt(year + monthString),
        //         month: monthToday,
        //     };
        // }
        const monthString = monthToday.toString().padStart(2, '0');
        const currentDate = parseInt(year + monthString);
        if (Helper.IsNull(this.selectMonth) == true) {
            this.selectMonth = this.ListMonth?.find(
                (i: any) => i?.code == currentDate
            );
        }
        this.month = year + monthString;
        console.log('month', this.ListMonth);
    }

    ListOsaShop: any = [];
    isLoading_Filter: boolean = false;

    filter(pageNumber: number) {
        if (pageNumber == 1) {
            this.first = 0;
            this.totalRecords = 0;
            // this.rows  = 20;
            this._pageNumber = 1;
        }

        this.ListOsaShop = [];
        this.isLoading_Filter = true;

        this._service
            .OSA_Shop_GetList(
                Helper.ProjectID(),
                Helper.IsNull(this.selectMonth) == true
                    ? this.month
                    : this.selectMonth.code,
                this.item_Product,
                this.shop_code,
                this.rows,
                pageNumber
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    if (data.data.length > 0) {
                        this.ListOsaShop = data.data;
                        this.totalRecords = this.ListOsaShop[0].TotalRows;

                        this.isLoading_Filter = false;
                    } else {
                        this.isLoading_Filter = false;
                        // this.message = 'No data';
                        // this.display = true;
                    }
                }
                console.log(this.ListOsaShop);
            });
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

    showTemplate: number = 0;
    ShowHideTemplate() {
        if (this.showTemplate == 1) {
            this.showTemplate = 0;
        } else {
            this.showTemplate = 1;
        }
    }
    showTemplateFormular: number = 0;
    ShowHideTemplateFormular() {
        if (this.showTemplateFormular == 1) {
            this.showTemplateFormular = 0;
        } else {
            this.showTemplateFormular = 1;
        }
    }

    fileTemplete!: any;
    onChangeFile(event: any) {
        this.dataError = undefined;
        this.dataMessError = undefined;
        this.fileTemplete = event.target.files[0];
    }
    fileTempleteFormular!: any;
    onChangeFileFormular(event: any) {
        this.fileTempleteFormular = event.target.files[0];
    }

    @ViewChild('myInput') myInput: any;

    clearFileInput() {
        this.dataError = undefined;
        this.dataMessError = undefined;
        this.myInput.nativeElement.value = null;
        this.fileTemplete = undefined;
    }

    dataError: any;
    dataMessError: any;

    exportTemplate() {
        this._service.OSA_Shop_GetTemplate(Helper.ProjectID());
    }
    importTemplateFormular() {
        if (this.fileTempleteFormular == undefined) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a file',
            });

            return;
        }

        if (Helper.IsNull(this.selectMonth) == true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a month',
            });
            return;
        }
        const formDataUpload = new FormData();
        formDataUpload.append('files', this.fileTempleteFormular);
        formDataUpload.append('project_id', Helper.ProjectID().toString());
        formDataUpload.append('year_month', this.selectMonth.code);

        this._service.CreateFormular(formDataUpload).subscribe((data: any) => {
            if (data.result == EnumStatus.ok) {
                this.File_formula_GetList();
            }
        });
    }
    importTemplate() {
        if (this.fileTemplete == undefined) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a file',
            });

            return;
        }

        if (Helper.IsNull(this.selectMonth) == true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a month',
            });
            return;
        }
        // return
        const formDataUpload = new FormData();
        formDataUpload.append('files', this.fileTemplete);
        formDataUpload.append('year_month', this.selectMonth.code);

        this._service
            .OSA_Shop_ImportData(formDataUpload, Helper.ProjectID())
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    if (data.data.result_ewo_type_OSAShop.length > 0) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Successful OSA registration',
                        });

                        // let newDate = new Date();
                        // this.PlanDate = this.getFormatedDate(newDate, 'YYYY-MM-dd');
                        // this.getMonth(newDate, 'MM');
                        this.clearFileInput();
                        this.filter(1);
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Error OSA registration',
                        });
                    }
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
            });
    }

    export() {
        this._service.OSA_Shop_RawData(
            Helper.ProjectID(),
            Helper.IsNull(this.selectMonth) == true
                ? this.month
                : this.selectMonth.code,
            this.shop_code
        );
    }

    OSAformulaDialog: boolean = false;

    OSAFormulaList!: any[];

    OSAFormula!: any;

    selectedOSAFormula!: any[] | null;

    submitted: boolean = false;

    listYearMonth!: any[];
    action: any = 'create';

    loadOSAFormulaList() {
        this._service
            .GetOSA_formula(
                Helper.ProjectID(),
                Helper.IsNull(this.selectMonth) == true
                    ? 0
                    : this.selectMonth.code
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    if (data.data.length > 0) {
                        this.OSAFormulaList = data.data;
                        this.OSAFormulaList = this.OSAFormulaList.map(
                            (item: any) => ({
                                ...item,
                                history: JSON.parse(item.history),
                            })
                        );
                    } else {
                        this.OSAFormulaList = [];
                    }
                }
            });
    }

    openNew() {
        this.OSAFormula = {};
        this.submitted = false;
        this.OSAformulaDialog = true;
        this.action = 'create';
    }

    deleteSelectedhistorys() {
        this.confirmationService.confirm({
            message:
                'Are you sure you want to delete the selected OSAFormulaList?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.OSAFormulaList = this.OSAFormulaList.filter(
                    (val) => !this.selectedOSAFormula?.includes(val)
                );
                this.selectedOSAFormula = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'historys Deleted',
                    life: 3000,
                });
            },
        });
    }

    editOSAFormula(OSAFormula: any) {
        this.OSAFormula = { ...OSAFormula };
        this.OSAformulaDialog = true;
        this.action = 'update';

        this.OSAFormula.year_month = this.ListMonth.filter(
            (data: any) => data.code == OSAFormula.year_month + ''
        )[0];
    }

    deleteOSAFormula(OSAFormula: any) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + OSAFormula.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.OSAFormulaList = this.OSAFormulaList.filter(
                    (val) => val.id !== OSAFormula.id
                );
                this.OSAFormula = {};
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Deleted',
                    life: 3000,
                });
            },
        });
    }

    hideDialog() {
        this.OSAformulaDialog = false;
        this.submitted = false;
    }

    linkUrl: any;
    fileUrl: any;

    upload_file_url(event: any) {
        this.linkUrl = '';
        this.fileUrl = event.target.files[0];

        if (this.fileUrl != undefined && this.fileUrl != null) {
            if (
                this.checkFileUrl(
                    this.fileUrl.name.toString().split('.').pop(),
                    'Formula File'
                ) == 1
            ) {
                this.OSAFormula.formula_file = undefined;
                return;
            } else {
                const formDataUpload = new FormData();
                formDataUpload.append('files', this.fileUrl);
                formDataUpload.append('ImageType', 'OSAFormula');

                // this.fileService
                //     .UploadFile(formDataUpload)
                //     .subscribe((data: any) => {
                //         if (data.result == EnumStatus.ok) {
                //             this.clearFileInputUrl();
                //             this.linkUrl = EnumSystem.fileLocal + data.data;
                //             this.OSAFormula.formula_file =
                //                 EnumSystem.fileLocal + data.data;
                //         }
                //     });

                    const fileName = AppComponent.generateGuid();
                    const newFile = new File([this.fileUrl], fileName+this.fileUrl.name.substring(this.fileUrl.name.lastIndexOf('.')),{type: this.fileUrl.type});
                    const modun = 'OSA-FORMULA';
                    const drawText = this.currentUser.projects[0].project_code;
                    this.fileService.FileUpload(newFile, this.project.project_code,modun, drawText).subscribe(
                        (response : any) => {      

                            this.clearFileInputUrl();
                            this.linkUrl = response.url;  
                            this.OSAFormula.formula_file =response.url;  

                        },
                        (error : any) => { 
                        
                        }
                    );
            }
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a formula file',
            });
            return;
        }
    }

    checkFileUrl(value: any, name: any): any {
        let check = 0;
        if (value != 'js') {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: name + ' wrong format',
            });
            check = 1;
        }
        return check;
    }

    @ViewChild('myInputFileUrl') myInputFileUrl: any;
    clearFileInputUrl() {
        this.myInputFileUrl.nativeElement.value = null;
        this.fileUrl = undefined;
    }

    saveOSAFormula() {
        this.submitted = true;

        if (this.NofiIsNull(this.OSAFormula.year_month, 'year month') == 1) {
            return;
        } else {
            if (
                this.NofiIsNull(this.OSAFormula.formula_file, 'formula file') ==
                1
            ) {
                return;
            } else {
                this._service
                    .OSA_formula_Action(
                        Helper.ProjectID(),
                        this.action == 'create' ? 0 : this.OSAFormula.id,
                        this.OSAFormula.year_month.code,
                        this.OSAFormula.formula_file,
                        this.action
                    )

                    .subscribe((data: any) => {
                        if ((data.result = EnumStatus.ok)) {
                            this.NofiResult(
                                'Page OSA',
                                this.action,
                                this.action == 'create'
                                    ? `Successfully creating the file ${this.OSAFormula.formula_file} for ${this.OSAFormula.year_month.name}`
                                    : `Successfully editing files ${this.OSAFormula.formula_file} for ${this.OSAFormula.year_month.name} `,
                                'success',
                                'Successfull'
                            );

                            data.data = data.data.map((item: any) => ({
                                ...item,
                                history: JSON.parse(item.history),
                            }));
                            this.clearOSAFormula(data.data);
                        }
                    });
            }
        }
    }

    clearOSAFormula(data: any) {
        // this.OSAFormulaList = [...this.OSAFormulaList];
        // this.OSAFormula = {}

        this.OSAFormulaList = data;
        this.OSAformulaDialog = false;
        this.OSAFormula = {};
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.OSAFormulaList.length; i++) {
            if (this.OSAFormulaList[i].id === id) {
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

    historys: any;
    selectedHistorys: any;

    // event: TableRowSelectEvent, op: OverlayPanel
    onRowSelect(event: any, op: any) {
        this.messageService.add({
            severity: 'info',
            summary: 'Product Selected',
            detail: event.data.name,
        });
        op.hide();
    }

    visible: boolean = false;
    target: any = undefined;

    showDialog() {
        this.visible = true;
    }

    Update() {
        if (
            this.NofiIsNull(this.selectMonth, 'year month') == 1 ||
            this.NofiIsNullTypeNumber(this.item_Product, 'product') == 1 ||
            this.NofiIsNull(this.shop_code, 'shop code') == 1 ||
            this.NofiIsNull(this.target, 'target') == 1 ||
            this.checkNumber(this.target, 'Target') == 1
        ) {
            return;
        } else {
            this._service
                .OSA_Shop_Action(
                    Helper.ProjectID(),
                    Helper.IsNull(this.selectMonth) == true
                        ? this.month
                        : this.selectMonth.code,
                    this.item_Product,
                    this.shop_code,
                    this.target
                )
                .subscribe((data: any) => {
                    if ((data.result = EnumStatus.ok)) {
                        this.visible = false;
                        this.NofiResult(
                            'Page OSA',
                            'Update OSA_Shop',
                            `Successfully edited the target = ${this.target} of the product code
                    (${this.itemProduct.product_code}) for shops code (${this.shop_code}) in ${this.selectMonth.name}`,
                            'success',
                            'Successfull'
                        );
                        this.clearForm();
                        this.filter(1);
                    }
                });
        }
    }
    clearForm() {
        this.target = undefined;
    }

    user_profile: any;
    currentUser: any;
    userProfile: any;

    loadUser() {
        let _u = localStorage.getItem(EnumLocalStorage.user);

        this.currentUser = JSON.parse(this.edService.decryptUsingAES256(_u));
        this.currentUser.employee[0]._status =
            this.currentUser.employee[0].status == 1 ? true : false;
        this.userProfile = this.currentUser.employee[0];
    }

    NofiIsNullTypeNumber(value: any, name: any): any {
        let check = 0;
        // if (value == 0) {
        //     check = 0
        // } else {
        if (
            Helper.IsNullTypeNumber(value) == true ||
            Pf.checkSpace(value) != true
        ) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a ' + name,
            });
            check = 1;
        }
        // }
        return check;
    }
    NofiIsNull(value: any, name: any): any {
        let check = 0;
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

    checkNumber(value: any, name: any): any {
        if (Helper.number(value) != true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: name + ' wrong format',
            });
            return 1;
        }
        return 0;
    }

    FormatYearMonth(value: any): any {
        return (
            value.toString().slice(0, 4) +
            ' - Tháng ' +
            value.toString().slice(4, 6)
        );
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

    // 'xlsx'
    exportExcel() {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(this.dataError);
            const workbook = {
                Sheets: { data: worksheet },
                SheetNames: ['data'],
            };
            const excelBuffer: any = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array',
            });
            this.saveAsExcelFile(excelBuffer, 'osa_shop');
        });
    }

    saveAsExcelFile(buffer: any, fileName: string): void {
        let EXCEL_TYPE =
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE,
        });
        FileSaver.saveAs(
            data,
            fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
        );
    }
}
