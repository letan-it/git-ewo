import { Component, Output, EventEmitter, Input } from '@angular/core';
import { EnumStatus } from 'src/app/Core/_enum';
import { PosmService } from 'src/app/web/service/posm.service';
import { Helper } from 'src/app/Core/_helper';
@Component({
    selector: 'app-control-posm-list',
    templateUrl: './control-posm-list.component.html',
    styleUrls: ['./control-posm-list.component.scss'],
})
export class ControlPosmListComponent {
    constructor(private _service: PosmService) { }

    selectedPosm: any;
    listPosm: any;

    @Input() placeholder: any = '-- Choose -- ';
    @Output() outValue = new EventEmitter<string>();
    @Output() outList = new EventEmitter<any>();
    @Input() multiSelect: boolean = false;

    returnValue(value: any) {
        this.outValue.emit(value);
        if (this.multiSelect == true && Helper.IsNull(this.selectedPosm) == true) {
            this.outValue.emit(this.listPosm);
        }
    }

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.

        this.listPosm = [];
        this._service
            .GetPOSM_List(Helper.ProjectID())
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    data.data.forEach((element: any) => {
                        this.listPosm.push({
                            name: element.posm_code + ' - ' + element.posm_name,
                            id: element.posm_id,
                            posm_image: element.posm_image
                        });
                    });
                    this.outList.emit(this.listPosm);
                }
            });
    }
}
