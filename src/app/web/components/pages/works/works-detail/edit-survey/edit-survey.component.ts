import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-edit-survey',
    templateUrl: './edit-survey.component.html',
    styleUrls: ['./edit-survey.component.scss'],
})
export class EditSurveyComponent {
    @Input() survey_data: any;
    ngOnChanges(changes: SimpleChanges): void {
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add '${implements OnChanges}' to the class.
        console.log(this.survey_data);
    }
}
