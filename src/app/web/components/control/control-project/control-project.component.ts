import {
    Component,
    Output,
    Input,
    EventEmitter,
    SimpleChanges,
} from '@angular/core';
import { EnumLocalStorage, EnumStatus } from 'src/app/Core/_enum';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';
import { EmployeesService } from 'src/app/web/service/employees.service';

@Component({
    selector: 'app-control-project',
    templateUrl: './control-project.component.html',
    styleUrls: ['./control-project.component.scss'],
})
export class ControlProjectComponent {
    constructor(
        private _service: EmployeesService,
        private edService: EncryptDecryptService
    ) { }
    isLoadForm = 1;
    selectedEmployeeProject: any;
    listEmployeeProject: any;

    @Output() outValue = new EventEmitter<string>();
    @Input() placeholder: any = 'Select a list project';

    @Input() itemEmployeeProject!: number;
    @Input() existsData: any = undefined;
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

            // this.listEmployeeProject = this.projectList;

            this.listEmployeeProject = [];

            this.projectList.forEach((element: any) => {
                this.isLoadForm = 0;
                if (this.existsData != undefined) {
                    const checkExists = this.existsData.filter(
                        (data: any) => data.project_id == element.project_id
                    );
                    // console.log('checkExists', checkExists);
                    if (checkExists.length == 0) {
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
                    }
                } else {
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
                }
                if (this.itemEmployeeProject != undefined) {
                    this.selectedEmployeeProject =
                        this.listEmployeeProject.filter(
                            (item: any) => item.Id == this.itemEmployeeProject
                        )[0];
                } else {
                    this.selectedEmployeeProject = '';
                    // this.listEmployeeProject = []
                }
            });
        } catch (error) { }
    }
    ngOnInit(): void {
        this.LoadData();
    }

    ngOnChanges(changes: SimpleChanges): void {
        // if (changes['itemEmployeeProject']) {
        //     this.LoadData();
        // }
        this.LoadData();
    }

    returnValue(value: any) {
        this.outValue.emit(value);
    }
}
