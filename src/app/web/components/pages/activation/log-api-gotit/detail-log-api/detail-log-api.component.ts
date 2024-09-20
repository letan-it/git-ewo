import { Component, Input } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-detail-log-api',
  templateUrl: './detail-log-api.component.html',
  styleUrls: ['./detail-log-api.component.scss']
})
export class DetailLogApiComponent {
  @Input() inValue: any;
  @Input() action: any = 'view';

  constructor(
    private messageService: MessageService
  ) { }

  handleCopy(text: string) {
    let input = document.createElement('input');
    document.body.appendChild(input);
    input.value = text;
    input.select();
    document.execCommand('copy');
    input.remove();

    this.messageService.add({
      severity: 'success',
      summary: 'Copy success'
    })
  }
}
