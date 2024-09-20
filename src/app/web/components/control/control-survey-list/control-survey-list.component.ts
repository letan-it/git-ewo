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
    selector: 'app-control-survey-list',
    templateUrl: './control-survey-list.component.html',
    styleUrls: ['./control-survey-list.component.scss'],
})
export class ControlSurveyListComponent {
    constructor(private _service: SurveyService) {}

    selectedSurvey: any;
    listSurvey: any;

    @Output() outValue = new EventEmitter<string>();
    @Input() placeholder: any = '-- Choose -- ';
    @Input() typeSurvey: any = 0;
    @Input() statusAction: any;

    @Input() itemSurvey!: number;
    nameSurvey: string = 'Select a Survey';

    ngOnInit() {
        this.listSurvey = [];
        this._service
            .ewo_GetSurveyList(Helper.ProjectID())
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    data.data.forEach((element: any) => {
                        if (element.status == 1) {
                            if (element.survey_type) {
                                this.typeSurvey.forEach((item: any) => {
                                    if (element.survey_type === item) {
                                        this.listSurvey.push({
                                            Id: element.survey_id,
                                            Name: `[${element.survey_id}] - ${element.survey_name}`,
                                            Order: element.order,
                                        });
                                    }
                                });
                            } else {
                                this.listSurvey.push({
                                    Id: element.survey_id,
                                    Name: `[${element.survey_id}] - ${element.survey_name}`,
                                    Order: element.order,
                                });
                            }
                        }

                        if (this.itemSurvey > 0) {
                            this.selectedSurvey = this.listSurvey.filter(
                                (item: any) => item.Id == this.itemSurvey
                            )[0];
                        } else {
                            this.selectedSurvey = '';
                        }
                    });

                    // Sắp xếp mảng listSurvey theo trường Order
                    this.listSurvey.sort((a: any, b: any) => a.Order - b.Order);
                }
            });
    }

    returnValue(value: any) {
        this.outValue.emit(value);
    }
}
