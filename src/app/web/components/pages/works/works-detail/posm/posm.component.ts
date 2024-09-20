import { Component, Input } from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { PosmService } from 'src/app/web/service/posm.service';
import { QcsService } from 'src/app/web/service/qcs.service';

@Component({
    selector: 'app-posm-detail',
    templateUrl: './posm.component.html',
    styleUrls: ['./posm.component.scss'],
    providers: [MessageService],
})
export class PosmDetailComponent {
    @Input() inValue: any;
    constructor(
        private pomService: PosmService,
        private messageService: MessageService,
        private qcService: QcsService,
        private edService: EncryptDecryptService
    ) { }
    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.loadUser();
    }
    user_profile: string = 'current';
    currentUser: any;
    userProfile: any;
    loadUser() {
        if (this.user_profile == EnumSystem.current) {
            let _u = localStorage.getItem(EnumLocalStorage.user);

            this.currentUser = JSON.parse(
                this.edService.decryptUsingAES256(_u)
            );
            this.currentUser.employee[0]._status =
                this.currentUser.employee[0].status == 1 ? true : false;
            this.userProfile = this.currentUser.employee[0];
        } 
    }

    checkUserCUS(): any {
        return this.userProfile.level == 'CUS'  ? true : false;
    }

    item_PosmReason: number = 0;
    item_PosmReason_name: any;
    selectPosmReason(event: any) {
        this.item_PosmReason = event != null ? event.code : 0;
        this.item_PosmReason_name = event != null ? event.name : null;
    }
    onRowEditInit(item: any) {
        this.messages = []
        this.item_PosmReason = item.reason_id;
    }
    onRowEditCancel(item: any, index: number) { }

    update(item: any) {


        if (Helper.number(item.values) == true) {
            this.pomService
                .POSM_Detail_Action(
                    item.id,
                    item.values + '',
                    this.item_PosmReason,
                    'values',
                    item.note
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        item.reason_id = this.item_PosmReason;

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'POSM is updated successfully',
                        });
                    }
                });
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Values wrong format',
            });
            return;
        }
    }
    visible: boolean = false;
    notification: any
    messages: any = []
    showDialog() {
        this.visible = true;
    }
    pushNotifications(detail: any) {
        this.messages = [
            { severity: 'error', summary: 'Error', detail: detail },
        ];
    }
    onRowEditSave(item: any) {

        item.reason_name = this.item_PosmReason_name;
        if (Helper.IsNull(item.values + '') == true) {
            // this.messageService.add({
            //     severity: 'warn',
            //     summary: 'Warning',
            //     detail: 'Please enter a values',
            // });
            // this.notification = 'Please enter a values'
            // this.showDialog()
            item.values = item.now_value
            this.pushNotifications('Please enter a values');
            return;
        }
        if (item.values < item.posm_target) {
            if (
                Helper.IsNull(this.item_PosmReason + '') == true ||
                this.item_PosmReason == null || this.item_PosmReason == 0
            ) {
                // this.messageService.add({
                //     severity: 'warn',
                //     summary: 'Warning',
                //     detail: 'Please enter a reason',
                // });

                this.pushNotifications('Please enter a reason');
                item.reason_name = item.now_reason_name
                item.values = item.now_value;

            }
            else {
                this.update(item);

            }
        }
        else {
            this.update(item);
        }


    }

    urlgallery: any;
    showImageProduct(url: any) {
  
      this.urlgallery = url;
      document.open(
        <string>this.urlgallery,
        'posm_image_default',
        'height=700,width=900,top=100,left= 539.647'
      );
    }
}
