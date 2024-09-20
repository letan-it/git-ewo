import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import { EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { Pf } from 'src/app/_helpers/pf';
import { AppComponent } from 'src/app/app.component';
import { SurveyService } from 'src/app/web/service/survey.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-add-survey',
    templateUrl: './add-survey.component.html',
    styleUrls: ['./add-survey.component.scss'],
})
export class AddSurveyComponent {
    constructor(
        private messageService: MessageService,
        private _service: SurveyService
    ) { }

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
    }
    @Input() action: any = 'create';
    @Input() inValue: any;
    @Output() newItemEvent = new EventEmitter<boolean>();
    @Output() newItemListSurvey = new EventEmitter<any>();
    @Input() clearMess: any;

    ListStoreRouter = [];

    survey_name!: string;
    order!: number;
    _status!: boolean;
    status: number = 0;

    item_SurveyType: number = 0;
    selectSurveyType(event: any) {
        this.item_SurveyType = event != null ? event.Id : 0;
    }

    // msgsInfo: Message[] = [];

    clear() {
        this.survey_name = '';
        this.order = 0;
        this._status = false;
        this.item_SurveyType = 0;
    }

    createSurvey() {
        this.clearMess = true;

        if (
            this.NofiIsNull(this.survey_name, 'survey name') == 1 ||
            this.NofiIsNull(this.order, 'order') == 1 ||
            this.checkNumber(this.order, 'Order') == 1 ||
            this.NofiIsNull(this.item_SurveyType, 'survey type') == 1
        ) {
            return;
        } else {
            this._service
                .ewo_SurveyFormAction(
                    Helper.ProjectID(),
                    this.survey_name,
                    this.order,
                    this._status == true
                        ? (this.status = 1)
                        : (this.status = 0),
                    this.item_SurveyType,
                    0,
                    'create',
                    0
                )

                .subscribe((data: any) => {
                    if (data.result == EnumStatus.ok) {
                        if (data.data) {
                            AppComponent.pushMsg(
                                'Page Survey',
                                'Create form survey',
                                'Create form survey successfull',
                                EnumStatus.info,
                                0
                            );
                            // this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Success Create Survey' });

                            this.clear();
                            this.addNewItem(data.data);
                            return;
                        } else {

                            this.NofiResult('Page Survey', 'Create form survey', 'Create form survey error', 'error', 'Error');
                            return;
                        }
                    }
                });
        }
    }

    addNewItem(data: any) {
        this.newItemEvent.emit(false);
        this.newItemListSurvey.emit(data)
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
        let check = 0;
        if (Helper.number(value) != true && Helper.IsNull(value) != true) {
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
}
