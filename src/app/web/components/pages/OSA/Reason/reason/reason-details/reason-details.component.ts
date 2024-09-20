import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { TaskFileService } from 'src/app/Service/task-file.service';
import { Pf } from 'src/app/_helpers/pf';
import { AppComponent } from 'src/app/app.component';
import { FileService } from 'src/app/web/service/file.service';
import { OsaService } from 'src/app/web/service/osa.service';

@Component({
    selector: 'app-reason-details',
    templateUrl: './reason-details.component.html',
    styleUrls: ['./reason-details.component.scss'],
})
export class ReasonDetailsComponent {
    constructor(
        private messageService: MessageService,
        private _service: OsaService,
        private _file: FileService,
        private taskService: TaskFileService
    ) { }

    reason_name!: string;
    _status: boolean = false;

    @Input() action: any = 'create';
    @Input() clearMess: any;
    @Input() inValue: any;

    @Output() newItemEvent = new EventEmitter<boolean>();

    clear() {
        this.reason_name = '';
        this._status = false;
    }
    createReasonList() {
        if (this.NofiIsNull(this.reason_name, 'reason name') == 1) {
            return;
        } else {
            const reasonList = this.inValue.filter(
                (x: any) => x.reason_name == this.reason_name
            );
            if (reasonList.length > 0) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: 'Reason name already exist',
                });
                return;
            }
            this._service
                .OSA_ReasonAction(
                    0,
                    Helper.ProjectID(),
                    this.reason_name,
                    'create',
                    this._status == true ? 1 : 0
                )
                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        if (data.data) {
                            AppComponent.pushMsg(
                                'Page Reason',
                                'Create reason',
                                'Create reason successfull',
                                EnumStatus.info,
                                0
                            );

                            this.clear();
                            this.addNewItem();
                            return;
                        } else {
                            this.clearMess = false;
                        }
                    }
                });
        }
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

    addNewItem() {
        this.newItemEvent.emit(false);
    }
}
