function opentextarea() {
    var input = document.createElement('TEXTAREA');
    input.setAttribute('name', 'post');
    input.setAttribute('maxlength', 5000);
    input.setAttribute('cols', 80);
    input.setAttribute('rows', 40);
    var button = document.createElement('BUTTON');
    document.getElementById("body").innerHTML=input, button;
}
