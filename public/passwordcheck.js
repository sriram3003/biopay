function Validate() {
    var password = document.getElementById("psw").value;
    var confirmPassword = document.getElementById("psw1").value;
    if (password != confirmPassword) {
        alert("Passwords do not match.");
        return false;
    }
    return true;
 }