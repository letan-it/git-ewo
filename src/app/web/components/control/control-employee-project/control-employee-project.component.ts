import {
    Component,
    SimpleChanges,
    Output,
    EventEmitter,
    Input,
} from '@angular/core';
import { EnumLocalStorage } from 'src/app/Core/_enum';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { EmployeesService } from 'src/app/web/service/employees.service';

@Component({
    selector: 'app-control-employee-project',
    templateUrl: './control-employee-project.component.html',
    styleUrls: ['./control-employee-project.component.scss'],
})
export class ControlEmployeeProjectComponent {
    constructor(
        private _service: EmployeesService,
        private edService: EncryptDecryptService
    ) {}
    isLoadForm = 1;
    selectedEmployeeProject: any;
    listEmployeeProject: any;

    @Output() outValue = new EventEmitter<string>();
    @Input() placeholder: any = 'Select a project';

    @Input() itemEmployeeProject!: number;
    @Input() displayControl: boolean = false;

    currentUser: any;
    projectList: any;

    cities!: any;
    selectedCities!: any;

    LoadData() {
        try {
            this.isLoadForm = 1;
            let _u = localStorage.getItem(EnumLocalStorage.user);

            this.currentUser = JSON.parse(
                this.edService.decryptUsingAES256(_u)
            );
            this.projectList = this.currentUser.projects;
            this.projectList = this.projectList.map((item: any) => ({
                ...item,
                checked: false,
            }));

            this.listEmployeeProject = [];

            this.projectList.forEach((element: any) => {
                this.listEmployeeProject.push({
                    Id: element.project_id,
                    Image: element.image,
                    Name:
                        '[' +
                        element.project_id +
                        '] - ' +
                        ' ' +
                        element.project_code +
                        ' - ' +
                        element.project_name,
                });

                if (this.itemEmployeeProject > 0) {
                    this.selectedEmployeeProject =
                        this.listEmployeeProject.filter(
                            (item: any) => item.Id == this.itemEmployeeProject
                        )[0];
                } else {
                    this.selectedEmployeeProject = '';
                }
            });
            this.isLoadForm = 0;
        } catch (error) {}
    }
    ngOnInit(): void {
        this.LoadData();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['itemEmployeeProject']) {
            this.LoadData();
            // if (this.itemEmployeeProject == 0){
            //   this.selectedEmployeeProject = 'Select a list project';
            // }
        }
    }

    returnValue(value: any) {
        this.outValue.emit(value);
    }
}
