import { Component, Input } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EnumStatus } from 'src/app/Core/_enum';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { SurveyService } from 'src/app/web/service/survey.service';

@Component({
    selector: 'app-survey-form-default',
    templateUrl: './survey-form-default.component.html',
    styleUrls: ['./survey-form-default.component.scss'],
})
export class SurveyFormDefaultComponent {
    constructor(
        private messageService: MessageService,
        private edService: EncryptDecryptService,
        private surveyService: SurveyService
    ) {}
    listMulti: any;

    selectedMulti!: any;
    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.tempModel = undefined;
        this.selectedMulti = [];
        if (this.survey_data.item_data.question_type == 'check') {
            this.survey_data.item_data.value_int_cb = this.checkboxValue(
                this.survey_data.item_data.value_int
            );
        }
        if (this.survey_data.item_data.question_type == 'select') {
            this.tempModel = {
                answer_id: this.survey_data.item_data.value_int,
                question_id: this.survey_data.item_data.question_id,
                value: this.survey_data.item_data.value_string,
            };
        }
        if (this.survey_data.item_data.question_type == 'multi-select') {
            this.listMulti = this.survey_data.tab.detail.filter(
                (x: any) =>
                    x.question_group ==
                    this.survey_data.item_data.question_group
            );
            console.log(this.listMulti);
            this.listMulti.forEach((element: any) => {
                this.selectedMulti.push({
                    answer_id: element.value_int,
                    question_id: element.question_id,
                    value: element.value_string,
                });
            });
        }
    }
    @Input() survey_data: any;
    checkboxValue(val: number) {
        let value: boolean;
        if (val == 1) {
            return true;
        } else {
            return false;
        }
    }
    updateDateInt(item: any) {
        item.value_int = parseInt(item.value_string);
        console.log(item);
        this.surveyService
            .ewo_Survey_detail_UpdateItem(
                item.id,
                item.question_type,
                item.support_data,
                item.typeOf,
                item.value_string,
                item.value_int,
                null
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'data is updated successfully',
                    });
                }
            });
    }

    updateDateString(item: any) {
        item.value_int = parseInt(item.value_string);
        console.log(item);
        this.surveyService
            .ewo_Survey_detail_UpdateItem(
                item.id,
                item.question_type,
                item.support_data,
                item.typeOf,
                item.value_string,
                item.value_int,
                null
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'data is updated successfully',
                    });
                }
            });
    }
    updateDateDecimal(item: any) {
        item.value_int = parseInt(item.value_string);
        console.log(item);
        this.surveyService
            .ewo_Survey_detail_UpdateItem(
                item.id,
                item.question_type,
                item.support_data,
                item.typeOf,
                item.value_string,
                null,
                item.value_decimal
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'data is updated successfully',
                    });
                }
            });
    }
    tempModel: any;
    updateDateSelect(item: any) {
        item.value_string = this.tempModel.value;
        item.value_int = this.tempModel.answer_id;

        this.surveyService
            .ewo_Survey_detail_UpdateItem(
                item.id,
                item.question_type,
                item.support_data,
                item.typeOf,
                item.value_string,
                item.value_int,
                null
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'data is updated successfully',
                    });
                }
            });
    }
    changeYesNo(item: any) {
        console.log(item);
        if (item.value_int_cb == false) {
            item.value_int = 0;
            item.value_string = 'Không';
        } else {
            item.value_int = 1;
            item.value_string = 'Có';
        }
    }
    updateDateMulti(item: any) {
        console.log(item);
        console.log(this.selectedMulti);
        const answerIds = this.selectedMulti
            .map((item: any) => item.answer_id)
            .join(',');

        this.surveyService
            .ewo_Survey_detail_UpdateItem(
                item.id,
                item.question_type,
                item.support_data,
                item.typeOf,
                answerIds,
                item.value_int,
                null
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'data is updated successfully',
                    });
                }
            });
    }
    updateDateYesNo(item: any) {
        console.log(item);
        this.surveyService
            .ewo_Survey_detail_UpdateItem(
                item.id,
                item.question_type,
                item.support_data,
                item.typeOf,
                item.value_string,
                item.value_int,
                null
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'data is updated successfully',
                    });
                }
            });
    }
}
