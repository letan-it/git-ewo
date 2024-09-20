import {
    Component,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { Galleria } from 'primeng/galleria';
import { retry } from 'rxjs';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { TaskFileService } from 'src/app/Service/task-file.service';
import { Pf } from 'src/app/_helpers/pf';
import { FileService } from 'src/app/web/service/file.service';
import { OolService } from 'src/app/web/service/ool.service';
import { OsaService } from 'src/app/web/service/osa.service';
import { PosmService } from 'src/app/web/service/posm.service';
import { ReportsService } from 'src/app/web/service/reports.service';
import { SurveyService } from 'src/app/web/service/survey.service';
import { InventoryService } from '../../pages/inventory/service/inventory.service';
import { SosService } from '../../pages/sos/services/sos.service';
import { AppComponent } from 'src/app/app.component';
import { ActivationService } from 'src/app/web/service/activation.service';
import { FieldCoachingService } from 'src/app/web/service/field-coaching.service';
interface Country {
    title: string;
    url: string;
    code: number;
}

@Component({
    selector: 'app-control-tab-photo',
    templateUrl: './control-tab-photo.component.html',
    styleUrls: ['./control-tab-photo.component.scss'],
    providers: [ConfirmationService, MessageService, DialogModule],
})
export class ControlTabPhotoComponent implements OnInit {
    constructor(
        private _service: ReportsService, 
        private _serviceSurvey: SurveyService,
        private _servicePOSM: PosmService,
        private _serviceOSA: OsaService,
        private _serviceOOL: OolService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private taskService: TaskFileService,
        private _file: FileService,
        private edService: EncryptDecryptService,
        private InvenService: InventoryService,
        private SosService: SosService,
        private activationService: ActivationService,
        private fieldCoachingService: FieldCoachingService
    ) { }
    activeIndex: number = 0;
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['inValue']) {
            if (this.inValue != undefined) {
                console.log(this.images);
                this.images = this.inValue.filter(
                    (x: any) => x.question_type == 'image'
                );

                if (this.KPI == 'INVENTORY') {
                    this.images = (Helper.IsNull(this.inValue)) != true ? this.inValue : []
                }

                if (this.KPI == 'SOS') {
                    this.images = (Helper.IsNull(this.inValue)) != true ? this.inValue : []
                }

                if (this.KPI == 'FIELDCOACHING') {
                    this.images = (Helper.IsNull(this.inValue)) != true ? this.inValue : []
                }

                this.audios = this.inValue.filter(
                    (x: any) => x.question_type == 'audio'
                );
                this.videos = this.inValue.filter(
                    (x: any) => x.question_type == 'video'
                );

                this.inValue = { audio: [], image: [] };
                this.inValue = { audio: this.audios, image: this.images, video: this.videos };

                if (this.audios.length > 0 && this.images.length == 0) {
                    this.activeIndex = 1
                }

                this.countries = [];
                this.audios.forEach((element: any) => {
                    const country = {
                        title: element.title,
                        url: element.url,
                        code: element.id,
                    };
                    this.countries.push(country);
                });
            }
        }
    }
    currentUser: any;
    permission_full = 0;
    project:any 
    projectName () {
        let _u = localStorage.getItem(EnumLocalStorage.user);
        this.project = JSON.parse(
            this.edService.decryptUsingAES256(_u)
        ).projects.filter(
            (d: any) => d.project_id == Helper.ProjectID()
        )[0];
    }

    ngOnInit(): void {
        this.projectName();
        let _u = localStorage.getItem(EnumLocalStorage.user);
        this.currentUser = JSON.parse(
            this.edService.decryptUsingAES256(_u)
        ).employee[0];

        if (
            this.currentUser.employee_type_id == 1 ||
            this.currentUser.employee_type_id == 2 ||
            this.currentUser.employee_type_id == 3
        ) {
            this.permission_full = 1;
        } else {
            this.permission_full = 0;
        }
        try {
            this.LoadInvenImageType(Helper.ProjectID(), this.fulldata.report_id);
        } catch (error) {}
        try {
            this.LoadSOSImageType(Helper.ProjectID(), this.fulldata.report_id);
        } catch (error) {}
        try {
            this.LoadFieldCoachingImageType(Helper.ProjectID(), this.fulldata.report_id);
        } catch (error) {}
        this.isCheckNotGdm = this.checkNotGdm(Helper.ProjectID()); 
    }
    isCheckNotGdm : boolean = true;
    checkNotGdm (project_id: any ) : any{
        return (project_id != 23) ? true : false;
    }
    currentPhoto: any;
    GetImagePhoto(item: any) {
        this.currentPhoto = item;
    }
    removeItem(idToRemove: number) {
        try {
            this.inValue.image = this.inValue.image.filter(
                (item: any) => item.id !== idToRemove
            );

            this.images = this.images.filter((item: any) => item.id !== idToRemove);

        } catch (error) { }
    }

    selectedcofigImage: any;
    selectedcofigImagePOSM: any;
    selectedcofigImageOSA: any;
    selectedcofigImageOOL: any;

    selectedcofigImageINVENTORY: any;
    selectedcofigDetailINVENTORY: any;
    selectedcofigImageSOS: any;
    selectedcofigDetailSOS: any;
    selectedcofigImageFIELDCOACHING: any;
    selectedcofigDetailFIELDCOACHING: any;

    confirm(event: Event) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure that you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => { 
                this.deletePhoto(this.currentPhoto.id);

                this.messageService.add({
                    severity: 'success',
                    summary: 'Delete images successfully',
                    detail: 'Delete images successfully',
                });
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
    imageUpload!: any;
    item_ImageType: number = 0;
    item_NameVN_ImageType: any = "";
    selectImageType(event: any) {
        this.item_ImageType = event != null ? event.Id : 0;
        this.item_NameVN_ImageType = event != null ? event.NameVN : "";
    }

    allowUploadProductFile: boolean = false;
    allowChooseProductDetail: boolean = false;
    allowUploadSOSFile: boolean = false;
    allowChooseSOSDetail: boolean = false;
    allowChooseFIELDCOACHINGDetail: boolean = false;
    allowUploadFIELDCOACHINGFile: boolean = false;

    listInvenImageType: any = null;
    listInvenImageTypes: any = [];
    selectedInvenImageType(event: any) {
        if (event.value?.Id === 1) {
            this.allowChooseProductDetail = true;
            this.allowUploadProductFile = true;
        } else if (event.value?.Id !== 1) {
            this.allowChooseProductDetail = false;
            this.allowUploadProductFile = true;
        } 
    }
    clearInvenDetail(event: any) {
        this.allowChooseProductDetail = false;
    }

    listSOSImageType: any = null;
    listSOSImageTypes: any = [];
    selectedSOSImageType(event: any) {
        if (event.value?.Id === 1) {
            this.allowChooseSOSDetail = true;
            this.allowUploadSOSFile = true;
        } else if (event.value?.Id !== 1) {
            this.allowChooseSOSDetail = false;
            this.allowUploadSOSFile = true;
        } 
    }

    listFIELDCOACHINGImageType: any = null;
    listFIELDCOACHINGImageTypes: any = [];
    selectedFIELDCOACHINGImageType(event: any) {
        if (event.value?.Id === 1) {
            this.allowChooseFIELDCOACHINGDetail = true;
            this.allowUploadFIELDCOACHINGFile = true;
        } else if (event.value?.Id !== 1) {
            this.allowChooseFIELDCOACHINGDetail = false;
            this.allowUploadFIELDCOACHINGFile = true;
        } 
    }

    clearSOSDetail(event: any) {
        this.allowUploadProductFile = false;
    }
    clearFIELDCOACHINGDetail(event: any) {
        this.allowUploadProductFile = false;
    }

    listInvenDetail: any = null;
    listInvenDetails: any = [];
    selectedInvenDetail(event: any) {}

    listSOSDetail: any = null;
    listSOSDetails: any = [];
    selectedSOSDetail(event: any) {}

    listFIELDCOACHINGDetail: any = null;
    listFIELDCOACHINGDetails: any = [];
    selectedFIELDCOACHINGDetail(event: any) {}

    sosId: any;
    sosName: any;
    productId: any;
    resultId: any;
    LoadInvenImageType(project_id: any, report_id: number) {
        this.InvenService.Results_GetList(project_id, report_id)
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    data.data.image_type.forEach((element: any) => {
                        this.listInvenImageTypes.push({
                            Id: element.Id,
                            Code: element.Code,
                            Name: '[' + element.Id + '] - ' + element.Code + ' - ' + element.NameVN
                        });
                    });
                    data.data.details.forEach((element: any) => {
                        this.listInvenDetails.push({
                            Id: element.product_id,
                            Name: element.product_id + ' - ' + element.product_name
                        })
                    });
                    this.resultId = data.data.result[0]?.result_id;
                    // this.listInvenImageTypes = this.listInvenImageTypes.slice(1);
                }
            }
        )
    }
    LoadSOSImageType(project_id: any, report_id: number) {
        this.SosService.Results_GetList(project_id, report_id)
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    data.data.image_type.forEach((element: any) => {
                        this.listSOSImageTypes.push({
                            Id: element.image_type_id,
                            Code: element.image_type_code,
                            Name: '[' + element.image_type_id + '] - ' + element.image_type_code + ' - ' + element.image_type_nameVN
                        });
                    });
                    data.data.details.forEach((element: any) => {
                        this.listSOSDetails.push({
                            Id: element.sos_id,
                            Name: element.sos_name,
                            FullName: element.sos_id + ' - ' + element.sos_name
                        })
                    });
                    this.resultId = data.data.result[0]?.result_id;
                    // this.listSOSImageTypes = this.listSOSImageTypes.slice(1);
                }
            }
        )
    }
    LoadFieldCoachingImageType(project_id: any, report_id: number) {
        // this.fieldCoachingService.GetFieldCoachingReport(project_id, report_id)
        //     .subscribe((data: any) => {
        //         if (data.result == EnumStatus.ok) {
        //             console.log(data.data);
        //             data.data.file?.forEach((element: any) => {
        //                 this.listFIELDCOACHINGImageTypes.push({
        //                     Id: element.image_type_id,
        //                     Code: element.image_type_code,
        //                     Name: '[' + element.image_type_id + '] - ' + element.image_type_code + ' - ' + element.image_type_nameVN
        //                 });
        //             });
        //             data.data.detail?.forEach((element: any) => {
        //                 this.listFIELDCOACHINGDetails.push({
        //                     Id: element.sos_id,
        //                     Name: element.sos_name,
        //                     FullName: element.sos_id + ' - ' + element.sos_name
        //                 })
        //             });
        //             this.resultId = data.data.result[0]?.result_id;
        //         }
        //     })
    }

    onUploadImge(event: any) {
        this.imageUpload = event.target.files[0];
        if (this.imageUpload != undefined && this.imageUpload != null) {

            if (this.NofiImage(this.imageUpload.name.split('.').pop(), 'File image') == 1 ||
                (this.KPI == 'POSM' && this.NofiIsNull(this.item_ImageType, 'image type')) == 1) {
                this.clearFileInput();
                this.clearImageType();

                return;
            } else {

                let WriteLabel =
                    this.fulldata.project_code +
                    ' - ShopCode: ' +
                    this.fulldata.shop_code;

                this.taskService
                    .ImageRender(this.imageUpload, this.imageUpload.name)
                    .then((file) => {
                        this.imageUpload = file;

                        const formUploadImageBefore = new FormData();
                        formUploadImageBefore.append('files', this.imageUpload);
                        formUploadImageBefore.append('ImageType', this.KPI);
                        formUploadImageBefore.append('WriteLabel', WriteLabel);

                        const fileName = AppComponent.generateGuid();
                        const newFile = new File([this.imageUpload], fileName+this.imageUpload.name.substring(this.imageUpload.name.lastIndexOf('.')),{type: this.imageUpload.type});
                        const modun = this.KPI;
                        const drawText =  WriteLabel;
                        this._file.FileUpload(newFile, this.project.project_code,modun, drawText).subscribe(
                            (response : any) => {   
                                let url = response.url; 
                                if (this.KPI == 'SURVEY') {
                                    this._serviceSurvey
                                        .Report_SurveyFile_Action(
                                            this.selectedcofigImage
                                                .survey_result_id,
                                            this.selectedcofigImage.UUID,
                                            this.selectedcofigImage.Guid,
                                            this.selectedcofigImage.question_id,
                                            this.selectedcofigImage.question_name,
                                            url,
                                            this.selectedcofigImage.year_month
                                        )
                                        .subscribe((d: any) => {

                                            if (d.result == EnumStatus.ok) {
                                                this.messageService.add({
                                                    severity: 'success',
                                                    summary:
                                                        'Add images successfully',
                                                    detail: 'Add images successfully',
                                                });
                                                const new_image = {
                                                    id: 0,
                                                    survey_result_id:
                                                        this.selectedcofigImage
                                                            .survey_result_id,
                                                    UUID: this.selectedcofigImage
                                                        .UUID,
                                                    Guid: this.selectedcofigImage
                                                        .Guid,
                                                    question_id:
                                                        this.selectedcofigImage
                                                            .question_id,
                                                    question_name:
                                                        this.selectedcofigImage
                                                            .question_name,
                                                    url: url,
                                                    image_time: 'now',
                                                    created_date: 'now',
                                                    year_month:
                                                        this.selectedcofigImage
                                                            .year_month,
                                                    row_number: 0,
                                                    total: 0,
                                                    title: 'Image: NEW',
                                                    alt: this.selectedcofigImage
                                                        .question_name,
                                                    question_type: 'image',
                                                };

                                                this.images.push(new_image);
                                                this.inValue.image = this.images;
                                                this.clearFileInput();
                                            }
                                        });
                                } else if (this.KPI == 'POSM') {

                                    this._servicePOSM
                                        .Report_SurveyFile_Action(
                                            this.selectedcofigImagePOSM
                                                .posm_result_id,
                                            this.selectedcofigImagePOSM.UUID,
                                            url,
                                            this.selectedcofigImagePOSM.posm_id,
                                            this.selectedcofigImagePOSM.posm_name,
                                            this.selectedcofigImagePOSM.year_month,
                                            this.item_ImageType
                                        )
                                        .subscribe((p: any) => {
                                            if (p.result == EnumStatus.ok) {

                                                this.messageService.add({
                                                    severity: 'success',
                                                    summary:
                                                        'Add images successfully',
                                                    detail: 'Add images successfully',
                                                });


                                                const new_image = {
                                                    id: 0,
                                                    posm_result_id:
                                                        this.selectedcofigImagePOSM
                                                            .posm_result_id,
                                                    UUID: this
                                                        .selectedcofigImagePOSM
                                                        .UUID,
                                                    url: url,
                                                    posm_id:
                                                        this.selectedcofigImagePOSM
                                                            .posm_id,
                                                    posm_name:
                                                        this.selectedcofigImagePOSM
                                                            .posm_name,
                                                    created_date: 'new',
                                                    image_time: 'new',
                                                    year_month:
                                                        this.selectedcofigImagePOSM
                                                            .year_month,
                                                    isdelete: 0,
                                                    created_by: 0,
                                                    row_number: 1,
                                                    alt: this.item_NameVN_ImageType + ' - ' +
                                                        this.selectedcofigImagePOSM.posm_name,
                                                    total: 1,
                                                    title: 'Image: New',
                                                    question_type: 'image',
                                                };

                                                this.images.push(new_image);
                                                this.inValue.image = this.images;

                                                this.clearFileInput();
                                                this.clearImageType();

                                            }
                                        });
                                } else if (this.KPI == 'OSA') {

                                    this._serviceOSA
                                        .OSA_image_Action(
                                            this.selectedcofigImageOSA.osa_result_id,
                                            this.selectedcofigImageOSA.UUID,
                                            url,
                                            this.selectedcofigImageOSA.product_id,
                                            this.selectedcofigImageOSA.product_name,
                                            this.selectedcofigImageOSA.year_month,
                                            this.selectedcofigImageOSA.Guid
                                        ).subscribe((o: any) => {
                                            if (o.result == EnumStatus.ok) {

                                                this.clearFileInput();
                                                this.clearImageType();

                                                this.messageService.add({
                                                    severity: 'success',
                                                    summary:
                                                        'Add images successfully',
                                                    detail: 'Add images successfully',
                                                });

                                                const new_image = {
                                                    id: 0,
                                                    osa_result_id:
                                                        this.selectedcofigImageOSA
                                                            .osa_result_id,
                                                    UUID: this
                                                        .selectedcofigImageOSA
                                                        .UUID,
                                                    url: url,
                                                    product_id:
                                                        this.selectedcofigImageOSA
                                                            .product_id,
                                                    product_name:
                                                        this.selectedcofigImageOSA
                                                            .product_name,
                                                    created_date: 'new',
                                                    image_time: 'new',
                                                    year_month:
                                                        this.selectedcofigImageOSA
                                                            .year_month,
                                                    isdelete: 0,
                                                    created_by: 0,
                                                    row_number: 1,
                                                    alt: this.selectedcofigImageOSA
                                                        .product_name,
                                                    total: 1,
                                                    title: 'Image: New',
                                                    question_type: 'image',
                                                };
                                                this.images.push(new_image);
                                                this.inValue.image = this.images;
                                            }
                                        })

                                } else if (this.KPI == 'OOL') {

                                    this._serviceOOL.OOL_Image_Action(
                                        Helper.ProjectID(), 0, this.selectedcofigImageOOL.ool_result_id, this.selectedcofigImageOOL.ool_detail_id,
                                        this.selectedcofigImageOOL.ool_id, url, 'create'
                                    ).subscribe((o: any) => {
                                        if (o.result == EnumStatus.ok) {
                                            this.clearFileInput();
                                            this.clearImageType();

                                            this.messageService.add({
                                                severity: 'success',
                                                summary:
                                                    'Add images successfully',
                                                detail: 'Add images successfully',
                                            });

                                            const new_image = {
                                                id: 0,
                                                ool_result_id: this.selectedcofigImageOOL.ool_result_id,
                                                ool_detail_id: this.selectedcofigImageOOL.ool_detail_id,
                                                ool_id: this.selectedcofigImageOOL.ool_id,
                                                url: url,
                                                created_date: 'new',
                                                image_time: 'new',
                                                isdelete: 0,
                                                created_by: 0,
                                                row_number: 1,
                                                // alt: this.selectedcofigImageOSA
                                                //     .product_name,
                                                total: 1,
                                                title: 'Image: New',
                                                question_type: 'image',
                                            };
                                            this.images.push(new_image);
                                            this.inValue.image = this.images;
                                        }
                                    })
                                } else if (this.KPI == 'INVENTORY') {
                                    console.log ( 'this.selectedcofigImageINVENTORY : ', this.selectedcofigImageINVENTORY)
                                    this.InvenService.Images_Action(
                                        Helper.ProjectID(),
                                        0,
                                        this.resultId,
                                        this.selectedcofigImageINVENTORY.Id,
                                        this.productId = this.selectedcofigImageINVENTORY.Id === 2 || this.selectedcofigImageINVENTORY.Id === 3 ? null : this.selectedcofigDetailINVENTORY.Id,
                                        url,
                                        'create'
                                    ).subscribe((o: any) => {
                                        if (o.result == EnumStatus.ok) {
                                            this.clearFileInput();
                                            this.clearImageType();

                                            this.messageService.add({
                                                severity: 'success',
                                                summary:
                                                    'Add images successfully',
                                                detail: 'Add images successfully',
                                            });

                                            const new_image = {
                                                id: 0,
                                                inven_result_id: this.resultId,
                                                inven_detail_id: this.selectedcofigImageINVENTORY.Id,
                                                inven_id: this.productId = this.selectedcofigImageINVENTORY.Id === 2 || this.selectedcofigImageINVENTORY.Id === 3 ? null : this.selectedcofigDetailINVENTORY.Id,
                                                url: url,
                                                created_date: 'new',
                                                image_time: 'new',
                                                isdelete: 0,
                                                created_by: 0,
                                                row_number: 1,
                                                // alt: this.selectedcofigImageINVENTORY
                                                //     .product_name,
                                                total: 1,
                                                title: 'Image: New',
                                                question_type: 'image',
                                            };
                                            this.images.push(new_image);
                                            this.inValue.image = this.images;
                                        }
                                    })
                                } else if (this.KPI == 'SOS') {
                                    this.SosService.Images_Action(
                                        Helper.ProjectID(),
                                        0,
                                        this.resultId,
                                        this.selectedcofigImageSOS.Code,
                                        this.sosId = this.selectedcofigImageSOS.Id === 2 || this.selectedcofigImageSOS.Id === 3 ? null : this.selectedcofigDetailSOS.Id,
                                        this.sosName = this.selectedcofigDetailSOS.Name,
                                        url,
                                        'create'
                                    ).subscribe((o: any) => {
                                        if (o.result == EnumStatus.ok) {
                                            this.clearFileInput();
                                            this.clearImageType();

                                            this.messageService.add({
                                                severity: 'success',
                                                summary:
                                                    'Add images successfully',
                                                detail: 'Add images successfully',
                                            });

                                            const new_image = {
                                                id: 0,
                                                sos_result_id: this.resultId,
                                                sos_detail_id: this.selectedcofigImageSOS.Id,
                                                sos_id: this.sosId = this.selectedcofigImageSOS.Id === 2 || this.selectedcofigImageSOS.Id === 3 ? null : this.selectedcofigDetailSOS.Id,
                                                url: url,
                                                created_date: 'new',
                                                image_time: 'new',
                                                isdelete: 0,
                                                created_by: 0,
                                                row_number: 1,
                                                // alt: this.selectedcofigImageSOS
                                                //     .product_name,
                                                total: 1,
                                                title: 'Image: New',
                                                question_type: 'image',
                                            };
                                            this.images.push(new_image);
                                            this.inValue.image = this.images;
                                        }
                                    })
                                } 
                            },
                            (error : any) => {  
                                let url = null;  
                            }
                        );

                        /*
                        this._file
                            .UploadImage(formUploadImageBefore)
                            .subscribe((data: any) => {
                                if (data.result == EnumStatus.ok) {
                                    let url = EnumSystem.fileLocal + data.data;

                                    if (this.KPI == 'SURVEY') {
                                        this._serviceSurvey
                                            .Report_SurveyFile_Action(
                                                this.selectedcofigImage
                                                    .survey_result_id,
                                                this.selectedcofigImage.UUID,
                                                this.selectedcofigImage.Guid,
                                                this.selectedcofigImage.question_id,
                                                this.selectedcofigImage.question_name,
                                                url,
                                                this.selectedcofigImage.year_month
                                            )
                                            .subscribe((d: any) => {

                                                if (d.result == EnumStatus.ok) {
                                                    this.messageService.add({
                                                        severity: 'success',
                                                        summary:
                                                            'Add images successfully',
                                                        detail: 'Add images successfully',
                                                    });
                                                    const new_image = {
                                                        id: 0,
                                                        survey_result_id:
                                                            this.selectedcofigImage
                                                                .survey_result_id,
                                                        UUID: this.selectedcofigImage
                                                            .UUID,
                                                        Guid: this.selectedcofigImage
                                                            .Guid,
                                                        question_id:
                                                            this.selectedcofigImage
                                                                .question_id,
                                                        question_name:
                                                            this.selectedcofigImage
                                                                .question_name,
                                                        url: url,
                                                        image_time: 'now',
                                                        created_date: 'now',
                                                        year_month:
                                                            this.selectedcofigImage
                                                                .year_month,
                                                        row_number: 0,
                                                        total: 0,
                                                        title: 'Image: NEW',
                                                        alt: this.selectedcofigImage
                                                            .question_name,
                                                        question_type: 'image',
                                                    };

                                                    this.images.push(new_image);
                                                    this.inValue.image = this.images;
                                                    this.clearFileInput();
                                                }
                                            });
                                    } else if (this.KPI == 'POSM') {

                                        this._servicePOSM
                                            .Report_SurveyFile_Action(
                                                this.selectedcofigImagePOSM
                                                    .posm_result_id,
                                                this.selectedcofigImagePOSM.UUID,
                                                url,
                                                this.selectedcofigImagePOSM.posm_id,
                                                this.selectedcofigImagePOSM.posm_name,
                                                this.selectedcofigImagePOSM.year_month,
                                                this.item_ImageType
                                            )
                                            .subscribe((p: any) => {
                                                if (p.result == EnumStatus.ok) {

                                                    this.messageService.add({
                                                        severity: 'success',
                                                        summary:
                                                            'Add images successfully',
                                                        detail: 'Add images successfully',
                                                    });


                                                    const new_image = {
                                                        id: 0,
                                                        posm_result_id:
                                                            this.selectedcofigImagePOSM
                                                                .posm_result_id,
                                                        UUID: this
                                                            .selectedcofigImagePOSM
                                                            .UUID,
                                                        url: url,
                                                        posm_id:
                                                            this.selectedcofigImagePOSM
                                                                .posm_id,
                                                        posm_name:
                                                            this.selectedcofigImagePOSM
                                                                .posm_name,
                                                        created_date: 'new',
                                                        image_time: 'new',
                                                        year_month:
                                                            this.selectedcofigImagePOSM
                                                                .year_month,
                                                        isdelete: 0,
                                                        created_by: 0,
                                                        row_number: 1,
                                                        alt: this.item_NameVN_ImageType + ' - ' +
                                                            this.selectedcofigImagePOSM.posm_name,
                                                        total: 1,
                                                        title: 'Image: New',
                                                        question_type: 'image',
                                                    };

                                                    this.images.push(new_image);
                                                    this.inValue.image = this.images;

                                                    this.clearFileInput();
                                                    this.clearImageType();

                                                }
                                            });
                                    } else if (this.KPI == 'OSA') {

                                        this._serviceOSA
                                            .OSA_image_Action(
                                                this.selectedcofigImageOSA.osa_result_id,
                                                this.selectedcofigImageOSA.UUID,
                                                url,
                                                this.selectedcofigImageOSA.product_id,
                                                this.selectedcofigImageOSA.product_name,
                                                this.selectedcofigImageOSA.year_month,
                                                this.selectedcofigImageOSA.Guid
                                            ).subscribe((o: any) => {
                                                if (o.result == EnumStatus.ok) {

                                                    this.clearFileInput();
                                                    this.clearImageType();

                                                    this.messageService.add({
                                                        severity: 'success',
                                                        summary:
                                                            'Add images successfully',
                                                        detail: 'Add images successfully',
                                                    });

                                                    const new_image = {
                                                        id: 0,
                                                        osa_result_id:
                                                            this.selectedcofigImageOSA
                                                                .osa_result_id,
                                                        UUID: this
                                                            .selectedcofigImageOSA
                                                            .UUID,
                                                        url: url,
                                                        product_id:
                                                            this.selectedcofigImageOSA
                                                                .product_id,
                                                        product_name:
                                                            this.selectedcofigImageOSA
                                                                .product_name,
                                                        created_date: 'new',
                                                        image_time: 'new',
                                                        year_month:
                                                            this.selectedcofigImageOSA
                                                                .year_month,
                                                        isdelete: 0,
                                                        created_by: 0,
                                                        row_number: 1,
                                                        alt: this.selectedcofigImageOSA
                                                            .product_name,
                                                        total: 1,
                                                        title: 'Image: New',
                                                        question_type: 'image',
                                                    };
                                                    this.images.push(new_image);
                                                    this.inValue.image = this.images;
                                                }
                                            })

                                    } else if (this.KPI == 'OOL') {

                                        this._serviceOOL.OOL_Image_Action(
                                            Helper.ProjectID(), 0, this.selectedcofigImageOOL.ool_result_id, this.selectedcofigImageOOL.ool_detail_id,
                                            this.selectedcofigImageOOL.ool_id, url, 'create'
                                        ).subscribe((o: any) => {
                                            if (o.result == EnumStatus.ok) {
                                                this.clearFileInput();
                                                this.clearImageType();

                                                this.messageService.add({
                                                    severity: 'success',
                                                    summary:
                                                        'Add images successfully',
                                                    detail: 'Add images successfully',
                                                });

                                                const new_image = {
                                                    id: 0,
                                                    ool_result_id: this.selectedcofigImageOOL.ool_result_id,
                                                    ool_detail_id: this.selectedcofigImageOOL.ool_detail_id,
                                                    ool_id: this.selectedcofigImageOOL.ool_id,
                                                    url: url,
                                                    created_date: 'new',
                                                    image_time: 'new',
                                                    isdelete: 0,
                                                    created_by: 0,
                                                    row_number: 1,
                                                    // alt: this.selectedcofigImageOSA
                                                    //     .product_name,
                                                    total: 1,
                                                    title: 'Image: New',
                                                    question_type: 'image',
                                                };
                                                this.images.push(new_image);
                                                this.inValue.image = this.images;
                                            }
                                        })
                                    } else if (this.KPI == 'INVENTORY') {
                                        this.InvenService.Images_Action(
                                            Helper.ProjectID(),
                                            0,
                                            this.resultId,
                                            this.selectedcofigImageINVENTORY.Id,
                                            this.productId = this.selectedcofigImageINVENTORY.Id === 2 || this.selectedcofigImageINVENTORY.Id === 3 ? null : this.selectedcofigDetailINVENTORY.Id,
                                            url,
                                            'create'
                                        ).subscribe((o: any) => {
                                            if (o.result == EnumStatus.ok) {
                                                this.clearFileInput();
                                                this.clearImageType();

                                                this.messageService.add({
                                                    severity: 'success',
                                                    summary:
                                                        'Add images successfully',
                                                    detail: 'Add images successfully',
                                                });

                                                const new_image = {
                                                    id: 0,
                                                    inven_result_id: this.resultId,
                                                    inven_detail_id: this.selectedcofigImageINVENTORY.Id,
                                                    inven_id: this.productId = this.selectedcofigImageINVENTORY.Id === 2 || this.selectedcofigImageINVENTORY.Id === 3 ? null : this.selectedcofigDetailINVENTORY.Id,
                                                    url: url,
                                                    created_date: 'new',
                                                    image_time: 'new',
                                                    isdelete: 0,
                                                    created_by: 0,
                                                    row_number: 1,
                                                    // alt: this.selectedcofigImageINVENTORY
                                                    //     .product_name,
                                                    total: 1,
                                                    title: 'Image: New',
                                                    question_type: 'image',
                                                };
                                                this.images.push(new_image);
                                                this.inValue.image = this.images;
                                            }
                                        })
                                    } else if (this.KPI == 'SOS') {
                                        this.SosService.Images_Action(
                                            Helper.ProjectID(),
                                            0,
                                            this.resultId,
                                            this.selectedcofigImageSOS.Code,
                                            this.sosId = this.selectedcofigImageSOS.Id === 2 || this.selectedcofigImageSOS.Id === 3 ? null : this.selectedcofigDetailSOS.Id,
                                            this.sosName = this.selectedcofigDetailSOS.Name,
                                            url,
                                            'create'
                                        ).subscribe((o: any) => {
                                            if (o.result == EnumStatus.ok) {
                                                this.clearFileInput();
                                                this.clearImageType();

                                                this.messageService.add({
                                                    severity: 'success',
                                                    summary:
                                                        'Add images successfully',
                                                    detail: 'Add images successfully',
                                                });

                                                const new_image = {
                                                    id: 0,
                                                    sos_result_id: this.resultId,
                                                    sos_detail_id: this.selectedcofigImageSOS.Id,
                                                    sos_id: this.sosId = this.selectedcofigImageSOS.Id === 2 || this.selectedcofigImageSOS.Id === 3 ? null : this.selectedcofigDetailSOS.Id,
                                                    url: url,
                                                    created_date: 'new',
                                                    image_time: 'new',
                                                    isdelete: 0,
                                                    created_by: 0,
                                                    row_number: 1,
                                                    // alt: this.selectedcofigImageSOS
                                                    //     .product_name,
                                                    total: 1,
                                                    title: 'Image: New',
                                                    question_type: 'image',
                                                };
                                                this.images.push(new_image);
                                                this.inValue.image = this.images;
                                            }
                                        })
                                    } 
                                } else {
                                }
                            });
*/

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
    deletePhoto(id: any) {
        let action = '';
        if (this.KPI == 'SURVEY') {
            action = 'survey.remove_image';
        } else if (this.KPI == 'POSM') {
            action = 'posm.remove_image';
        } else if (this.KPI == 'OSA') {
            action = 'osa.remove_image'
        } else if (this.KPI == 'OOL') {
            action = 'ool.remove_image'
        } else if (this.KPI == 'INVENTORY') {
            action = 'delete'
        } else if (this.KPI == 'SOS') {
            action = 'delete'
        } else if ( this.KPI == 'ACTIVATION'){
             action = 'activation.remove_image'
        }

        try {
            if (this.KPI === 'INVENTORY') {
                this.InvenService.Images_Action(
                    Helper.ProjectID(),
                    this.currentPhoto.id,
                    this.currentPhoto.result_id,
                    this.currentPhoto.image_type,
                    this.currentPhoto.product_id,
                    this.currentPhoto.url,
                    action
                ).subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {

                        this.removeItem(id);
                        this.currentPhoto = undefined;
                    }
                })
            } else {
                this._service
                    .ewo_Report_Action(action, id, '1')
                    .subscribe((data: any) => {
                        if (data.result == EnumStatus.ok) {

                            this.removeItem(id);
                            this.currentPhoto = undefined;
                        }
                    }
                );
            }

        } catch (error) { }

        try {
            if (this.KPI === 'SOS') {
                this.SosService.Images_Action(
                    Helper.ProjectID(),
                    this.currentPhoto.id,
                    this.currentPhoto.result_id,
                    this.currentPhoto.image_type,
                    this.currentPhoto.sos_id,
                    this.currentPhoto.sos_name, 
                    this.currentPhoto.url,
                    action
                ).subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {

                        this.removeItem(id);
                        this.currentPhoto = undefined;
                    }
                })
            } else {
                this._service
                    .ewo_Report_Action(action, id, '1')
                    .subscribe((data: any) => {
                        if (data.result == EnumStatus.ok) {

                            this.removeItem(id);
                            this.currentPhoto = undefined;
                        }
                    }
                );
            }

        } catch (error) { }
    }
    countries!: Country[];
    selectedCountry!: Country;
    images: any;
    audios: any;
    videos: any;
    @Input() inValue: any;
    @Input() KPI: any;
    @Input() fulldata: any;
    @Input() SurveyTab: any = undefined;
    @Input() POSMconfig: any = undefined;
    @Input() OSAconfig: any = undefined;
    @Input() OOLconfig: any = undefined;
    @Input() INVENTORYconfig: any = undefined;
    @Input() ACTIVATIONconfig: any = undefined;
    @Input() SOSconfig: any = undefined;
    @Input() FIELDCOACHINGconfig: any = undefined;
    @Input() shop_code: any = null;

    @Input() is_edit_data: any = 0;
    @ViewChild('myInputImagesurvey') myInputImagesurvey: any;
    @ViewChild('myInputImageposm') myInputImageposm: any;
    @ViewChild('myInputImageosa') myInputImageosa: any;
    @ViewChild('myInputImageool') myInputImageool: any;
    @ViewChild('myInputImageinventory') myInputImageinventory: any;
    @ViewChild('myInputImagesos') myInputImagesos: any;

    clearFileInput() {
        try {
            this.myInputImagesurvey.nativeElement.value = null;

        } catch (error) { }
        try {
            this.myInputImageposm.nativeElement.value = null;
            // this.item_ImageType = 0
        } catch (error) { }

        try {
            this.myInputImageosa.nativeElement.value = null;
        } catch (error) { }

        try {
            this.myInputImageool.nativeElement.value = null;
        } catch (error) { }

        try {
            this.myInputImageinventory.nativeElement.value = null;
        } catch (error) { }

        try {
            this.myInputImagesos.nativeElement.value = null;
        } catch (error) { }
    }
    clearImageType() {
        this.item_ImageType = 0
    }

    responsiveOptions: any[] = [
        {
            breakpoint: '1024px',
            numVisible: 5,
        },
        {
            breakpoint: '768px',
            numVisible: 3,
        },
        {
            breakpoint: '560px',
            numVisible: 1,
        },
    ];

    urlgallery: any;
    openImage(item: any) {
        console.log(this.inValue);
        const listphoto = this.inValue.image.map((item: any) => ({
            id: item.row_number,
            src: item.url,
            title: item.alt + (Helper.IsNull(item.title) != true ? (' - ' + item.title) : ''),
            image_time: item.image_time,
            _index: item.row_number,
        }));

        const changeindex = item.row_number;
        localStorage.setItem('listphoto', JSON.stringify(listphoto));
        localStorage.setItem('changeindex', JSON.stringify(changeindex));

        this.urlgallery = 'assets/ZoomImage/tool.html';
        document.open(
            <string>this.urlgallery,
            'image_default',
            'height=700,width=900,top=100,left= 539.647'
        );
    }
  

    selectedQuestion = null as any;
    fileUpload: any;
    url: any = '';
    onUploadFileImage(event: any, tab: any, shop_code: any) {   
         
        const currentDate =  Helper.convertDateTimeImage(new Date()) 
 
     if ( this.NofiIsNull ( this.selectedQuestion , 'question') == 1 ){
        this.url = null;
        this.clearFileImage();
        return;
     }else {
        this.fileUpload = event.target.files[0];
        if (Helper.IsNull(this.fileUpload) != true) {
    
          if (this.NofiFileUpload(this.fileUpload.name.split('.').pop(), 'File Image') == 1) {
            this.clearFileImage();
            this.url = null;
            return;
          } else { 
    
            const formUploadImage = new FormData();
            formUploadImage.append('files', this.fileUpload);
            formUploadImage.append('ImageType', 'REDEMPTION');
            formUploadImage.append('WriteLabel', `REDEMPTION - ShopCode:${shop_code} - Date: ${currentDate}`);
    
            // this._file
            //   .UploadFile(formUploadImage)
            //   .subscribe((data: any) => {
            //     if (data.result == EnumStatus.ok) {
            //       this.url = EnumSystem.fileLocal + data.data; 
            //       this.fileAction(tab);
            //     } else {
            //       this.url = null;
            //       this.clearFileImage();
            //     }
            //   }); 
              const fileName = AppComponent.generateGuid();
              const newFile = new File([this.fileUpload], fileName+this.fileUpload.name.substring(this.fileUpload.name.lastIndexOf('.')),{type: this.fileUpload.type});
              const modun = 'REDEMPTION';
              const drawText = `REDEMPTION - ShopCode:${shop_code} - Date: ${currentDate}`;
              this._file.FileUpload(newFile, this.project.project_code,modun, drawText).subscribe(
                  (response : any) => {    
                      this.url = response.url;   
                      this.fileAction(tab);
                  },
                  (error : any) => { 
                    this.url = null;
                    this.clearFileImage();
                  }
              );

          }
        }
        else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Please enter a file upload',
          });
          return;
        }
     } 
       
    }
    fileAction ( tab: any ){
       
  if  ( this.NofiIsNull(this.selectedQuestion, 'question') == 1){
        this.url = null;
        this.clearFileImage();
    return;
  }else {
 
    console.log (  Helper.ProjectID(), 0, tab.work_id, tab.work_item_id,  tab.survey_id,
    Helper.IsNull(this.selectedQuestion) != true ? this.selectedQuestion.question_id : null,
    Helper.IsNull(this.selectedQuestion) != true ? this.selectedQuestion.question_name : null, 
    this.url, tab.activation_form_id, 'create');
 
    this.activationService.work_file_Action( 
        Helper.ProjectID(), 0, tab.work_id, tab.work_item_id,  tab.survey_id,
        Helper.IsNull(this.selectedQuestion) != true ? this.selectedQuestion.question_id : null,
        Helper.IsNull(this.selectedQuestion) != true ? this.selectedQuestion.question_name : null, 
        this.url, tab.activation_form_id, 'create').subscribe((data : any) => {
            if ( data.result == EnumStatus.ok){
                if (data.data == 1){ 
                    this.NofiResult( 'Page Work', `Action works file`,  `Action works file successful`,  'success',   'SuccessFull' );
                    this.clearActionFile(); 
                     
                    const new_image = {
                        id: 0, 
                        work_id: tab.work_id,
                        work_item_id: tab.work_item_id,
                        survey_id: tab.survey_id,
                        survey_name: tab.survey_name,
                        url: this.url,
                        created_date: 'new',
                        image_time: 'new',
                        isdelete: 0,
                        created_by: 0,
                        row_number: 1,
                        alt:`[${this.selectedQuestion.question_id} - ${this.selectedQuestion.question_name}]`   ,
                        total: 1,
                        title: 'Image: New',
                        question_type: 'image',
                        support_data: null,
                        typeOf: 'string',

                    };
                    this.images.push(new_image);
                    this.inValue.image = this.images;

                }
            }
        })
    } 
  
    }
    clearActionFile(){
        this.selectedQuestion = null;
        this.clearFileImage(); 
    }

    @ViewChild('myInputImage') myInputImage: any;
    clearFileImage() {
      try {
        this.myInputImage.nativeElement.value = null;
      } catch (error) { }
  
    }
 

    NofiFileUpload(value: any, name: any): any {
        let check = 0;
        if (value != 'png' &&  value != 'jpeg' &&  value != 'jpg') {
          this.messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail: name + ' wrong format',
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

    NofiIsNull(value: any, name: any): any {
        let check = 0;
        if (value == 0) {
            value += '';
        }
        if (Helper.IsNullTypeNumber(value) == true || Pf.checkSpace(value) != true) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please enter a ' + name,
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

}
