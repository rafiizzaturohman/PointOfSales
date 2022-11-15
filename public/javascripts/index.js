$(document).ready(function () {
    $('#users-table').DataTable();
    $('#units-table').DataTable();
});

var loadFile = function (event) {
    var reader = new FileReader();
    reader.onload = function () {
        var output = document.getElementById('output');
        output.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
};