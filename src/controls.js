export function getControls() {
        return Object.freeze({
                dx: input.keys.a ? -1 : input.keys.d ? 1 : 0,
                dy: input.keys.w ? -1 : input.keys.s ? 1 : 0,
                mouse: {
                        click: input.mouse.click,
                        direction: input.mouse.direction,
                },
        });
}

let input = {
        mouse: { x: 0, y: 0, direction: 0, click: false },
        keys: { w: false, a: false, s: false, d: false },
};

/* eslint-disable no-unused-vars */
window.addEventListener("mousedown", function (event) {
        input.mouse.click = true;
});

window.addEventListener("mouseup", function (event) {
        input.mouse.click = false;
});

window.addEventListener("keydown", function (event) {
        if (event.key == "w") input.keys.w = true;
        else if (event.key == "a") input.keys.a = true;
        else if (event.key == "s") input.keys.s = true;
        else if (event.key == "d") input.keys.d = true;
});

window.addEventListener("keyup", function (event) {
        if (event.key == "w") input.keys.w = false;
        else if (event.key == "a") input.keys.a = false;
        else if (event.key == "s") input.keys.s = false;
        else if (event.key == "d") input.keys.d = false;
});

window.addEventListener("mousemove", function (event) {
        input.mouse.x = event.clientX;
        input.mouse.y = event.clientY;
        input.mouse.direction = Math.atan2(
                event.clientY - window.innerHeight / 2,
                event.clientX - window.innerWidth / 2,
        );
});
