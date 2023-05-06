function map_function_to_canvas(func, x) {
    return func((x - canvas.width / 2) / (canvas.width / x_scale)) * (canvas.height / y_scale) + canvas.height / 2
}

function map_to_canvas(x, y) {
    cx = (x * (canvas.width / x_scale)) + canvas.width / 2;
    cy = (y * (canvas.height / y_scale)) + canvas.height / 2;
    return [cx, cy];
}

function map_to_function(x, y) {
    fx = (x - canvas.width / 2) / (canvas.width / x_scale)
    fy = (x - canvas.height / 2) / (canvas.height / y_scale)
    return [fx, fy];
}

function f(x) {
    return ((x ** 4) - 3 * (x ** 2) - x + 0.5);
}

function df(x) {
    return (4 * (x ** 3) - 6 * x - 1);
}

function newtons_method(x) {
    return x - f(x) / df(x)
}

function draw_line(sx, sy, ex, ey) {
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
}

function draw_point(x, y) {
    [cx, cy] = map_to_canvas(c, y);
    ctx.ellipse(cx, cy, 5, 5, 0, 0, 360);
    ctx.fill();
}

function draw_axis(func) {
    ctx.beginPath();
    ctx.strokeStyle = "black";
    draw_line(0, canvas.height / 2, canvas.width, canvas.height / 2);
    draw_line(canvas.width / 2, 0, canvas.width / 2, canvas.height);
    ctx.stroke();
}

function draw_function(func, color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    for (x = 1; x < canvas.width; x++) draw_line(x - 1, map_function_to_canvas(func, x - 1), x, map_function_to_canvas(func, x));
    ctx.stroke();
}

function draw_setup() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 3;
    draw_axis();
    draw_function(f, "red");
    ctx.lineWidth = 1;
}

var animation = 0;
var timeout_id;

function animate() {
    // console.log("here, animation is", animation);
    if (animation == 0) { //if animation is off, start it
        // console.log("setting animation to 5");
        animation = 10;
    }
    draw_setup();
    draw_function((x) => (f(c) + df(c) * (x - c)), "blue");
    ctx.fillStyle = "green";
    c = newtons_method(c);
    draw_point(c, 0);
    if (--animation) timeout_id = setTimeout(animate, 1000);
}

function newtons_method_click(e) {
    var rect = canvas.getBoundingClientRect();
    clearTimeout(timeout_id);
    c = map_to_function(e.clientX - rect.left, rect.top + rect.height - e.clientY)[0];
    animation = 0;
    animate();
}

function newtons_method_animation() {
    c = -.4;
    animation = 0;
    animate();
}

function main() {
    ctx.transform(1, 0, 0, -1, 0, canvas.height)
    canvas.onclick = newtons_method_click;
    newtons_method_animation();
}