import {
    Component,
    EventEmitter,
    Input,
    Output,
    ViewChild,
} from '@angular/core';
import { Console } from 'console';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { TaskFileService } from 'src/app/Service/task-file.service';
import { Pf } from 'src/app/_helpers/pf';
import { AppComponent } from 'src/app/app.component';
import { FileService } from 'src/app/web/service/file.service';
import { SellOutService } from 'src/app/web/service/sell-out.service';

@Component({
    selector: 'app-sellout-detail',
    templateUrl: './sellout-detail.component.html',
    styleUrls: ['./sellout-detail.component.scss'],
})
export class SelloutDetailComponent {
    @Input() inValue: any;
    @Output() outValue = new EventEmitter<any>();
    @Output() outTotal = new EventEmitter<any>();

    constructor(
        private _service: SellOutService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private taskService: TaskFileService,
        private _file: FileService,
        private edService: EncryptDecryptService
    ) {}

    @ViewChild('myInputImage') myInputImage: any;
    clearFileInput() {
        try {
            this.myInputImage.nativeElement.value = null;
            this.url = null;
        } catch (error) {}
    }
    items: any = null;
    loading: boolean = false;
    itemsButton: any = [];
    project: any;
    projectName() {
        let _u = localStorage.getItem(EnumLocalStorage.user);
        this.project = JSON.parse(
            this.edService.decryptUsingAES256(_u)
        ).projects.filter((d: any) => d.project_id == Helper.ProjectID())[0];
    }

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.projectName();
        this.itemsButton = [
            {
                label: 'Update',
                icon: 'pi pi-refresh',
                command: () => {
                    // this.update();
                },
            },
            {
                label: 'Delete',
                icon: 'pi pi-times',
                command: () => {
                    // this.delete();
                },
            },
            {
                label: 'Angular.io',
                icon: 'pi pi-info',
                url: 'http://angular.io',
            },
            { separator: true },
            {
                label: 'Installation',
                icon: 'pi pi-cog',
                routerLink: ['/installation'],
            },
        ];

        this.responsiveOptions = [
            {
                breakpoint: '1400px',
                numVisible: 3,
                numScroll: 3,
            },
            {
                breakpoint: '1220px',
                numVisible: 2,
                numScroll: 2,
            },
            {
                breakpoint: '1100px',
                numVisible: 1,
                numScroll: 1,
            },
        ];
    }

    save(severity: string) {
        this.messageService.add({
            severity: severity,
            summary: 'Success',
            detail: 'Data Saved',
        });
    }

    products!: any[];

    statuses!: any[];
    clonedProducts: { [s: string]: any } = {};

    responsiveOptions: any;

    onRowEditSave(item: any, tab: any) {
        if (
            this.checkValue(item.quantity, 'quantity') == 1 ||
            this.checkValue(item.price, 'price') == 1
        ) {
            return;
        } else {
            console.log(
                ' ON SAVE : ',
                Helper.ProjectID(),
                item.id,
                item.quantity,
                item.price
            );

            this._service
                .SellOut_Detail_Action(
                    Helper.ProjectID(),
                    item.id,
                    item.quantity,
                    item.price
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.NofiResult(
                            'Page Works',
                            'Update product details',
                            `Update information successfully (quantity: ${item.quantity} and price: ${item.price}) product details ${item._product}`,
                            'success',
                            'SuccessFull'
                        );
                        item.total = this.total(item.quantity, item.price);
                        let sumTotal = 0;
                        this.inValue.data_sellOut.result.forEach((r: any) => {
                            if (
                                r.sellout_id == tab.sellout_id &&
                                r.UUID == tab.UUID &&
                                r.Guid == tab.Guid
                            ) {
                                r.details.forEach((d: any) => {
                                    sumTotal += d.total;
                                });
                                r.details.sumTotal = sumTotal;
                                // const listTotal = {} as any
                                const listTotal = {
                                    report_id: tab.report_id,
                                    sumTotal: r.details.sumTotal,
                                };
                                this.outTotal.emit(listTotal);
                            }
                        });
                        this.loadData(tab);
                    }
                });
        }
    }

    total(quantity: any, price: any) {
        return quantity * price;
    }

    onRowSaveConfirm(value: any) {}
    deleteImage: any = false;
    imageDelete: any;
    clickImage(image: any, listphotoImage: any) {
        this.imageDelete = image;
        // this.deleteImage = !this.deleteImage;
        this.deleteImage = true;
        try {
            listphotoImage.forEach((element: any) => {
                element.delete = 0;
            });
            image.delete = 1;
        } catch (error) {}
    }
    deleteImageDetails(event: Event, tab: any) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteImageAccept(tab);
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'You have rejected',
                });
            },
        });
    }

    deleteImageAccept(tab: any) {
        this._service
            .SellOut_Image_Action(
                Helper.ProjectID(),
                0,
                this.imageDelete._idDetails,
                this.imageDelete.src,
                'delete'
            )
            .subscribe((data: any) => {
                if ((data.result = EnumStatus.ok)) {
                    this.inValue.data_sellOut.result.forEach((r: any) => {
                        if (
                            r.sellout_id == tab.sellout_id &&
                            r.UUID == tab.UUID &&
                            r.Guid == tab.Guid
                        ) {
                            r.image.listphotoImage =
                                r.image.listphotoImage.filter(
                                    (x: any) => x.id != this.imageDelete.id
                                );
                        }
                    });
                    this.NofiResult(
                        'Page Works',
                        'Delete images',
                        'Delete successful images',
                        'success',
                        'SuccessFull'
                    );
                    this.loadData(tab);
                }
            });
    }

    product: any;
    addImageDialog: boolean = false;
    listTab: any = null;
    listDetails: any = [];
    openNew(tab: any, details: any) {
        this.listTab = tab;
        this.listDetails = details;
        this.addImageDialog = true;
        this.clearDataImage();
    }

    selectedProduct: any = null;
    // product_id: any = null
    selectProductData(event: any) {
        this.selectedProduct =
            event != null && event.value != null ? event.value : null;
        // this.product_id = (this.selectedProduct != null) ? event.value.id : null;
    }

    imageUpload: any;
    url: any = null;
    onUploadImge(event: any) {
        this.imageUpload = event.target.files[0];
        if (Helper.IsNull(this.imageUpload) != true) {
            if (
                this.NofiImage(
                    this.imageUpload.name.split('.').pop(),
                    'File image'
                ) == 1
            ) {
                this.clearFileInput();
                return;
            } else {
                let WriteLabel = this.imageUpload.name;
                this.taskService
                    .ImageRender(this.imageUpload, this.imageUpload.name)
                    .then((file) => {
                        this.imageUpload = file;

                        const formUploadImage = new FormData();
                        formUploadImage.append('files', this.imageUpload);
                        formUploadImage.append('ImageType', WriteLabel);
                        formUploadImage.append('WriteLabel', WriteLabel);

                        // this._file
                        //   .UploadImage(formUploadImage)
                        //   .subscribe((data: any) => {
                        //     if (data.result == EnumStatus.ok) {
                        //       this.url = EnumSystem.fileLocal + data.data;
                        //     } else {
                        //       this.url = null
                        //     }
                        //   });

                        const fileName = AppComponent.generateGuid();
                        const newFile = new File(
                            [this.imageUpload],
                            fileName +
                                this.imageUpload.name.substring(
                                    this.imageUpload.name.lastIndexOf('.')
                                ),
                            { type: this.imageUpload.type }
                        );
                        const modun = 'SELLOUT';
                        const drawText = WriteLabel;
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
                                },
                                (error: any) => {
                                    this.url = null;
                                }
                            );
                    });
            }
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a image upload',
            });
            return;
        }
    }

    hideDialog() {
        this.addImageDialog = false;
        this.clearDataImage();
    }
    saveImage() {
        if (
            this.NofiIsNull(this.selectedProduct, 'product id') == 1 ||
            this.NofiIsNull(this.url, 'image') == 1
        ) {
            return;
        } else {
            this._service
                .SellOut_Image_Action(
                    Helper.ProjectID(),
                    this.selectedProduct.id,
                    0,
                    this.url,
                    'create'
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.NofiResult(
                            'Page Work',
                            'More photos',
                            'Add successful images',
                            'success',
                            'SuccessFull'
                        );
                        this.hideDialog();
                        this.loadData(this.listTab);
                    }
                });
        }
    }

    clearDataImage() {
        this.clearFileInput();
        this.selectedProduct = null;
    }

    comfirm_note: any = null;

    confirmDialog: boolean = false;
    buttonMaster: boolean = false;
    tabConfirm: any = null;
    showModelConfirm(tab: any) {
        // this.tabConfirm = tab;
        // this.confirmDialog = true
        tab.buttonMaster = !tab.buttonMaster;
    }

    chooseConfirm(item: any, tab: any) {
        if (item.disible == 0) {
            this._service
                .SellOut_Result_Action(
                    Helper.ProjectID(),
                    tab.sellout_id,
                    item.Id,
                    tab.comfirm_note
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.NofiResult(
                            'Page Work',
                            'Confirm the status of the report',
                            `Confirm the status of successful reporting (Note: ${tab.comfirm_note})`,
                            'success',
                            'SuccessFull'
                        );
                        this.loadData(tab);
                    }
                });
        } else {
            return;
        }
    }

    hideDialogConfirm() {
        this.tabConfirm = null;
        this.confirmDialog = false;
    }

    loadData(tab: any) {
        this.outValue.emit(tab.report_id);
    }

    urlgallery: any;
    showImageProduct(url: any) {
        this.urlgallery = url;
        document.open(
            <string>this.urlgallery,
            'windowName',
            'height=700,width=900,top=100,left= 539.647'
        );
    }

    openImageDbClick(image: any, listphoto: any) {
        const changeindex = image.id;
        localStorage.setItem('listphoto', JSON.stringify(listphoto));
        localStorage.setItem('changeindex', JSON.stringify(changeindex));

        this.urlgallery = 'assets/ZoomImage/tool.html';
        document.open(
            <string>this.urlgallery,
            'windowName',
            'height=700,width=900,top=100,left= 539.647'
        );
    }

    checkValue(value: any, name: any): any {
        let check = 0;
        if (value < 0 || (value != 0 && Helper.IsNull(value) == true)) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: `Please enter ${name} larger or equal to 0`,
            });
            check = 1;
        }
        return check;
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

    NofiImage(value: any, name: any): any {
        let check = 0;
        if (value != 'png' && value != 'jpg' && value != 'jpeg') {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: name + ' wrong format',
            });
            check = 1;
        }
        return check;
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
            case 1:
                return 'success';
            case 0:
                return 'danger';
            default:
                return 'warning';
        }
    }
    getIconTag(value: any): any {
        switch (value) {
            case 1:
                return 'pi pi-check';
            case 0:
                return 'pi pi-times';
            default:
                return 'pi pi-exclamation-triangle';
        }
    }

    checkInfo(value: any): any {
        // <!-- info_mobile	info_name	info_address -->
        return Helper.IsNull(value.info_mobile) != true &&
            Helper.IsNull(value.info_name) != true &&
            Helper.IsNull(value.info_address) != true
            ? true
            : false;
    }
}
