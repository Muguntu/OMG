// JavaScript Document

$( document ).ready(function() {
    // grap the text on H3 tag
    var power = $("h3").contents().filter(function() {
        return this.nodeType == 3;
    });
    
    // grap the number on the text from H3
    power = power[0].textContent.replace(/[^0-9]/gi, '');
    
    // show the number and transform it in base 10
    alert(parseInt(power, 10));
});