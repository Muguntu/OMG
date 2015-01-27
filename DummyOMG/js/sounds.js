// JavaScript Document
document.getElementById('button').onclick = (function() {
    document.getElementsByTagName('audio')[0].play();
    document.getElementsByTagName('span')[0].innerHTML = 'Hello bitchception!';
    return false;
});