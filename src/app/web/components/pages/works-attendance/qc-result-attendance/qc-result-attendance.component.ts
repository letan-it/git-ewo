import { Component, Input, SimpleChanges } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { AppComponent } from 'src/app/app.component';
import { QcsService } from 'src/app/web/service/qcs.service';

@Component({
  selector: 'app-qc-result-attendance',
  templateUrl: './qc-result-attendance.component.html',
  styleUrls: ['./qc-result-attendance.component.scss']
})
export class QcResultAttendanceComponent {
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private qcService: QcsService
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

                }
            });
    } catch (error) { }
}
ngOnChanges(changes: SimpleChanges): void {
    if (changes['inValue']) {
        this.loadData();
    }
}
ngOnInit(): void { }
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
