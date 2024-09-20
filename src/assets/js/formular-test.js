
var calculator_result = {
    result: null,
    note: null,
    input: null
};


function calculator(jsonResult) {
    try {
        
        calculator_result.input = JSON.parse(jsonResult)
         
        var total_point = 0;
        
        

        calculator_result.input.forEach(function (item) {
            try {
                if (item.point > 0)
                {
                    total_point += parseFloat(item.point);

                }
                
                
            } catch (error) {
                
            }
        });
        
        calculator_result.result = total_point;
        if (total_point >= 100) {
            calculator_result.note ="XUẤT SẮC";
        } else if (total_point > 80 && total_point < 100) {
            calculator_result.note = "GIỎI";
        } else if (total_point > 70 && total_point <= 80) {
            calculator_result.note = "KHÁ";
        } else if (total_point > 50 && total_point <= 70) {
            calculator_result.note = "TRUNG BÌNH";
        } else {
            calculator_result.note = "CHƯA ĐẠT";
        }

    }
    catch(err){
        
    }

    return JSON.stringify(calculator_result);
}
