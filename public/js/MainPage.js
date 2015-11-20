function DisplayUserName() {
    console.log($('#inputName'));
}

$(document).ready(function() {
    $('#start').click(DisplayUserName);
});
