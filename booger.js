let booger = document.getElementById("booger");

document.body.addEventListener("mousemove", event => {      
    if (onMobile) return;

    let y = 0;
    if (event.x < 200) y = event.y - 32;
    if (event.x > 150) y *= (300 - event.x) / 150;
       
    if (y < 8) {
        y = 0;
        booger.style.borderRadius = "4px 8px 48px 8px";
        booger.style.height = "48px";

    } else if (y > container.clientHeight - 72) {
        y = container.clientHeight - 48;
        booger.style.borderRadius = "8px 48px 8px 4px";
        booger.style.height = "48px";

    } else {
        booger.style.height = "64px";
        booger.style.borderRadius = "12px 40px 40px 12px";
    }    

    booger.style.transform = "translateY(" + y + "px)";
});

document.body.onmouseleave = () => {
    booger.style.transform = "translateY(0)";
    booger.style.borderRadius = "4px 8px 48px 8px";
    booger.style.height = "48px";
};

booger.onclick = ()=> {

};