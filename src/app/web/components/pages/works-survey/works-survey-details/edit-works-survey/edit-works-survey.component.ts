import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-edit-works-survey',
  templateUrl: './edit-works-survey.component.html',
  styleUrls: ['./edit-works-survey.component.scss']
})
export class EditWorksSurveyComponent {
  @Input() survey_data: any;
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    console.log(this.survey_data);
  }
}