import {
    Component,
    EventEmitter,
    Input,
    Output,
    SimpleChanges,
} from '@angular/core';
import { EnumStatus } from 'src/app/Core/_enum';
import { MastersService } from 'src/app/web/service/masters.service';

@Component({
    selector: 'app-control-channel',
    templateUrl: './control-channel.component.html',
    styleUrls: ['./control-channel.component.scss'],
})
export class ControlChannelComponent {
    constructor(private _service: MastersService) { }
    isLoadForm = 1;
    selectedChannel: any;
    listChannel: any;
    @Output() outValue = new EventEmitter<string>();

    // placeholder="Select a channel"
    @Input() itemChannel!: number;
    @Input() inputStyle: any = { minWidth: '100%', maxWidth: '150px' };
    nameChannel: string = 'Select a channel';

    LoadData() {
        try {
            this.isLoadForm = 1;
            this._service.ewo_GetChannels().subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    this.isLoadForm = 0;
                    this.listChannel = [];

                    data.data.forEach((element: any) => {
                        if (element.status == 1) {
                            this.listChannel.push({
                                name:
                                    '[' +
                                    element.channel_id +
                                    '] - ' +
                                    element.channel_code +
                                    ' - ' +
                                    element.channel_name,
                                code: element.channel_id,
                            });
                        }
                    });

                    if (this.itemChannel > 0) {
                        this.selectedChannel = this.listChannel.filter(
                            (item: any) => item.code == this.itemChannel
                        )[0];
                    } else {
                        this.selectedChannel = '';
                    }
                }
            });
        } catch (error) { }
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['itemChannel']) {
            this.LoadData();
        }
    }

    ngOnInit() {
        this.LoadData();
    }

    returnValue(value: any) {
        this.outValue.emit(value);
    }
}
