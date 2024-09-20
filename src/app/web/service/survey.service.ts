import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class SurveyService {
    constructor(private httpClient: HttpClient) {}
    private api_EWO_Survey = environment.api_EWO_Survey + 'Survey/';

    ewo_GetSurveyList(project_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());
        return this.httpClient.post(
            this.api_EWO_Survey + 'ewo_GetSurveyList',
            body
        );
    }

    ewo_SurveyQuestion(survey_id: number) {
        const body = new FormData();
        body.append('survey_id', survey_id.toString());
        return this.httpClient.post(
            this.api_EWO_Survey + 'ewo_SurveyQuestion',
            body
        );
    }
    ewo_question_ConditionShow_Update(
        question_id: number,
        condition_show: string
    ) {
        const body = new FormData();
        body.append('question_id', question_id.toString());
        body.append('condition_show', condition_show.toString());
        return this.httpClient.post(
            this.api_EWO_Survey + 'ewo_question_ConditionShow_Update',
            body
        );
    }
    ewo_question_ConditionShow(survey_id: number) {
        const body = new FormData();
        body.append('survey_id', survey_id.toString());
        return this.httpClient.post(
            this.api_EWO_Survey + 'ewo_question_ConditionShow',
            body
        );
    }
    Survey_condition_action(
        id: number,
        question_id: number,
        question_condition_id: number,
        condition: string,
        value: string,
        action: string
    ) {
        return this.httpClient.post(
            this.api_EWO_Survey + 'Survey_condition_action',
            {
                id,
                question_id,
                question_condition_id,
                condition,
                value,
                action,
            }
        );
    }

    ewo_SurveyAnswers(question_id: number) {
        const body = new FormData();
        body.append('question_id', question_id.toString());
        return this.httpClient.post(
            this.api_EWO_Survey + 'ewo_SurveyAnswers',
            body
        );
    }

    SurveyQuestionMaster(project_id: number) {
        const body = new FormData();
        body.append('project_id', project_id.toString());
        return this.httpClient.post(
            this.api_EWO_Survey + 'SurveyQuestionMaster',
            body
        );
    }

    ewo_GetShopList(
        year_month: number,
        survey_id: number,
        project_id: number,
        shop_code: string,
        customer_shop_code: string,
        project_shop_code: string,
        shop_type_id: number,
        province_id: number,
        district_id: number,
        ward_id: number,
        channel_id: number,
        router_id: number,
        status: number,
        is_test: number,
        manager_id: number,
        rowPerPage: number,
        pageNumber: number
    ) {
        return this.httpClient.post(this.api_EWO_Survey + 'ewo_GetShopList', {
            year_month,
            survey_id,
            project_id,
            shop_code,
            customer_shop_code,
            project_shop_code,
            shop_type_id,
            province_id,
            district_id,
            ward_id,
            channel_id,
            router_id,
            status,
            is_test,
            manager_id,
            rowPerPage,
            pageNumber,
        });
    }

    ewo_SurveyShopsAction(
        action: string,
        project_id: number,
        survey_id: number,
        shop_id: string,
        year_month: number
    ) {
        return this.httpClient.post(
            this.api_EWO_Survey + 'ewo_SurveyShopsAction',
            {
                action,
                project_id,
                survey_id,
                shop_id,
                year_month,
            }
        );
    }
    ewo_Survey_detail_UpdateItem(
        Id: any,
        QuestionType: any,
        SupportData: any,
        TypeOf: any,
        ValueString: any,
        ValueInt: any,
        ValueDecimal: any
    ) {
        return this.httpClient.post(
            this.api_EWO_Survey + 'ewo_Survey_detail_UpdateItem',
            {
                Id,
                QuestionType,
                SupportData,
                TypeOf,
                ValueString,
                ValueInt,
                ValueDecimal,
            }
        );
    }

    ewo_SurveyFormAction(
        project_id: number,
        survey_name: string,
        order: number,
        status: number,
        survey_type: number,
        model_edit: number,
        action: string,
        survey_id: number
    ) {
        return this.httpClient.post(
            this.api_EWO_Survey + 'ewo_SurveyFormAction',
            {
                project_id,
                survey_name,
                order,
                status,
                survey_type,
                model_edit,
                action,
                survey_id,
            }
        );
    }

    ewo_SurveyQuestionAction(
        survey_id: number,
        question_name: string,
        question_group: string,
        group: string,
        desc: string,
        question_type: string,
        support_data: string,
        typeOf: string,
        is_comment: number,
        order: number,
        min_value: any,
        max_value: any,
        min_image: number,
        max_image: number,
        is_allow: number,
        next_question: number,
        status: number,
        action: string,
        question_id: number,
        html_desc: string
    ) {
        return this.httpClient.post(
            this.api_EWO_Survey + 'ewo_SurveyQuestionAction',
            {
                survey_id,
                question_name,
                question_group,
                group,
                desc,
                question_type,
                support_data,
                typeOf,
                is_comment,
                order,
                min_value,
                max_value,
                min_image,
                max_image,
                is_allow,
                next_question,
                status,
                action,
                question_id,
                html_desc,
            }
        );
    }

    ewo_SurveyAnswersAction(
        question_id: number,
        value: string,
        quick_test: string,
        point: number,
        status: number,
        next_question: number,
        action: string,
        answer_id: number,
        data: any
    ) {
        return this.httpClient.post(
            this.api_EWO_Survey + 'ewo_SurveyAnswersAction',
            {
                question_id,
                value,
                quick_test,
                point,
                status,
                next_question,
                action,
                answer_id,
                data
            }
        );
    }
    Report_SurveyFile_Action(
        survey_result_id: number,
        uuid: string,
        guid: string,
        question_id: number,
        question_name: string,
        url: string,
        year_month: number
    ) {
        return this.httpClient.post(
            this.api_EWO_Survey + 'Report_SurveyFile_Action',
            {
                survey_result_id,
                uuid,
                guid,
                question_id,
                question_name,
                url,
                year_month,
            }
        );
    }

    ewo_Survey_Shops_ImportData(formDataUpload: FormData, project_id: number) {
        formDataUpload.append('project_id', project_id.toString());
        return this.httpClient.post(
            this.api_EWO_Survey + 'ewo_Survey_Shops_ImportData',
            formDataUpload
        );
    }

    ewo_Survey_Scheduler_GetItem(survey_id: number) {
        const body = new FormData();
        body.append('survey_id', survey_id.toString());
        return this.httpClient.post(
            this.api_EWO_Survey + 'ewo_Survey_Scheduler_GetItem',
            body
        );
    }
    ewo_Survey_answers_GetCalConfig(survey_id: number) {
        const body = new FormData();
        body.append('survey_id', survey_id.toString());
        return this.httpClient.post(
            this.api_EWO_Survey + 'ewo_Survey_answers_GetCalConfig',
            body
        );
    }
    ewo_Survey_answers_GetCalConfig_action(
        survey_id: number,
        nextquestion_configuration: string
    ) {
        return this.httpClient.post(
            this.api_EWO_Survey + 'ewo_Survey_answers_GetCalConfig_action',
            {
                survey_id,
                nextquestion_configuration,
            }
        );
    }
    ewo_Survey_Scheduler(
        survey_id: number,
        scheduler_type: string,
        week: any,
        month: any,
        position: any,
        category: any
    ) {
        return this.httpClient.post(
            this.api_EWO_Survey + 'ewo_Survey_Scheduler',
            {
                survey_id,
                scheduler_type,
                week,
                month,
                position,
                category,
            }
        );
    }
    ewo_Survey_form_configuration_Update(
        survey_id: number,
        configuration: string
    ) {
        return this.httpClient.post(
            this.api_EWO_Survey + 'ewo_Survey_form_configuration_Update',
            {
                survey_id,
                configuration,
            }
        );
    }

    ewo_Survey_form_formulaFile_Update(
        survey_id: number,
        formula: any
    ) {
        return this.httpClient.post(
            this.api_EWO_Survey + 'ewo_Survey_form_formulaFile_Update',
            {
                survey_id,
                formula,
            }
        );
    }

    ewo_Survey_question_Clone(
        question_id: number,
        survey_id: number,
        question_group_new: string,
        question_name_new: string,
        desc_new: string
    ) {
        return this.httpClient.post(
            this.api_EWO_Survey + 'ewo_Survey_question_Clone',
            {
                question_id,
                survey_id,
                question_group_new,
                question_name_new,
                desc_new,
            }
        );
    }
    ewo_Model_SurveyData_Fixture_Import(formDataUpload: FormData) {
        return this.httpClient.post(
            this.api_EWO_Survey + 'ewo_Model_SurveyData_Fixture_Import',
            formDataUpload
        );
    }

    Survey_question_FormEdit(survey_id: number) {
        const body = new FormData();
        body.append('survey_id', survey_id.toString());
        return this.httpClient.post(
            this.api_EWO_Survey + 'Survey_question_FormEdit',
            body
        );
    }
    private api_EWO_QuickTest = environment.api_EWO_Survey + 'QuickTest/';

    GET_Quicktest(
        project_id: number,
        from_date: number,
        to_date: number,
        employee_id: number,
        RowPerPage: number,
        PageNumber: number
    ) {
        return this.httpClient.post(this.api_EWO_QuickTest + 'GET_Quicktest', {
            project_id,
            from_date,
            to_date,
            employee_id,
            RowPerPage,
            PageNumber,
        });
    }
    GET_DetailQuickTest(quick_result_id: number, survey_id: number) {
        return this.httpClient.post(
            this.api_EWO_QuickTest + 'GET_DetailQuickTest',
            {
                quick_result_id,
                survey_id,
            }
        );
    }

    GET_employee_quicktest(project_id: number, survey_id: number) {
        return this.httpClient.post(
            this.api_EWO_QuickTest + 'GET_employee_quicktest',
            {
                project_id,
                survey_id,
            }
        );
    }

    employee_quicktest_action(
        project_id: number,
        employee_code: string,
        survey_id: number,
        count_question: number
    ) {
        return this.httpClient.post(
            this.api_EWO_QuickTest + 'employee_quicktest_action',
            {
                project_id,
                employee_code,
                survey_id,
                count_question,
            }
        );
    }
}
