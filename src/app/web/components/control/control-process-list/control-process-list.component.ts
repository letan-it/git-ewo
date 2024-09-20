import {
  Component,
  Output,
  EventEmitter,
  Input,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-control-process-list',
  templateUrl: './control-process-list.component.html',
  styleUrls: ['./control-process-list.component.scss']
})
export class ControlProcessListComponent {

  filterProcesses: any;

  @Output() outValue = new EventEmitter<string>();

  selectedFilterProcess(event: any) {

  }
}
