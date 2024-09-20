import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MessageService } from 'primeng/api';
import { OsaService } from 'src/app/web/service/osa.service';

@Component({
  selector: 'app-osa-form-details',
  templateUrl: './osa-form-details.component.html',
  styleUrls: ['./osa-form-details.component.scss']
})
export class OsaFormDetailsComponent {

  @Input() action: any = 'create';   
  @Output() newItemEvent = new EventEmitter<boolean>(); 
  @Input() inValue: any;  

  constructor(
    private _service : OsaService,
    private messageService: MessageService
  ){

  }

  quantity: number = 0
  price: number = 0
  oos: number = 0
  ooc: number = 0
  
  createOSAFrom(){

  }
}
