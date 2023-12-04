/*
File: script.js
Created: 12/3/2023
GUI Assignment: Interactive Dynamic Table
    My website consists of:
    - a dynamic multiplication table that changes based off input 
    - takes in numbers from -50 to 50
    - organized in a clean and consistent way
    - jQuery validation
    - tabbed interface

Sources: 
    https://stackoverflow.com/questions/64134943/how-to-get-value-from-an-input-field-in-javascript?rq=3
    https://stackoverflow.com/questions/28695617/how-to-get-a-number-value-from-an-input-field
    https://www.youtube.com/watch?v=5Oq6Eqy7Y_A
    https://www.w3schools.com/html/html_tables.asp
    https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_table_center
    https://www.w3schools.com/tags/tag_fieldset.asp
    https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_sticky_element
    https://www.w3schools.com/howto/howto_css_sticky_element.asp
    https://www.w3schools.com/html/html_forms.asp
    https://www.w3schools.com/jquery/html_html.asp

Copyright (c) 2023 by ThienTran. All rights reserved. 
May be freely copied/excerpted for educational purposes 
with credit to the author.

Updated by TL on 12/3/2023
*/

$(document).ready(function() {
    check(); // Added check() function so that the jQuery validation still works even if user has not submitted
    $("#box").css('height', 'auto'); // Added this css method to make form container more flexible
    document.getElementById('myForm').addEventListener("submit", function(event) {
        console.log("Submitted");
        event.preventDefault();
        check();
    });
});

function check() { // Checks if all of the user's inputs are valid before making the multiplication table
    // Added new check methods to see if max col and row values are larger than their min counterparts
    // Also added new check methods to see if any of the inputs are decimals are not and if they are we do not
    // allow it.
    // Credit to this stackoverflow link to helping how to create my own .addMethod().
    // -> https://stackoverflow.com/questions/14347177/how-can-i-validate-that-the-max-field-is-greater-than-the-min-field
    // Also credit to this jQuery validation link to helping understand some new concepts and functions.
    // -> https://jqueryvalidation.org/documentation/
    $.validator.addMethod("greaterThan_Col", function () {
        let min_c_val = Number(document.getElementById("min_cVal").value);
        let max_c_val = Number(document.getElementById("max_cVal").value);
        return max_c_val >= min_c_val;
    }, "Max column value must be greater than or equal to min.");
    $.validator.addMethod("greaterThan_Row", function () {
        let min_r_val = Number(document.getElementById("min_rVal").value);
        let max_r_val = Number(document.getElementById("max_rVal").value);
        return max_r_val >= min_r_val;
    }, "Max row value must be greater than or equal to min.");
    $.validator.addMethod("isMinCVal_decimal", function () {
        let min_cval = Number(document.getElementById("min_cVal").value);
        if (min_cval % 1 === 0) {
            return true;
        } else {
            return false;
        }
    }, "Error: Min Column Value must be an integer.");
    $.validator.addMethod("isMaxCVal_decimal", function () {
        let max_cval = Number(document.getElementById("max_cVal").value);
        if (max_cval % 1 === 0) {
            return true;
        } else {
            return false;
        }
    }, "Error: Max Column Value must be an integer.");
    $.validator.addMethod("isMinRVal_decimal", function () {
        let min_rval = Number(document.getElementById("min_rVal").value);
        if (min_rval % 1 === 0) {
            return true;
        } else {
            return false;
        }
    }, "Error: Min Row Value must be an integer.");
    $.validator.addMethod("isMaxRVal_decimal", function () {
        let max_rval = Number(document.getElementById("max_rVal").value);
        if (max_rval % 1 === 0) {
            return true;
        } else {
            return false;
        }
    }, "Error: Max Row Value must be an integer.");
    $('#myForm').validate({
        errorClass: "msg-error", // set the error messages to this custom particular class I made.
        rules: { // All the rules for each input box and pretty much checks if the input is a number
            min_cInput: { // checks if its in range between -300 and 300, if its a decimal or not, and..
                number: true, // checks if there is input at all.
                range: [-300, 300],
                isMinCVal_decimal: true, // if its not a decimal, we are good.
                required: true
            },
            max_cInput: {
                number: true,
                range: [-300, 300],
                greaterThan_Col: '#min_cInput',
                isMaxCVal_decimal: true,
                required: true
            }, 
            min_rInput: {
                number: true,
                range: [-300, 300],
                isMinRVal_decimal: true,
                required: true
            },
            max_rInput: {
                number: true,
                range: [-300, 300],
                greaterThan_Row: '#min_rInput',
                isMaxRVal_decimal: true,
                required: true
            }
        },
        messages: { // All the custom error messages for each input box
            min_cInput: {
                number: "Error: Input has to be a valid number.",
                range: "Error: Number is out of range, please input a number between -300 and 300 inclusively.",
                required: "Required: Please input a valid number between -300 and 300 inclusively."
            },
            max_cInput: {
                number: "Error: Input has to be a valid number.",
                range: "Error: Number is out of range, please input a number between -300 and 300 inclusively.",
                required: "Required: Please input a valid number between -300 and 300 inclusively."
            },
            min_rInput: {
                number: "Error: Input has to be a valid number.",
                range: "Error: Number is out of range, please input a number between -300 and 300 inclusively.",
                required: "Required: Please input a valid number between -300 and 300 inclusively."
            },
            max_rInput: {
                number: "Error: Input has to be a valid number.",
                range: "Error: Number is out of range, please input a number between -300 and 300 inclusively.",
                required: "Required: Please input a valid number between -300 and 300 inclusively."
            }
        },
        submitHandler: function() { // If submission was valid, we make the table visible and generate it based 
            let output = document.getElementById('tab'); // on input.
            output.style.display = "block";
            mult_table();
            return false;
        }, // If submission was invalid, we make the table not visible along with scroll bar.
        invalidHandler: function() {
            let scroll = document.getElementById('tab');
            scroll.style.display = "none";
            $("#Multiplication-Table").empty();
            $("#box").css('height', 'auto');
        },
    });
}

function mult_table() {
    let min_c_val = Number(document.getElementById("min_cVal").value);
    let max_c_val = Number(document.getElementById("max_cVal").value);
    let min_r_val = Number(document.getElementById("min_rVal").value);
    let max_r_val = Number(document.getElementById("max_rVal").value);
    // Should always enter this condition, if it does not we console.log("Smth").
    if ((max_r_val >= min_r_val) && (max_c_val >= min_c_val)) {
        const tr = '<tr>';
        const tr_end = '</tr>';
        const td = '<td>';
        const td_end = '</td>';
        const th = '<th>';
        const th_end = '</th>';
        let table_stuff = tr + th + th_end;

        // Builds the top header or row
        for (let i = min_r_val; i <= max_r_val; i++) {
            table_stuff += th + i + th_end;
        }

        // Builds the rest of rows and data
        for (let i = min_c_val; i <= max_c_val; i++) {
            // Outer loop builds the side header or first column header
            table_stuff += tr + th + i + th_end;
            // Inner loop builds the rest of the table cells
            for (let j = min_r_val; j <= max_r_val; j++) {
                let result = i * j;
                table_stuff += td + result + td_end;
            }
            table_stuff += tr_end;
        }

        // Credit to this link from w3schools -> 
        $('#Multiplication-Table').html(table_stuff); // Used this instead of .innerHTML
        // let table = document.getElementById("Multiplication-Table");
        // table.innerHTML = table_stuff; // Tried table.innerHTML, made very wacky changes to my css so
        // I used a jQuery version of innerHTML that I messed around with as shown above.
        return false;
    } else {
        console.log("Something went wrong");
        return false;
    }
}