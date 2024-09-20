import {
    Component,
    EventEmitter,
    Input,
    Output,
    SimpleChanges,
} from '@angular/core';
import { MessageService } from 'primeng/api';
import { ActivationService } from 'src/app/web/service/activation.service';
import { SosService } from '../../../sos/services/sos.service';
import { Helper } from 'src/app/Core/_helper';
import { EnumStatus } from 'src/app/Core/_enum';

@Component({
    selector: 'app-sos',
    templateUrl: './sos.component.html',
    styleUrls: ['./sos.component.scss'],
})
export class SosComponent {
    @Input() inValue: any;
    @Output() outValue = new EventEmitter<any>();

    constructor(
        private _service: ActivationService,
        private messageService: MessageService,
        private SosService: SosService
    ) {}

    //listInValue: any = []
    ngOnChanges(changes: SimpleChanges): void {
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add '${implements OnChanges}' to the class.
        if (changes['inValue']) {
            if (Helper.IsNull(this.inValue) != true) {
                //this.listInValue = this.inValue
            }
        }
    }

    // ngOnInit(): void {
    //     console.log('sos', this.inValue);

    // }

    openOnRowEdit: boolean = false;
    onRowEditInit(product: any) {
        // this.SosService.Reasons_sos_GetList(Helper.ProjectID(), "")
        //   .subscribe((data: any) => {
        //     if (data.result == EnumStatus.ok) {
        //       this.reasons = data.data.reason_list;
        //     }
        //   }
        // )
    }

    reason: any = null;
    reasons: any = [];
    onRowEditSave(sos: any) {
        if (sos.width > 0 && sos.total_width > 0) {
            this.SosService.Details_Action(
                Helper.ProjectID(),
                sos.id,
                +sos.width,
                +sos.total_width,
                +sos.foot,
                +sos.facing,
                sos.note
            ).subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    // sos.reason_name = this.reason?.reason_name;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: '',
                    });
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: '',
                    });
                }
            });
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Data transmitted must be greater than 0',
                detail: '',
            });
        }
    }

    onRowEditCancel(sos: any, index: number) {}

    selectedSOS: any = [];
    sos_code: any;
    selectSOS_Filter(event: any, result: any) {
        this.sos_code = '';
        console.log('selectSOS_Filter : ', event);
        console.log(result);
        if (Helper.IsNull(event.value) != true && event.value.length > 0) {
            event.value.forEach((element: any) => {
                this.sos_code += element.code + ',';
            });
        } else {
            this.sos_code = '';
        }
        this.filterSOS(this.sos_code, result);
    }

    filterSOS(sos_code: string, result: any) {
        // 14729,
        console.log('filterSOS - sos_code : ', sos_code);

        const filterValues = sos_code.split(',');

        console.log('filterValues :', filterValues);
        filterValues.forEach((fil: any) => {
            console.log('fil : ', fil);
        });

        if (sos_code != '' && sos_code != null && sos_code != undefined) {
            // details = details.filter((item: any) => filterValues.includes(item.sos_code));

            //console.log('this.listinValue : ', this.listinValue)
            let details = [] as any;
            this.inValue.data_sos.forEach((r: any) => {
                if (r.result_id == result.result_id) {
                    details = r.details.filter((item: any) =>
                        filterValues.includes(item.sos_code)
                    );
                }
            });

            this.inValue.data_sos.forEach((r: any) => {
                if (r.result_id == result.result_id) {
                    r.details = details;
                }
            });
        }
    }

    clearSelectSOS(result: any) {
        let details = [] as any;
        this.inValue.data_sos.forEach((r: any) => {
            if (r.result_id == result.result_id) {
                details = r.details;
            }
        });

        this.inValue.data_sos.forEach((r: any) => {
            if (r.result_id == result.result_id) {
                r.details = details;
            }
        });
    }

    getSeverity(status: string): any {
        switch (status) {
            case 'OK':
                return 'success';
            default:
                return 'danger';
            /*
    case 'LOWSTOCK':
      return 'warning';
      */
        }
    }

    urlGallery: any;
    showImageSOS(url: any) {
        this.urlGallery = url;
        document.open(
            <string>this.urlGallery,
            'windowName',
            'height=700,width=900,top=100,left= 539.647'
        );
    }
}
