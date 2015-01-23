// JavaScript Document


$( document ).ready(function() {
    // grap the text on input tag
    var power = $("input").contents().filter(function() {
        return this.nodeType == 3;
    });
    
    // grap the number on the text from input
    power = power[0].textContent.replace(/[^0-9]/gi, '');
    
    // show the number and transform it in base 10
    alert(parseInt(power, 10));
});




