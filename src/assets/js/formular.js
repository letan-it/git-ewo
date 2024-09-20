// name of formular:
// promotion_id: 
// last updated_date: 
// ******************************************************************
// OSA 10 | FACING 18
// Question: 2562 | facing
var promotion_id = 70;
var array_product_result = [];
const array_product_calculator = [5971,5993]; // thing to change


var calculator_result = {
    result: null,
    note: null,
    detail: [
        {
            itemId: null,
            result: null,
            note: null
        },
    ]
};

class setData {
 
    constructor(jsonResult) {
        array_product_result = [];
        const jsArray = JSON.parse(jsonResult);
        array_product_result = jsArray;
        // jsArray.forEach(element => {
        //         array_product_result.push({
        //             projectId: element.projectId,
        //             productId: element.productId,
        //             price: element.price,
        //             categoryId: element.categoryId,
        //             company: element.company,
        //             brandCode: element.brandCode,
        //             divisionCode: element.divisionCode,
        //             marketCode: element.marketCode,
        //             target: element.target,
        //             promotionId: element.promotionId,
        //             questionId: element.questionId,
        //             value: element.value,
        //             valueString: element.valueString,
        //             itemData: element.itemData
        //         });
        // });
    }
}


function cal_total_by_question(_productId,_questionId,_otherRequest)
{
    // return total
    if(_otherRequest=="")
    {
        d = 0.0;
        if(_productId==0)
        {
            array_product_result.forEach(item => {
                if(item.questionId == _questionId && item.value != null)
                {
                    d = d + parseFloat(item.value);
                }
            });
        }
        else{
            array_product_result.forEach(item => {
                if(item._questionId == _questionId && item.productId == _productId && item.value != null)
                {
                    d = d + parseFloat(item.value);
                }
            });
        }
        return d;
    }
    // return osa
    else if(_otherRequest=="OSA")
    {
        osa = 0;
        if(_productId==0)
        {
            array_product_result.forEach(item => {
                if(item.questionId == _questionId && item.value != null ) 
                {
                    osa = osa + 1
                }
            });
        }
        else{
            array_product_result.forEach(item => {
                if(item._questionId == _questionId && item.productId == _productId && item.value != null )
                {
                    osa = osa + 1;
                }
            });
        }
        return osa;
    }
}

///_groupLocation = input_quantity,input_price,input_stock
function cal_total(_productId,_groupLocation)
{
    
    d = 0.0;
    if(_productId==0)
    {
        array_product_result.forEach(item => {
            if(item.groupLocation == _groupLocation)
            {
                d = d + parseFloat(item.value);
            }
        });
    }
    else{
        array_product_result.forEach(item => {
            if(item.groupLocation == _groupLocation && item.productId == _productId)
            {
                d = d + parseFloat(item.value);
            }
        });
    }
    return d;
}

// check_tag, check_stock, check_display
function cal_check_all(_groupLocation)
{
    d = 1;
    array_product_result.forEach(item => {
        if(item.groupLocation == _groupLocation && item.value == 0)
        {
            return 0;
        }
    });
    return d;
}


function calculator(jsonResult) {
    try{
 
        proResult = 1;
        console.log('calculator-calculator',promotion_id);
        new setData(jsonResult);
        calculator_result.result = 0;
        calculator_result.note = "KETQUA";
        calculator_result.conditionDetails = "";
        calculator_result.detail = [];
        _lst_conditionDetails = [];

        // print for testing view
        array_product_result.forEach(element => {
            console.log('element',element);
        });

        // 0. check OSA 10
        total_osa = cal_total_by_question(0,2562,"OSA");
        percent_osa = ( total_osa / 10 ) * 100;
        percent_osa = percent_osa.toFixed(2);
        if(percent_osa >= 100)
        {
            _lst_conditionDetails.push({ itemId: 0, result: 1, note: "Äáº¡t - 100% OSA", value: "Tá»•ng OSA nháº­p: " + percent_osa +"%" , itemData: "PRODUCT" });
        }
        else
        {
            calculator_result.detail.push({ itemId: 0, result: 0, note: "KhĂ´ng Äáº¡t - ÄK 100% OSA", value: "Tá»•ng OSA nháº­p: " + percent_osa +"%" , itemData: "PRODUCT" });
            proResult = 0;
        }

        // 1. check facing 18
        total_facing =  cal_total_by_question(0,2562,"");
        percent_facing = (total_facing/18)*100;
        percent_facing = percent_facing.toFixed(2);
        if(percent_facing >= 100)
        {
            _lst_conditionDetails.push({ itemId: 1, result: 1, note: "Äáº¡t - 100% Facing", value: "Tá»•ng Facing nháº­p: " + percent_facing +"%", itemData: "PRODUCT" });
        }
        else
        {
            calculator_result.detail.push({ itemId: 1, result: 0, note: "KhĂ´ng Äáº¡t - ÄK 100% Facing", value: "Tá»•ng Facing nháº­p: " + percent_facing +"%", itemData: "PRODUCT" });
            proResult = 0;
        }



        calculator_result.conditionDetails = JSON.stringify(_lst_conditionDetails);
        calculator_result.result = proResult;

    }
    catch(err){
        calculator_result.result = -1;
        calculator_result.note = err.toString();
        calculator_result.detail = [];
    }

    return JSON.stringify(calculator_result);
}
