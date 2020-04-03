window.onscroll = function() {scrollFunction()};
function scrollFunction() {
    let backToTopBtn = document.getElementById("backToTop");
    if (document.body.scrollTop > 1000 || document.documentElement.scrollTop > 1000) {
        backToTopBtn.style.display = "block ";
    } else {
        backToTopBtn.style.display = "none";
    }
}
function backToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}