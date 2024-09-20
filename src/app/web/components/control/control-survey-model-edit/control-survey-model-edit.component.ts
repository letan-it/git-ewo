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
    selector: 'app-control-survey-model-edit',
    templateUrl: './control-survey-model-edit.component.html',
    styleUrls: ['./control-survey-model-edit.component.scss']
})
export class ControlSurveyModelEditComponent {
    constructor(private _service: MastersService) { }

    selectedSurveyModelEdit: any;
    listSurveyModelEdit: any;
    isLoadForm = 1;
    @Output() outValue = new EventEmitter<string>();
    @Input() placeholder: any = '-- Choose -- ';
    @Input() ListMaster: any = undefined;

    @Input() itemSurveyModelEdit!: number;

    @Input() code: any = 'model_edit';
    @Input() name: any = 'EN';
    @Input() nameSurveyModelEdit: string = 'Select a Model Edit';

    loadData() {
        this.isLoadForm = 1;
        if (this.ListMaster != undefined) {
            // this.ListMaster = this.ListMaster.filter(
            //     (x: any) => x.ListCode == this.code
            // );
            this.isLoadForm = 0;
            this.listSurveyModelEdit = [
                {
                    Value: 0,
                    Name: 'Không chỉnh sửa kết quả làm việc',
                },
                {
                    Value: 2,
                    Name: 'Được chỉnh sửa kết quả làm việc',
                }
            ];
            // this.ListMaster.forEach((element: any) => {
            //     // console.log(element.model_edit);
            //     if (element.model_edit === 0) {
            //         this.listSurveyModelEdit.push({
            //             Id: element.Id,
            //             Value: element.model_edit,
            //             Name: 'Không chỉnh sửa kết quả làm việc',
            //         });
            //     } else if (element.model_edit === 2) {
            //         this.listSurveyModelEdit.push({
            //             Id: element.Id,
            //             Value: element.model_edit,
            //             Name: 'Được chỉnh sửa kết quả làm việc',
            //         });
            //     } 
            // });

            // console.log(this.listSurveyModelEdit);

            if (this.itemSurveyModelEdit == 2) {
                this.selectedSurveyModelEdit = 'Được chỉnh sửa kết quả làm việc';
            } else {
                this.selectedSurveyModelEdit = 'Không chỉnh sửa kết quả làm việc'
            }
        }
    }
    ngOnInit() {
            
        this.loadData();
    }

    ngOnChanges(changes: SimpleChanges): void {
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add '${implements OnChanges}' to the class.
        if (changes['ListMaster'] || changes['itemSurveyModelEdit']) {
            this.loadData();
        }
    }
    returnValue(value: any) {
        this.outValue.emit(value);
    }
}
