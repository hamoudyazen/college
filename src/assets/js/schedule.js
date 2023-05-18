const listItems = document.querySelectorAll('#myList li');

listItems.forEach(item => {
    item.classList.add('random-color');
});

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
}
