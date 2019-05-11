
let classname = document.getElementsByClassName("upgrades");


for (let i = 0; i < classname.length; i++) {
    classname[i].addEventListener('click', function(){
        classname[i].style.borderColor = "blue"
        classname[i].style.borderWidth = "thick"
    }, false);
}
