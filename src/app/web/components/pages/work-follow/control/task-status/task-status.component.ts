import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-task-status',
  templateUrl: './task-status.component.html',
  styleUrls: ['./task-status.component.scss']
})
export class TaskStatusComponent implements OnChanges {

  @Input() control: any = ''
  @Input() selected: any = ''
  @Input() action: any = ''
  @Input() placeholder: any = ''
  @Output() outValue = new EventEmitter<string>();
  list_data: any = ''
  select_item: any = ''
  ngOnInit(): void {
    if (this.control == 'status') {
      this.placeholder = 'selected a status'
      this.list_data = [
        { name: "ToDo" }, { name: "Develop" }, { name: "Deploy" }, { name: "Completed" }, { name: "Reject" }, { name: "Close" }
      ]
    }
    else if (this.control == 'testing-status') {
      this.placeholder = 'selected a testing status'
      this.list_data = [
        { name: "Wait Dev" }, { name: "Testing" }, { name: "Error" }, { name: "Pedding" }, { name: "No-Test" }, { name: "Pass" }, { name: "Re-open" }
      ]
    }
    else if (this.control == 'new-testing-status') {
      this.placeholder = 'selected a testing status'
      this.list_data = [
        { name: "Wait Dev" }, { name: "No-Test" }
      ]
      this.outValue.emit('No-Test');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['action']) {
      this.select_item = null
    }
    if (changes['selected']) {
      const status = changes['selected']?.currentValue
      if (status != undefined) {
        this.select_item = {
          name: status
        }
      } else {
        this.select_item = null
      }
    }
  }

  onSelectItem() {
    try {
      this.outValue.emit(this.select_item.name);
    } catch (error) {
      this.outValue.emit('');
    }
  }



}
