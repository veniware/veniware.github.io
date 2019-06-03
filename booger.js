let booger = document.getElementById("booger");

addEventListener("mousemove", event => {       
    let y = 0;

    if (event.x < 200) y = event.y - 32;
    if (event.x > 72) y *= (300 - event.x) / 250;

    if (y < 16) {
        y = 0;
        booger.style.borderRadius = "4px 8px 48px 8px";
        booger.style.height = "48px";

    } else if (y > container.clientHeight - 48 - 16) {
        y = container.clientHeight - 48;
        booger.style.borderRadius = "8px 48px 8px 4px";
        booger.style.height = "48px";

    } else {
        booger.style.borderRadius = "12px 40px 40px 12px";
        booger.style.height = "64px";
    }
    
    booger.style.top = y + "px";
});