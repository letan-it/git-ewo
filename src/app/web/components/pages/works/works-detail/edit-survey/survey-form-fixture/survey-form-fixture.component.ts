import { filter } from 'rxjs/operators';
import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { TaskFileService } from 'src/app/Service/task-file.service';
import { FileService } from 'src/app/web/service/file.service';
import { EnumLocalStorage, EnumStatus, EnumSystem } from 'src/app/Core/_enum';
import { AppComponent } from 'src/app/app.component';
import { Helper } from 'src/app/Core/_helper';
import { EncryptDecryptService } from 'src/app/Service/encrypt-decrypt.service';

@Component({
    selector: 'app-survey-form-fixture',
    templateUrl: './survey-form-fixture.component.html',
    styleUrls: ['./survey-form-fixture.component.scss'],
})
export class SurveyFormFixtureComponent {
    constructor(
        private taskService: TaskFileService,
        private _file: FileService,
        private edService: EncryptDecryptService,

    ) { }
    @Input() survey_data: any;
    selected: any;
    quantity: any | undefined;
    returnValue(item: any) {
        this.survey_data.item_data.value_string = item.value;
        this.survey_data.item_data.value_int = item.answer_id;
        console.log(this.survey_data);
        console.log(this.survey_data.item_data.select);
    }
    file!: any;
    // On file Select
    onChange(event: any) {
        //this.clearDataImport();
        this.file = event.target.files[0];
    }
    project:any 
    projectName () {
        let _u = localStorage.getItem(EnumLocalStorage.user);
        this.project = JSON.parse(
            this.edService.decryptUsingAES256(_u)
        ).projects.filter(
            (d: any) => d.project_id == Helper.ProjectID()
        )[0];
        console.log(this.project);
    }

    ngOnChanges(changes: SimpleChanges): void {
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add '${implements OnChanges}' to the class.

        this.survey_data.item_data.select = {
            answer_id: this.survey_data.item_data.value_int,
            question_id: this.survey_data.item_data.question_id,
            value: this.survey_data.item_data.value_string,
        };
        console.log(this.survey_data.item_data.select);
        this.quantity = this.survey_data.item_data.answer_item.filter(
            (i: any) => i.action_id == 1
        )[0];
        this.projectName ();
    }
    remove_image(itemToRemove: any) {
        this.survey_data.item_data.answer_item =
            this.survey_data.item_data.answer_item.filter(
                (item: any) => item.id !== itemToRemove.id
            );
    }
    @ViewChild('myInputFile') myInputFile: any;

    clearImage() {
        this.myInputFile.nativeElement.value = null;
        this.file = undefined;
    }
    imageUpload!: any;
    addObject() {
        const newObj = {
            id: '/* new id */',
            action_id: ' /* new action_id */',
            action: '/* new action */',
            answer_item: '/* new answer_item */',
            label: '/* new label */',
            data: '/* new data */',
        };

        this.survey_data.item_data.answer_item.push(newObj);
    }
    importImage(event: any) {
        this.imageUpload = event.target.files[0];
        this.taskService
            .ImageRender(this.imageUpload, this.imageUpload.name)
            .then((file) => {
                this.imageUpload = file;
                console.log(this.imageUpload);

                const formUploadImageBefore = new FormData();
                formUploadImageBefore.append('files', this.imageUpload);
                formUploadImageBefore.append('ImageType', 'SURVEY_IMAGE');
                formUploadImageBefore.append('WriteLabel', '-');
                // this._file
                //     .UploadImage(formUploadImageBefore)
                //     .subscribe((data: any) => {
                //         if (data.result == EnumStatus.ok) {
                //             let url = EnumSystem.fileLocal + data.data;
                //             console.log(url);
                //         }
                //     });

                    const fileName = AppComponent.generateGuid();
                    const newFile = new File([this.imageUpload], fileName+this.imageUpload.name.substring(this.imageUpload.name.lastIndexOf('.')),{type: this.imageUpload.type});
                    const modun = 'SURVEY_IMAGE';
                    const drawText = '-';
                    this._file.FileUpload(newFile, this.project.project_code,modun, drawText).subscribe(
                        (response : any) => {  
                            let url = response.url; 
                            console.log(url);
                        },
                        (error : any) => { 
                            let url = '';
                        }
                    );
            });
    }
}
