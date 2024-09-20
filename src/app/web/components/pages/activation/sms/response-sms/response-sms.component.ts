import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-response-sms',
  templateUrl: './response-sms.component.html',
  styleUrls: ['./response-sms.component.scss']
})
export class ResponseSmsComponent {
  @Input() inValue: any;
  @Input() action: any = 'view';
}
