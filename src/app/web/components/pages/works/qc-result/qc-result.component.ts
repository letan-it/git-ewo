import { Component, Input, SimpleChanges } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { AppComponent } from 'src/app/app.component';
import { QcsService } from 'src/app/web/service/qcs.service';

@Component({
    selector: 'app-qc-result',
    templateUrl: './qc-result.component.html',
    styleUrls: ['./qc-result.component.scss'],
    providers: [ConfirmationService, MessageService],
})
export class QcResultComponent {
    constructor(
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private qcService: QcsService,
        private edService: EncryptDecryptService
    ) { }
    events: any;
    @Input() inValue: any;
    @Input() KPI: any;
    @Input() item_id: any = 0;
    @Input() Guid: any = '0';
    history: any;
    result: any;
    action: any;
    loadData() {
        try {
            this.history = undefined;
            this.result = undefined;
            this.action = undefined;

            this.qcService
                .ewo_QC_Result_Setup(this.inValue)
                .subscribe((result: any) => {
                    if (result.result == EnumStatus.ok) {

                        this.action = result.data.action;

                        this.history = result.data.history.filter(
                            (item: any) =>
                                item.KPI == this.KPI &&
                                item.item_id == this.item_id &&
                                item.GUID.toUpperCase() == this.Guid.toUpperCase()
                        );

                        this.result = result.data.result.filter(
                            (item: any) =>
                                item.KPI == this.KPI &&
                                item.item_id == this.item_id &&
                                item.GUID.toUpperCase() == this.Guid.toUpperCase()
                        )[0];

                        console.log ( 'result.data.action - QC', result.data.action)
                        console.log ( 'result.data.history - QC', result.data.history)
                        console.log ( 'result.data.result - QC', result.data.result)
                    }
                });
        } catch (error) { }
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['inValue']) {
            this.loadData();
        }
    }
    ngOnInit(): void { this.loadUser()}

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

    _id: any;
    _result: any;
    _note: any;
    confirm(event: Event, id: number, result: string, note: string) {
        this._id = id;
        this._result = result;

        if (result == 'SUPOK') {
            if (note == undefined) {
                note = 'Đồng ý';
            }
        } else {
            if (Helper.IsNull(note) == true) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Notify',
                    detail: 'Please enter Note',
                });
                return;
            }
        }
        this._note = note;
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure that you want to proceed?',
            icon: 'pi pi-exclamation-triangle',

            accept: () => {
                this.qcService
                    .ewo_QC_Result_Action(this._result, this._note, this._id)
                    .subscribe((data: any) => {
                        if (data.result == EnumStatus.ok) {
                            this.messageService.add({
                                severity: 'info',
                                summary: 'Confirmed',
                                detail: 'You have accepted: ' + this._result,
                            });

                            AppComponent.pushMsg(
                                'Page Works',
                                'current',
                                'You have accepted: ' + this._result,
                                EnumStatus.info,
                                0
                            );

                            this._id = undefined;
                            this._result = undefined;
                            this._note = undefined;
                            this.loadData();
                        } else {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Rejected',
                                detail: data.message,
                            });
                        }
                    });
            },
            reject: () => {
                // this.messageService.add({
                //     severity: 'error',
                //     summary: 'Rejected',
                //     detail: 'You have rejected',
                // });

                AppComponent.pushMsg(
                    'Page Works',
                    'current',
                    'You have rejected',
                    EnumStatus.info,
                    0
                );

                this._id = undefined;
                this._result = undefined;
                this._note = undefined;
            },
        });
    }
}
