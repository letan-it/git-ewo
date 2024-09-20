import {
    Component,
    Input,
    OnInit,
    OnChanges,
    SimpleChanges,
    ViewChild,
    Output,
    EventEmitter,
    ChangeDetectorRef,
} from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MessageService } from 'primeng/api';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { Pf } from 'src/app/_helpers/pf';
import { PromotionService } from 'src/app/web/service/promotion.service';
import { SurveyService } from 'src/app/web/service/survey.service';
import { ConfirmationService } from 'primeng/api';
import { AppComponent } from 'src/app/app.component';
import * as FileSaver from 'file-saver';
import { TaskFileService } from 'src/app/Service/task-file.service';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { FileService } from 'src/app/web/service/file.service';
import { ProductService } from 'src/app/web/service/product.service';
import { ActivationService } from 'src/app/web/service/activation.service';
import { GiftsService } from 'src/app/web/service/gifts.service';

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
    selector: 'app-promotion-details',
    templateUrl: './promotion-details.component.html',
    styleUrls: ['./promotion-details.component.scss'],
    providers: [ConfirmationService, MessageService],
})
export class PromotionDetailsComponent implements OnInit, OnChanges {
    @Input() data: any;
    @Output() outValue = new EventEmitter<any>();

    constructor(
        private _service: ActivationService,
        private _serviceSurvey: SurveyService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private edService: EncryptDecryptService,
        private _file: FileService,
        private carService_Product: ProductService,
        private carService_Gift: GiftsService,
        private cdr: ChangeDetectorRef
    ) {}

    tap: number = 0;

    promotion_id!: number;
    promotion_Code!: any;
    promotion_group!: any;
    promotion_name!: any;
    description!: any;
    formula!: any;
    survey!: number;
    status!: number;
    product!: number;
    desc_image!: any;
    create_name!: any;
    created_date!: any;
    update_date!: any;
    update_name!: any;
    // detail
    dataProduct!: any[];
    dataSurvey!: any[];
    // product
    inputAction: any;
    mindata: number = 1;
    maxdata: any = null;
    product_target: any = null;
    chooseAction!: string;
    listSurvey: any;
    buttons!: any[];

    statuses: any = [
        {
            title: 'Active',
            value: 1,
        },
        {
            title: 'In Active',
            value: 0,
        },
    ];

    // setup config library
    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        minHeight: '5rem',
        translate: 'no',
        placeholder: 'Enter text here...',
        defaultParagraphSeparator: 'p',
        defaultFontName: 'Arial',

        customClasses: [
            {
                name: 'quote',
                class: 'quote',
            },
            {
                name: 'redText',
                class: 'redText',
            },
            {
                name: 'titleText',
                class: 'titleText',
                tag: 'h1',
            },
        ],
    };

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['data'] && this.data !== undefined) {
            this.promotion_id = this.data.promotion_id;
            this.promotion_Code = this.data.promotion_code;
            this.promotion_group = this.data.promotion_group;
            this.promotion_name = this.data.promotion_name;
            this.description = this.data.description;
            this.formula = this.data.formula;
            this.survey = this.data.survey;
            this.status = this.data.status;
            this.status = this.data.status;
            this.product = this.data.product;
            this.desc_image = this.data.desc_image
                ? this.data.desc_image
                : EnumSystem.noImage;
            this.create_name = this.data.create_name;
            this.created_date = this.data.created_date;
            this.update_name = this.data.update_name;
            this.update_date = this.data.update_date;

            this.getItemPromotion();
        }

        this.getData();
    }

    cols!: Column[];
    exportColumns!: ExportColumn[];
    project: any;
    projectName() {
        let _u = localStorage.getItem(EnumLocalStorage.user);
        this.project = JSON.parse(
            this.edService.decryptUsingAES256(_u)
        ).projects.filter((d: any) => d.project_id == Helper.ProjectID())[0];
    }
    ngOnInit(): void {
        this.projectName();
        this.loadUser();
        this.checkActionUser();

        this.cols = [
            // { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
            {
                field: 'error_name',
                header: 'Error Name',
                customExportHeader: 'Error Name',
            },
            { field: 'promotion_id', header: 'Promotion Id' },
            { field: 'item_data', header: 'Item Data' },
            { field: 'survey_id', header: 'Survey Id' },
            { field: 'product_id', header: 'Product Id' },
            { field: 'min_data', header: 'Min Data' },
            { field: 'max_data', header: 'Max Data' },
        ];
        this.exportColumns = this.cols.map((col: any) => ({
            title: col.header,
            dataKey: col.field,
        }));

        this._serviceSurvey
            .ewo_GetSurveyList(Helper.ProjectID())
            .subscribe((res: any) => {
                if (res.result == EnumStatus.ok) {
                    res.data = res.data.filter((x: any) => x.status == 1);
                    this.listSurvey = res.data?.map((i: any) => ({
                        name: `[${i.survey_id}] - ${i.survey_name}`,
                        code: i.survey_id,
                    }));
                }
            });

        this.buttons = [
            {
                label: 'Update',
                icon: 'pi pi-refresh',
                command: () => {
                    this.actionSubmit();
                },
            },
            {
                label: 'Delete',
                icon: 'pi pi-times',
                command: () => {
                    this.confirmDelete();
                },
            },
        ];
    }

    getData() {
        // this.promotion_id = this.data?.promotion_id
        // this._service.Promotion_item_GetList(Helper.ProjectID(), this.data?.promotion_id).subscribe((res: any) => {
        //   if (res.result == EnumStatus.ok) {
        //     res.data = res.data.map((x: any) => ({
        //       ...x,
        //       tooltip: x.update_by != null ? `Update By : [${x.update_by}] - ${x.update_code} - ${x.update_name} Time : ${x.update_date}` : null
        //     }))
        //     this.dataProduct = res.data.filter((e: any) => e.item_data == 'PRODUCT')
        //     this.dataSurvey = res.data.filter((e: any) => e.item_data == 'SURVEY')
        //   }
        // })
    }

    showDescription: boolean = false;
    showDescript() {
        this.showDescription = !this.showDescription;
    }

    actionSubmit(): void {
        if (this.tap === 0) {
            this.handleActionProduct('create.update');
        } else {
            this.handleActionGift('create.update');
        }
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

    checkMinMax(min: number, max: any) {
        let check = 0;
        if (min != null && max != null && max != '') {
            if (!Pf.IsNumber(min) && !Pf.IsNumber(max)) {
                if (min > max) {
                    check = 1;
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Warning',
                        detail: 'Min cannot be larger than Max !',
                    });
                }
            } else {
                check = 1;
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: name + 'not number!',
                });
            }
        }

        return check;
    }

    handleActionProduct(action: string) {
        if (
            this.NofiIsNull(this.inputAction, 'list product') == 1 ||
            this.checkDuplicates(
                this.inputAction.split(' ').filter((e: any) => e != ''),
                'Duplicate product code '
            ) == 1
        ) {
            return;
        } else {
            this._service
                .Promotion_product_Action(
                    Helper.ProjectID(),
                    0,
                    this.promotion_id,
                    this.inputAction,
                    action
                )
                .subscribe((res: any) => {
                    if (res.result == EnumStatus.ok) {
                        this.getData();
                        if (action == 'create.update') {
                            this.NofiResult(
                                'Page Promotion',
                                'Create/Update promotion item',
                                `Successfully edited product
             ${this.inputAction} in item promotion `,
                                'success',
                                'Successfull'
                            );
                            this.clearInputProduct();
                        } else {
                            this.NofiResult(
                                'Page Promotion',
                                'Delete promotion item',
                                `Successfully delete product 
            ${this.inputAction} in item promotion `,
                                'success',
                                'Successfull'
                            );
                            this.clearInputProduct();
                        }
                        this.getItemPromotion();
                    }
                });
        }
    }

    clearInputProduct() {
        this.inputAction = null;
    }

    handleActionGift(action: string) {
        if (
            this.NofiIsNull(this.inputAction, 'list gift') == 1 ||
            this.checkDuplicates(
                this.inputAction.split(' ').filter((e: any) => e != ''),
                'Duplicate gift code '
            ) == 1
        ) {
            return;
        } else {
            this._service
                .Promotion_gift_Action(
                    Helper.ProjectID(),
                    0,
                    this.promotion_id,
                    this.inputAction,
                    action
                )
                .subscribe((res: any) => {
                    if (res.result == EnumStatus.ok) {
                        if (action == 'create.update') {
                            this.NofiResult(
                                'Page Promotion',
                                'Update promotion',
                                `Successfully edited gift in item promotion `,
                                'success',
                                'Successfull'
                            );
                            this.clearInputGift();
                        } else {
                            this.NofiResult(
                                'Page Promotion',
                                'Delete promotion',
                                `Successfully delete gift item promotion `,
                                'success',
                                'Successfull'
                            );
                            this.clearInputGift();
                        }

                        this.getItemPromotion();
                    }
                });
        }
    }

    clearInputGift() {
        this.inputAction = null;
    }

    deleteProduct() {
        this.handleActionProduct('delete');
    }

    first = 0;
    rows = 10;
    pageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
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

    checkDuplicates(value: any, name: any): any {
        let check = 0;
        if (Helper.checkDuplicates(value) != null) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: `${name} : ${Helper.checkDuplicates(value)}`,
            });
            check = 1;
        } else {
            check = 0;
        }
        return check;
    }

    // action survey
    confirmDelete() {
        if (this.NofiIsNull(this.inputAction, 'input') == 1) {
            return;
        }

        this.confirmationService.confirm({
            message: 'Are you sure that you want to proceed?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if (this.tap == 0) {
                    this.deleteProduct();
                } else {
                    this.deleteSurvey();
                }
            },
        });
    }

    onChangeTab(e: any) {
        this.tap = e.index;
    }

    deleteSurvey() {
        this.handleActionGift('delete');
    }

    typeImport: number = 0;
    showTemplate: number = 0;
    ShowHideTemplate(value: any) {
        if (this.showTemplate == 0) {
            this.showTemplate = 1;
            this.typeImport = value;
            this.clearDataImport();
        } else {
            this.showTemplate = 0;
        }
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
    dataError: any;
    dataMessError: any;
    clearDataImport() {
        this.dataError = undefined;
        this.dataMessError = undefined;
    }

    getTemplate() {
        this._service.Promotion_item_GetTemplate(Helper.ProjectID());
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
                .Promotion_item_ImportData(formDataUpload, Helper.ProjectID())
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.NofiResult(
                            'Page Promotion',
                            'Add Promotion Item',
                            'Add Promotion Item Successfull',
                            'success',
                            'Successfull'
                        );
                        // this.handleFilter()
                        this.outValue.emit(true);
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

    @ViewChild('myInputFormulaFile') myInputImage: any;
    clearFormulaFile() {
        try {
            this.myInputImage.nativeElement.value = null;
        } catch (error) {}
    }

    fileUpload: any;
    url: any = '';
    onUploadFormulaFile(event: any, promotion_id: any, promotion_Code: any) {
        this.fileUpload = event.target.files[0];
        if (Helper.IsNull(this.fileUpload) != true) {
            if (
                this.NofiFileUpload(
                    this.fileUpload.name.split('.').pop(),
                    'Formula File'
                ) == 1
            ) {
                this.clearFormulaFile();
                this.url = null;
                return;
            } else {
                const formUploadImage = new FormData();
                formUploadImage.append('files', this.fileUpload);
                formUploadImage.append(
                    'ImageType',
                    `${promotion_Code}_FORMULAR`
                );

                // this._file
                //   .UploadFile(formUploadImage)
                //   .subscribe((data: any) => {
                //     if (data.result == EnumStatus.ok) {
                //       this.url = EnumSystem.fileLocal + data.data;

                //       this._service.Promotion_UploadFile(promotion_id, this.url)
                //         .subscribe((data: any) => {
                //           if (data.result == EnumStatus.ok) {
                //             this.formula = this.url

                //             this.NofiResult('Page Promotion', 'Edit Formula file of Promotion',
                //               'Edit the Formula file of Promotion Success', 'success', 'SuccessFull');
                //           } else {
                //             this.NofiResult('Page Promotion', 'Edit Formula file of Promotion',
                //               'Edit the Formula file of Promotion Error', 'error', 'Error');
                //           }
                //           this.clearFormulaFile();
                //         })
                //     } else {
                //       this.url = null;
                //       this.clearFormulaFile();
                //     }
                //   });

                const fileName = AppComponent.generateGuid();
                const newFile = new File(
                    [this.fileUpload],
                    fileName +
                        this.fileUpload.name.substring(
                            this.fileUpload.name.lastIndexOf('.')
                        ),
                    { type: this.fileUpload.type }
                );
                const modun = `${promotion_Code}_FORMULAR`;
                const drawText = `${promotion_Code}_FORMULAR`;
                this._file
                    .FileUpload(
                        newFile,
                        this.project.project_code,
                        modun,
                        drawText
                    )
                    .subscribe(
                        (response: any) => {
                            this.url = response.url;

                            this._service
                                .Promotion_UploadFile(promotion_id, this.url)
                                .subscribe((data: any) => {
                                    if (data.result == EnumStatus.ok) {
                                        this.formula = this.url;

                                        this.NofiResult(
                                            'Page Promotion',
                                            'Edit Formula file of Promotion',
                                            'Edit the Formula file of Promotion Success',
                                            'success',
                                            'SuccessFull'
                                        );
                                    } else {
                                        this.NofiResult(
                                            'Page Promotion',
                                            'Edit Formula file of Promotion',
                                            'Edit the Formula file of Promotion Error',
                                            'error',
                                            'Error'
                                        );
                                    }
                                    this.clearFormulaFile();
                                });
                        },
                        (error: any) => {
                            this.url = null;
                            this.clearFormulaFile();
                        }
                    );
            }
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a file upload',
            });
            return;
        }
    }

    currentUser: any;
    userProfile: any;
    loadUser() {
        let _u = localStorage.getItem(EnumLocalStorage.user);
        this.currentUser = JSON.parse(this.edService.decryptUsingAES256(_u));
        this.currentUser.employee[0]._status =
            this.currentUser.employee[0].status == 1 ? true : false;
        this.userProfile = this.currentUser.employee[0];
    }
    checkAction: boolean = false;
    checkActionUser(): any {
        if (Helper.IsNull(this.userProfile) != true) {
            this.checkAction =
                this.userProfile.employee_type_id == 1 ? true : false;
        } else {
            this.checkAction = false;
        }
    }

    NofiFileUpload(value: any, name: any): any {
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

    // 'jspdf' - 'jspdf-autotable'
    exportPdf(title: any, value: any) {
        import(title).then((jsPDF) => {
            import(value).then((x) => {
                const doc = new jsPDF.default('p', 'px', 'a4');
                (doc as any).autoTable(this.exportColumns, this.dataError);
                doc.save('products.pdf');
            });
        });
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
            this.saveAsExcelFile(excelBuffer, 'promotion');
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

    getSeverity(value: any): any {
        switch (value) {
            case 0:
                return 'danger';
            case 1:
                return 'success';
            default:
                return 'warning';
        }
    }

    //////////////////////////// PICK LIST ///////////////////////////

    sourceProducts: any = [];
    targetProducts: any = [];

    getItemPromotion() {
        this._service
            .Promotion_item_GetList(Helper.ProjectID(), this.promotion_id)
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.targetGifts = data.data.gift;
                    this.targetProducts = data.data.product;
                    this.setUpPickUp_Product();
                    this.setUpPickUp_Gift();
                }
            });
    }
    setUpPickUp_Product() {
        this.carService_Product
            .ewo_Products_GetList(
                Helper.ProjectID(),
                '',
                '',
                0,
                '',
                10000000,
                1
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.targetProducts.forEach((element: any) => {
                        data.data = data.data.filter(
                            (x: any) => x.product_id != element.product_id
                        );
                    });
                    this.sourceProducts = data.data;
                    // console.log('this.sourceProducts : ', this.sourceProducts);
                    this.cdr.markForCheck();
                }
            });
    }

    sourceGifts: any = [];
    targetGifts: any = [];
    setUpPickUp_Gift() {
        this.carService_Gift
            .gifts_GetList(100000, 1, Helper.ProjectID(), '', '', '', -1)
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.targetGifts.forEach((element: any) => {
                        data.data = data.data.filter(
                            (x: any) => x.id != element.gift_id
                        );
                    });
                    this.sourceGifts = data.data;
                    // console.log('this.sourceGifts : ', this.sourceGifts);

                    this.cdr.markForCheck();
                }
            });
    }

    clickProductAction(event: any) {
        console.log('this.targetProducts : ', this.targetProducts);
    }
}
