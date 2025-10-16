document.getElementById('ice-cream').onsubmit = () => {

    clearErrors();

    //validate first name
    let fname = document.getElementById('fname').value.trim();
    let lname = document.getElementById('lname').value.trim();
    let email = document.getElementById('email').value.trim();
    let size = document.getElementById('size').value;
    let isValid = true;
    if(fname === "") {
        document.getElementById("err-fname").style.display = "block";
        isValid = false;
    }

    if(lname === "") {
        document.getElementById("err-lname").style.display = "block";
        isValid = false;
    }

    if(!email || email.indexOf("@") === -1) {
        document.getElementById("err-email").style.display = "block";
        isValid = false;
    }

    // validate methos
    let methodButton = document.getElementsByName("method");
    let count = 0;
    for(let i = 0; i < methodButton.length; i++)
    {
        if(methodButton[i].checked) {
            count++;
        }
    }
    if(count === 0) {
         document.getElementById("err-method").style.display = "block";
        isValid = false;
    }

    if(size ==="none") {
        document.getElementById("err-size").style.display = "block";
        isValid = false;
    }

    return isValid;
}

function clearErrors(){
    let errors = document.getElementsByClassName("error");
    for(let i = 0; i < errors.length; i++)
    {
        errors[i].style.display = "none";
    }
}