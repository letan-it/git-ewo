import {
    Component,
    Output,
    Input,
    EventEmitter,
    SimpleChanges,
} from '@angular/core';
import { EnumStatus } from 'src/app/Core/_enum';
import { SurveyService } from 'src/app/web/service/survey.service';
import { Helper } from 'src/app/Core/_helper';
@Component({
    selector: 'app-control-question-master',
    templateUrl: './control-question-master.component.html',
    styleUrls: ['./control-question-master.component.scss'],
})
export class ControlQuestionMasterComponent {
    constructor(private _service: SurveyService) {}

    selectedQuestionMaster: any;
    listQuestionMaster: any;
    isLoadForm = 1;
    @Output() outValue = new EventEmitter<string>();
    @Input() placeholder: any = '-- Choose -- ';

    @Input() itemQuestionMaster!: number;
    nameQuestionMaster: string = 'Select a question master';

    @Input() itemQuestion_type!: string;
    @Input() itemSupport_data!: string;
    @Input() itemTypeOf!: string;

    LoadData() {
        try {
            this.isLoadForm = 1;
            const qus_master = JSON.parse(
                localStorage.getItem('QuestionMaster') + ''
            );

            if (qus_master != null && qus_master.length > 0) {
                const data = qus_master;
                this.isLoadForm = 0;
                this.listQuestionMaster = [];
                this.selectedQuestionMaster = '';
                data.forEach((element: any) => {
                    this.listQuestionMaster.push({
                        Code: element.name,
                        question_type: element.question_type,
                        support_data: element.support_data,
                        typeOf: element.typeOf,
                        Name:
                            ' ' + element.name + ' - ' + element.question_type,
                    });

                    if (
                        this.itemQuestion_type != null &&
                        this.itemTypeOf != null
                    ) {
                        this.selectedQuestionMaster =
                            this.listQuestionMaster.filter(
                                (item: any) =>
                                    item.question_type ==
                                        this.itemQuestion_type &&
                                    item.support_data ==
                                        this.itemSupport_data &&
                                    item.typeOf == this.itemTypeOf
                            )[0];
                    } else {
                        this.selectedQuestionMaster = '';
                    }
                });
            } else {
                this._service
                    .SurveyQuestionMaster(Helper.ProjectID())
                    .subscribe((data: any) => {
                        localStorage.setItem(
                            'QuestionMaster',
                            JSON.stringify(data.data)
                        );
                        this.isLoadForm = 0;
                        this.listQuestionMaster = [];
                        this.selectedQuestionMaster = '';

                        if (data.result == EnumStatus.ok) {
                            data.data.forEach((element: any) => {
                                this.listQuestionMaster.push({
                                    Code: element.name,
                                    question_type: element.question_type,
                                    support_data: element.support_data,
                                    typeOf: element.typeOf,
                                    Name:
                                        ' ' +
                                        element.name +
                                        ' - ' +
                                        element.question_type,
                                });

                                if (
                                    this.itemQuestion_type != null &&
                                    this.itemTypeOf != null
                                ) {
                                    this.selectedQuestionMaster =
                                        this.listQuestionMaster.filter(
                                            (item: any) =>
                                                item.question_type ==
                                                    this.itemQuestion_type &&
                                                item.support_data ==
                                                    this.itemSupport_data &&
                                                item.typeOf == this.itemTypeOf
                                        )[0];
                                } else {
                                    this.selectedQuestionMaster = '';
                                }
                            });
                        }
                    });
            }
        } catch (error) {}
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (
            changes['itemQuestion_type'] ||
            changes['itemTypeOf'] ||
            changes['itemSupport_data']
        ) {
            this.LoadData();
        }
    }

    ngOnInit() {
        // this.LoadData();
    }

    returnValue(value: any) {
        this.outValue.emit(value);
    }
}
