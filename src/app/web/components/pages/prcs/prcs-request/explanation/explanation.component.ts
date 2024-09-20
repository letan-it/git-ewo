import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import { MessageService } from 'primeng/api';
import { ActivationService } from 'src/app/web/service/activation.service';
import { SosService } from '../../../sos/services/sos.service';
import { Helper } from 'src/app/Core/_helper';
import { EnumStatus } from 'src/app/Core/_enum';
import { PrcsService } from '../../service/prcs.service';
import { Representative } from 'src/app/web/models/customer';
import { HttpClient } from '@angular/common/http';
import { Table } from 'primeng/table';

@Component({
    selector: 'app-prc-explanation',
    templateUrl: './explanation.component.html',
    styleUrls: ['./explanation.component.scss'],
})
export class ExplanationComponent {
    @Input() inValue: any;
    @Output() outValue = new EventEmitter<any>();

    constructor(
        private messageService: MessageService,
        private _service: PrcsService,
        private http: HttpClient
    ) {}
    representatives!: Representative[];

    statuses!: any[];

    loading: boolean = true;

    responsiveOptions!: any[];

    activityValues: number[] = [0, 100];
    empName: string = '';
    searchValue: string | undefined;
    data: any = [];
    num: any = 0;
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['inValue']) {
            if (!Helper.IsNull(this.inValue)) {
                this._service
                    .Prc_ProjectGetRequestDetail(
                        Helper.ProjectID(),
                        this.inValue.request_id
                    )
                    .subscribe((data: any) => {
                        if (data.result == EnumStatus.ok) {
                            this.data = data.data;
                            // console.log(this.data.step[0].images);
                            this.data.step[0].images = this.data.images;
                            this.responsiveOptions = [
                                {
                                    breakpoint: '300px',
                                    numVisible: 5,
                                },
                                {
                                    breakpoint: '200px',
                                    numVisible: 3,
                                },
                                {
                                    breakpoint: '100px',
                                    numVisible: 1,
                                },
                            ];
                            this.data.explanation.forEach((e: any) => {
                                e.atd_date = Helper.convertDateStr(e.atd_date);
                            });
                            const tmp = this.data.step.find(
                                (e: any) => e.order == 1
                            );
                            this.num = tmp.images.length;
                            if (tmp) {
                                this.empName = tmp.created_by_name || '';
                            }
                            this.loading = false;
                            this.responsiveOptions = [
                                {
                                    breakpoint: '1024px',
                                    numVisible: 5,
                                },
                                {
                                    breakpoint: '768px',
                                    numVisible: 3,
                                },
                                {
                                    breakpoint: '560px',
                                    numVisible: 1,
                                },
                            ];
                            console.log('data', this.data.step[0].images[0].file_url.split('').slice(-3).join(''));
                        } else {
                            this.data = [];
                        }
                    });
            }
        }
    }
    clear(table: Table) {
        table.clear();
        this.searchValue = '';
    }

    DownloadFile(url: string) {
        this.http.get(url, { responseType: 'blob' }).subscribe((blob: Blob) => {
            const downloadLink = document.createElement('a'); 
            const fileUrl = window.URL.createObjectURL(blob); 
            downloadLink.href = fileUrl; 
            downloadLink.download = `${url}`; 
            document.body.appendChild(downloadLink); 
            downloadLink.click(); 
            window.URL.revokeObjectURL(fileUrl); 
            document.body.removeChild(downloadLink);
        })
    }
}
