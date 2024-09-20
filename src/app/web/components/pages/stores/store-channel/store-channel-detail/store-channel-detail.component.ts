import { Component,Input,Output, EventEmitter} from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import { EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { Helper } from 'src/app/Core/_helper';
import { Pf } from 'src/app/_helpers/pf';
import { AppComponent } from 'src/app/app.component';
import { ShopsService } from 'src/app/web/service/shops.service';

@Component({
  selector: 'app-store-channel-detail',
  templateUrl: './store-channel-detail.component.html',
  styleUrls: ['./store-channel-detail.component.scss']
})
export class StoreChannelDetailComponent {
  constructor(
    private messageService: MessageService,
    private _service: ShopsService
) {}

@Input() action: any = 'create';
@Input() inValue: any;
@Output() newItemEvent = new EventEmitter<boolean>();

@Input() clearMess: any;

ListStoreChannel = [];
channel_code!: string;
channel_name!: string;
 
msgsInfo: Message[] = [];
_status: boolean = false;

clickStatus() {
    this._status == true ? false : true;
}
clear() {
    this.channel_code = '';
    this.channel_name = ''; 
    this._status = false;
}

createStoreChannel() {
    this.clearMess = true;

    if (Helper.IsNull(this.channel_code) == true) {
        this.msgsInfo = [];

        this.msgsInfo.push({
            severity: EnumStatus.warning,
            summary: EnumSystem.Notification,
            detail: 'Please enter a channel code',
            life: 3000,
        });
        // this.messageService.add({ severity: 'error',  summary: 'Error', detail: 'Please enter a channel code',});

        return;
    }

    if (Pf.checkLengthCode(this.channel_code) != true) {
        this.msgsInfo = [];

        this.msgsInfo.push({
            severity: EnumStatus.warning,
            summary: EnumSystem.Notification,
            detail: 'Character length of channel code must be greater than or equal to 8',
            life: 3000,
        });
        // this.messageService.add({ severity: 'error',  summary: 'Error', detail: 'Character length of channel code must be greater than or equal to 8',});

        return;
    }

    if (Pf.checkSpaceCode(this.channel_code) == true) {
        this.msgsInfo = [];

        this.msgsInfo.push({
            severity: EnumStatus.warning,
            summary: EnumSystem.Notification,
            detail: 'Channel code must not contain empty characters',
            life: 3000,
        });
        return;
    }
    if (Pf.checkUnsignedCode(this.channel_code) == true) {
        this.msgsInfo = [];

        this.msgsInfo.push({
            severity: EnumStatus.warning,
            summary: EnumSystem.Notification,
            detail: 'Channel code is not allowed to enter accented characters',
            life: 3000,
        });
        return;
    }

    if (Helper.IsNull(this.channel_name) == true) {
        this.msgsInfo = [];

        this.msgsInfo.push({
            severity: EnumStatus.warning,
            summary: EnumSystem.Notification,
            detail: 'Please enter a channel name',
            life: 3000,
        });
        return;
    }
 

    const check = this.inValue.filter(
        (item: any) => item.channel_code == this.channel_code
    );

    if (check.length > 0) {
        this.msgsInfo = [];

        this.msgsInfo.push({
            severity: EnumStatus.warning,
            summary: EnumSystem.Notification,
            detail: 'Channel code already exists',
            life: 3000,
        });
        return;
    } else {
      // status:number,
      // channel_code: string,
      // channel_name: string,
      // action: string

        this._service
            .ewo_Channels_Action(
                this._status == true ? 1 : 0,
                this.channel_code,
                this.channel_name, 
                'create'
            )
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    if (data.data == 1) {
                        AppComponent.pushMsg(
                            'System',
                            'current',
                            'Success create shop channel ',
                            EnumStatus.info,
                            0
                        );

                        this.clear();
                        this.addNewItem();
                    } else {
                        this.msgsInfo = [];
                        this.msgsInfo.push({
                            severity: EnumStatus.warning,
                            summary: EnumSystem.Notification,
                            detail: 'Error create store channel',
                            life: 3000,
                        });

                        AppComponent.pushMsg(
                            'System',
                            'current',
                            'Error create shop channel',
                            EnumStatus.info,
                            0
                        );

                        return;
                    }
                }
            });
    }
}

addNewItem() {
    this.newItemEvent.emit(false);
}
}
