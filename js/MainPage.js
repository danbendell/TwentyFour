function DisplayUserName() {
    console.log($('#inputName'));
    $('#inputName')[0].textContent = 'Welcome ' + $('#username')[0].value;
}

$(document).ready(function() {
    $('#start').click(DisplayUserName);
});
