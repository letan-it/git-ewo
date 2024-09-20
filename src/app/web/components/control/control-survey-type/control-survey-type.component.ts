import {
    Component,
    Output,
    Input,
    EventEmitter,
    SimpleChanges,
} from '@angular/core';
import { EnumStatus } from 'src/app/Core/_enum';
import { MastersService } from 'src/app/web/service/masters.service';
import { Helper } from 'src/app/Core/_helper';
@Component({
    selector: 'app-control-survey-type',
    templateUrl: './control-survey-type.component.html',
    styleUrls: ['./control-survey-type.component.scss'],
})
export class ControlSurveyTypeComponent {
    constructor(private _service: MastersService) { }

    selectedSurveyType: any;
    listSurveyType: any;
    isLoadForm = 1;
    @Output() outValue = new EventEmitter<string>();
    @Input() placeholder: any = '-- Choose -- ';
    @Input() ListMaster: any = undefined;

    @Input() itemSurveyType!: number;

    @Input() code: any = 'survey_type';
    @Input() name: any = 'EN';
    @Input() nameSurveyType: string = 'Select a Survey Type';

    // code: string = 'survey_type';

    loadData() {
        this.isLoadForm = 1;
        if (this.ListMaster != undefined) {
            this.ListMaster = this.ListMaster.filter(
                (x: any) => x.ListCode == this.code
            );
            this.isLoadForm = 0;
            this.listSurveyType = [];
            this.ListMaster.forEach((element: any) => {
                if (this.name == 'EN') {
                    this.listSurveyType.push({
                        Id: element.Id,
                        Name: ' ' + element.Code + ' - ' + element.NameEN,
                    });
                } else {
                    this.listSurveyType.push({
                        Id: element.Id,
                        Name: ' ' + element.Code + ' - ' + element.NameVN,
                        NameVN: element.NameVN,
                    });
                }
            });

            console.log(this.listSurveyType);

            if (this.itemSurveyType > 0) {
                this.selectedSurveyType = this.listSurveyType.filter(
                    (item: any) => item.Id == this.itemSurveyType
                )[0];
            } else {
                this.selectedSurveyType = '';
            }
        } else {
            this._service
                .ewo_GetMaster(Helper.ProjectID())
                .subscribe((data: any) => {
                    this.isLoadForm = 0;

                    if (data.result == EnumStatus.ok) {
                        this.listSurveyType = [];

                        data.data = data.data.filter(
                            (x: any) => x.ListCode == this.code
                        );

                        data.data.forEach((element: any) => {

                            if (this.name == 'EN') {
                                this.listSurveyType.push({
                                    Id: element.Id,
                                    Name: ' ' + element.Code + ' - ' + element.NameEN,
                                });
                            } else {
                                this.listSurveyType.push({
                                    Id: element.Id,
                                    Name: ' ' + element.Code + ' - ' + element.NameVN,
                                    NameVN: element.NameVN,
                                });
                            }

                        });

                        if (this.itemSurveyType > 0) {
                            this.selectedSurveyType =
                                this.listSurveyType.filter(
                                    (item: any) =>
                                        item.Id == this.itemSurveyType
                                )[0];
                        } else {
                            this.selectedSurveyType = '';
                        }
                    }
                });
        }
    }
    ngOnInit() {
        // console.log(this.ListMaster);
        this.loadData();
    }

    ngOnChanges(changes: SimpleChanges): void {
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add '${implements OnChanges}' to the class.
        if (changes['ListMaster'] || changes['itemSurveyType']) {
            this.loadData();
        }
    }
    returnValue(value: any) {
        this.outValue.emit(value);
    }
}
