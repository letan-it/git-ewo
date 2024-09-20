import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-control-status-check',
  templateUrl: './control-status-check.component.html',
  styleUrls: ['./control-status-check.component.scss']
})
export class ControlStatusCheckComponent {
  @Input() status: any;
}
