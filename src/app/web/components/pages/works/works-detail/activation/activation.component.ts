import { DatePipe } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EditableRow } from 'primeng/table';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { TaskFileService } from 'src/app/Service/task-file.service';
import { Pf } from 'src/app/_helpers/pf';
import { AppComponent } from 'src/app/app.component';
import { ScriptLoaderService } from 'src/app/web/service/ScriptLoaderService.service';
import { ActivationService } from 'src/app/web/service/activation.service';
import { FileService } from 'src/app/web/service/file.service';
import { PromotionService } from 'src/app/web/service/promotion.service';
import { SurveyService } from 'src/app/web/service/survey.service';
import { TransactionsService } from 'src/app/web/service/transactions.service';

interface City {
    name: string;
    code: string;
}
interface Column {
    field: string;
    header: string;
}

@Component({
    selector: 'app-activation',
    templateUrl: './activation.component.html',
    styleUrls: ['./activation.component.scss'],
    providers: [ConfirmationService, DatePipe, MessageService, EditableRow],
})
export class ActivationComponent {
    @Input() inValue: any;
    @Output() outValue = new EventEmitter<any>();
    datePipe: any;

    constructor(
        private _service: ActivationService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private _file: FileService,
        datePipe: DatePipe,
        private edService: EncryptDecryptService,
    ) {}

    // this.outValue.emit(this.tab.report_id);
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

    // SURVEY SELLOUT GIFT

    getSeverity(value: any): any {
        switch (value) {
            case 'SURVEY':
                return 'info';
            case 'SELLOUT':
                return 'warning';
            default:
                return 'success';
        }
    }

    getResult(value: any): any {
        switch (value) {
            case 'Bán thành công':
                return 'success';
            case 'Bán không thành công':
                return 'danger';
            default:
                return 'info';
        }
    }

    // SELLOUT - GIFT
    /*
  getSeverity(value: any): any {
    switch (value) {
      case 'SURVEY':
        return 'info';
      case 'SELLOUT - GIFT':
        return 'success';
      default:
        return 'warning';
    }
  }*/

    radioVideoDialog: boolean = false;
    hideDialog() {
        this.radioVideoDialog = false;
    }

    gift: any = [];
    giftDialog: boolean = false;
    action: any = 'create';
    worksGift: any = [];
    openNew(work: any, action: any) {
        this.gift = {};
        this.gift.work_id = work.work_id;
        this.gift.work_item_id = work.work_item_id;
        this.gift.promotion_id = work.promotion_id;

        this.action = action;
        this.worksGift = work;

        this.giftDialog = true;
    }
    editGift(item: any, action: any) {
        this.gift = { ...item };
        this.giftDialog = true;
        this.action = action;
    }

    hideDialogGift() {
        this.giftDialog = false;
    }

    deleteGift() {
        this._service
            .work_gift_Action(
                Helper.ProjectID(),
                this.gift.id,
                this.gift.gift_id,
                this.gift.quantity,
                'delete'
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.NofiResult(
                        'Page Work',
                        `Delete gift`,
                        `Delete gift successful`,
                        'success',
                        'SuccessFull'
                    );
                }
            });

        this.clearActionGift();
    }

    clearActionGift() {
        this.gift = {};
        this.itemGift = null;
        this.giftDialog = false;
        this.outValue.emit(this.inValue.data_activation.report_id);
    }
    work: any = [];
    viewRadioVideo(work: any) {
        this.work = work;
        this.radioVideoDialog = true;
    }

    itemGift: any = null;
    selectItemId(gift: any, event: any) {
        gift.itemGift = event != null ? event : null;
    }

    onRowEdit(gift: any) {
        gift.itemGift = {
            name: `[${gift.gift_id}] - ${gift.gift_code} - ${gift.gift_name}`,
            id: gift.gift_id,
            gift_code: gift.gift_code,
            item_code: gift.gift_code,
            item_name: gift.gift_name,
            gift_image: gift.gift_image,
        };
    }

    onRowEditSave(gift: any, action: any) {
        if (
            (this.action == 'create' &&
                this.NofiIsNull(gift.itemGift, 'gift') == 1) ||
            this.NofiIsNull(gift.quantity, 'quantity') == 1 ||
            this.NofiQuantity(gift.quantity, 'quantity') == 1
        ) {
            return;
        } else {
            this._service
                .work_gift_Action(
                    Helper.ProjectID(),
                    gift.id,
                    gift.itemGift.id,
                    gift.quantity,
                    action
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        this.NofiResult(
                            'Page Work',
                            `Update gift`,
                            `Update gift successful`,
                            'success',
                            'SuccessFull'
                        );
                    }
                    this.clearActionGift();
                });
        }
    }

    NofiQuantity(value: any, name: any): any {
        let check = 0;
        if (value < 1) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: `The ${name} must be greater than or equal to 1`,
            });
            check = 1;
        }
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

    isCreateGift: boolean = false;
    createGift() {
        this.isCreateGift = true;
        this.GetPromotion();
        if (this.inValue && this.inValue.data_activation[0]) {
            this.gift_create.work_id =
                this.inValue.data_activation[0].work_id || 0;
            this.gift_create.work_item_id =
                this.inValue.data_activation[0].stepGift.work_item_id || 0;
            this.gift_create.uuid = this.inValue.data_activation[0].UUID || '';
            this.gift_create.guid = this.inValue.data_activation[0].Guid || '';
            this.gift_create.activation_form_id =
                this.inValue.data_activation[0].activation_form_id || 0;
            this.gift_create.quantity = 0;
        }
    }
    isEdit: boolean = false;
    editGiftV2(item: any) {
        if (item != null) {
            this.isEdit = true;
            this.isCreateGift = true;
            this.GetPromotion(item.promotion_id);
            this.GetGifts(item.promotion_id, item.gift_id);
            this.quantity = item.quantity;
            this.gift_create.id = item.id;
            this.gift_create.uuid = null;
            this.gift_create.guid = null;
        }
    }
    resetCreate() {
        this.gift_create = {
            id: 0,
            work_id: 0,
            work_item_id: 0,
            uuid: '',
            guid: '',
            activation_form_id: 0,
            quantity: 0,
            gift_id: 0,
            promotion_id: 0,
        };
    }
    Save(e: any) {
        let action = 'create';
        if (this.isEdit == true) {
            action = 'update';
            this.isEdit = false;
        }
        let isSave = true;
        if (this.select_promotion == null) {
            isSave = false;
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please select promotion',
            });
        } else {
            this.gift_create.promotion_id =
                this.select_promotion.promotion_id || 0;
        }
        if (this.select_gift == null) {
            isSave = false;
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please select gift',
            });
        } else {
            this.gift_create.gift_id = this.select_gift.id || 0;
        }
        if (this.quantity == 0) {
            isSave = false;
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please input quantity',
            });
        } else {
            this.gift_create.quantity = this.quantity || 0;
        }

        if (isSave == true) {
            this._service
                .work_gift_action_create(
                    Helper.ProjectID(),
                    this.gift_create.id,
                    this.gift_create.work_id,
                    this.gift_create.work_item_id,
                    this.gift_create.uuid,
                    this.gift_create.guid,
                    this.gift_create.gift_id,
                    this.gift_create.quantity,
                    this.gift_create.promotion_id,
                    this.gift_create.activation_form_id,
                    action
                )
                .subscribe((r: any) => {
                    if (r.result == EnumStatus.ok) {
                        this.isCreateGift = false;
                        this.messageService.add({
                            severity: 'success',
                            summary: 'success',
                            detail: 'Create success',
                        });
                        this.outValue.emit(
                            this.inValue.data_activation.report_id
                        );
                    }
                });
        }
    }
    quantity: number = 0;
    promotion_gift: any = [];
    select_promotion: any;
    GetPromotion(promotion_id?: number) {
        this._service
            .promotion_getList(Helper.ProjectID())
            .subscribe((r: any) => {
                if (r.result == EnumStatus.ok) {
                    this.promotion_gift = r.data;
                    console.log(
                        'this.promotion_gift.length',
                        this.promotion_gift.length
                    );
                    if (this.promotion_gift.length == 1) {
                        this.select_promotion = this.promotion_gift[0];
                        this.selectPromotion();
                    } else {
                        if (promotion_id && promotion_id > 0) {
                            this.select_promotion = this.promotion_gift.find(
                                (e: any) => {
                                    return (e.promotion_id = promotion_id);
                                }
                            );
                        }
                    }
                }
            });
    }
    selectPromotion() {
        if (this.select_promotion && this.select_promotion?.promotion_id) {
            this.GetGifts(this.select_promotion.promotion_id);
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Please select promotion',
            });
        }
    }
    gift_create_list: any = [];
    select_gift: any;
    GetGifts(promotion_id: number, gift_id?: number) {
        this._service
            .gifts_getList_by_promotionId(promotion_id, Helper.ProjectID())
            .subscribe((r: any) => {
                if (r.result == EnumStatus.ok) {
                    let b = this.inValue.data_activation[0].giftListWeb;
                    this.gift_create_list = r.data.filter(
                        (itemA: any) =>
                            !b.some((itemB: any) => itemA.id === itemB.gift_id)
                    );

                    if (gift_id && gift_id > 0) {
                        this.select_gift = this.gift_create_list.find(
                            (e: any) => {
                                return (e.id = gift_id);
                            }
                        );
                    }
                }
            });
    }
    gift_create: any = {
        id: 0,
        work_id: 0,
        work_item_id: 0,
        uuid: '',
        guid: '',
        activation_form_id: 0,
        quantity: 0,
        gift_id: 0,
        promotion_id: 0,
    };

    delete(event: Event, item: any) {
        this.gift_create.uuid = null;
        this.gift_create.guid = null;
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Do you want to delete this record?',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: 'p-button-danger p-button-sm',
            accept: () => {
                if (item.id > 0) {
                    this._service
                        .work_gift_action_create(
                            Helper.ProjectID(),
                            item.id,
                            0,
                            0,
                            this.gift_create.uuid,
                            this.gift_create.guid,
                            0,
                            0,
                            0,
                            0,
                            'delete'
                        )
                        .subscribe((r: any) => {
                            if (r.result == EnumStatus.ok) {
                                this.messageService.add({
                                    severity: 'info',
                                    summary: 'Success',
                                    detail: 'Deleted',
                                    life: 3000,
                                });
                                this.outValue.emit(
                                    this.inValue.data_activation.report_id
                                );
                            }
                        });
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'error',
                        detail: 'error',
                        life: 3000,
                    });
                }
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'You have rejected',
                    life: 3000,
                });
            },
        });
    }

    clickItem(item : any){
        console.log ( 'item : ', item)
    }

    countries = [] as any ; 
    selectedQuestion = null as any;
    project:any 
    projectName () {
        let _u = localStorage.getItem(EnumLocalStorage.user);
        this.project = JSON.parse(
            this.edService.decryptUsingAES256(_u)
        ).projects.filter(
            (d: any) => d.project_id == Helper.ProjectID()
        )[0];
        console.log(this.project);
    }

    ngOnInit() { 
        this.projectName () ;
    }

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
 
    this._service.work_file_Action( 
        Helper.ProjectID(), 0, tab.work_id, tab.work_item_id,  tab.survey_id,
        Helper.IsNull(this.selectedQuestion) != true ? this.selectedQuestion.question_id : null,
        Helper.IsNull(this.selectedQuestion) != true ? this.selectedQuestion.question_name : null, 
        this.url, tab.activation_form_id, 'create').subscribe((data : any) => {
            if ( data.result == EnumStatus.ok){
                if (data.data == 1){ 
                    this.NofiResult( 'Page Work', `Action works file`,  `Action works file successful`,  'success',   'SuccessFull' );
                    this.clearActionFile(); 
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
    
}
