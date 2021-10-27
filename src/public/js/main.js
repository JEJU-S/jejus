const title = document.getElementById('project-title');
const info = document.getElementById('project-info');

setTimeout(function revealTitle() {
    title.style.opacity='1';
}, 700);

setTimeout(function revealInfo() {
    info.style.opacity='1';
}, 1400);