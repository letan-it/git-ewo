import {
    Component,
    EventEmitter,
    Input,
    Output,
    SimpleChanges,
} from '@angular/core';
import { EmployeesService } from '../../service/employees.service';
import { EnumStatus } from 'src/app/Core/_enum';

@Component({
    selector: 'app-employee-task',
    templateUrl: './employee-task.component.html',
    styleUrls: ['./employee-task.component.scss'],
})
export class EmployeeTaskComponent {
    @Input() control: any = '';
    @Input() action: any = '';
    @Input() team: any = '';
    @Input() assignees: any = '';
    @Input() employee_id: number = 0;
    @Output() outValue = new EventEmitter<number>();
    @Output() outValueTeam = new EventEmitter<any>();
    constructor(private employeeService: EmployeesService) { }
    select_item: any;
    list_data: any = [];
    style: any = { minWidth: '100%', 'border-color': 'none' };
    ngOnInit(): void { }
    ngOnChanges(changes: SimpleChanges): void {

        
            
        if (changes['action']) {
            if (this.action == 'clear') {
                this.select_item = undefined
                this.onSelectItem(this.select_item)
            }
        };
        if (changes['team']) {
            const res = this.team?.split(',')
            const commonElements = this.list_data?.filter((value: any) => res?.some((e: any) => e == value.code));
            this.select_item = commonElements
        }

        if (changes['assignees']) {
            const selectUser = this.list_data.filter((e: any) => (e.code == this.assignees))
            if (selectUser) {
                this.select_item = selectUser[0]
            }

        };
        if (changes['employee_id'] ) {
            this.load_data()
        };


    }
    load_data() {
        this.employeeService
            .GetEmployees(this.employee_id)
            .subscribe((data: any) => {
                if (data.result == EnumStatus.ok) {
                    data.data.forEach((item: any) => {
                        this.list_data.push({
                            name: `${item.position} - ${item.employee_name}`,
                            code: item.employee_id,
                        });
                    });
                }
            });

    }

    //Add '${implements OnChanges}' to the class.

    onSelectItem(e: any) {

        if (this.control == '') {
            try {
                this.outValue.emit(this.select_item.code as number);
            } catch (error) {
                this.outValue.emit(0);
            }
        } else {
            try {
                this.outValueTeam.emit(this.select_item);
            } catch (error) {
                this.outValueTeam.emit(null);
            }
        }
    }
}
