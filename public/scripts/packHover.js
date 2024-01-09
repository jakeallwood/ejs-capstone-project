// var items = document.querySelectorAll(".card");
// console.log(items);

// items.forEach(card => {
//   card.addEventListener("click", function() {
//     card.classList.toggle("selected");
//   })
// });

const ANGLE = 15;
const ROTATE_CARD = window;

const lerp = (start, end, amount) => {
  return (1 - amount) * start + amount * end;
};

const remap = (value, oldMax, newMax) => {
  const newValue = ((value + oldMax) * (newMax * 2)) / (oldMax * 2) - newMax;
  return Math.min(Math.max(newValue, -newMax), newMax);
};

window.addEventListener("DOMContentLoaded", (event) => {
  const packs = document.querySelectorAll(".pack");
  packs.forEach((e) => {
    e.addEventListener("mousemove", (event) => {
      const rect = e.getBoundingClientRect();
      const centreX = (rect.left + rect.right) / 2;
      const centreY = (rect.top + rect.bottom) / 2;
      const posX = event.pageX - centreX;
      const posY = event.pageY - centreY;
      const x = remap(posX, rect.width / 2, ANGLE);
      const y = remap(posY, rect.height / 2, ANGLE);
      e.dataset.rotateX = x;
      e.dataset.rotateY = -y;
    });

    e.addEventListener("mouseout", (event) => {
      e.dataset.rotateX = 0;
      e.dataset.rotateY = 0;
    });

    e.addEventListener("click", (event) => {
      window.location.href="/open-pack";
    })
  });

  const update = () => {
    packs.forEach((e) => {
      let currentX = parseFloat(e.style.getPropertyValue('--rotateY').slice(0, -1));
			let currentY = parseFloat(e.style.getPropertyValue('--rotateX').slice(0, -1));
			if (isNaN(currentX)) currentX = 0;
			if (isNaN(currentY)) currentY = 0;
			let x = lerp(currentX, e.dataset.rotateX, 0.05);
			let y = lerp(currentY, e.dataset.rotateY, 0.05);

      if ((x > 0 && x <= 0.001) || (x < 0 && x >= -0.001)) x = 0;
      if ((y > 0 && y <= 0.001) || (y < 0 && y >= -0.001)) y = 0;
			e.style.setProperty("--rotateY", x + "deg");
			e.style.setProperty("--rotateX", y + "deg");
    })
  }
  setInterval(update, 1000/60);
});