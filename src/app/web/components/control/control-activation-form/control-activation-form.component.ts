import {
    Component,
    Input,
    Output,
    OnInit,
    OnChanges,
    SimpleChanges,
    EventEmitter,
} from '@angular/core';
import { EnumStatus } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { ActivationService } from 'src/app/web/service/activation.service';

@Component({
    selector: 'app-control-activation-form',
    templateUrl: './control-activation-form.component.html',
    styleUrls: ['./control-activation-form.component.scss'],
})
export class ControlActivationFormComponent {
    @Input() inputStyle: any = { minWidth: '100%', maxWidth: '150px' };
    @Output() outValue = new EventEmitter<any>();

    constructor(private _service: ActivationService) {}

    form_id!: any;
    selectedForm: any;
    listForm: any[] = [];
    isLoadForm: number = 0;
    rowPerPage: number = 1000000;
    pageNumber: number = 1;

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.getData();
    }

    getData() {
        this._service
            .activation_form_GetList(
                Helper.ProjectID(),
                '',
                -1,
                0,
                0,
                this.rowPerPage,
                this.pageNumber
            )
            .subscribe((res: any) => {
                if ((res.result = EnumStatus.ok)) {
                    res.data.data?.forEach((i: any) => {
                        if (i.status == 1) {
                            this.listForm.push({
                                code: i.form_id,
                                name: `[${i.form_id}] - ${i.form_name}`,
                                form_name: i.form_name,
                            });
                        }
                    });
                }
            });
    }

    returnValue(e: any) {
        if (e == null) {
            this.outValue.emit(null);
        } else {
            this.outValue.emit(e);
        }
    }
}
