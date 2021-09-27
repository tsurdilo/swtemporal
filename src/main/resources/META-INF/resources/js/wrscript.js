$(document).ready(function() {

    function ajaxCall(method, url, combinedObj) {
        $.ajax({
            type: method,
            async: true,
            url: url,
            data: JSON.stringify(combinedObj),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                console.log("Response Data");
                console.log(response);
                var jsonResult = JSON.stringify(response);
                $("#results").val(unescape(jsonResult));
            },
            error: function (err) {
                console.log(err);
            }
        });
    }

    $("#runWorkflow").click(function(event) {
        event.preventDefault();
        var form = $('#customerForm');
        var method = form.attr('method');
        var url = form.attr('action');


        var formData = {
            "customer": {}
        };
        $.each($(form).serializeArray(), function() {
            if(this.name == "age") {
                formData.customer[this.name] = parseInt(this.value);
            } else {
                formData.customer[this.name] = this.value;
            }
        });

        var model = monaco.editor.getModels()[0];
        var modelVal = model.getValue();

        var combinedData = {};
        combinedData["workflowdata"] = JSON.stringify(formData);
        combinedData["workflowdsl"] = modelVal;

        console.log(JSON.stringify(combinedData));

        ajaxCall(method, url, combinedData);
    });


    // $("#defaultData").click(function(event) {
    //     event.preventDefault();
    //     $('#firstname').val('Mortadelo');
    //     $('#lastname').val('Filemon');
    //     $('#address_street').val('Rua del Percebe 13');
    //     $('#address_city').val('Madrid');
    //     $('#address_zip').val('28010');
    //     $("[name='emails[0]']").val('superintendencia@cia.es');
    // });

});

