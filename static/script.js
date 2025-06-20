let selectedNumber = null;
const filledCounts = {};
const totalCounts = {};
let isDragging = false;

document.querySelectorAll('.cell').forEach(cell => {
  const num = cell.dataset.number;
  totalCounts[num] = (totalCounts[num] || 0) + 1;
});

const buttons = document.querySelectorAll('.palette button');

buttons.forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    buttons.forEach(btn => btn.classList.remove('selected'));
    selectedNumber = button.dataset.number;
    button.classList.add('selected');
    document.querySelectorAll('.cell').forEach(cell => {
      if (cell.dataset.number === selectedNumber && cell.textContent !== '') {
        cell.classList.add('highlight');
      } else {
        cell.classList.remove('highlight');
      }
    });
  });
});

function fillCell(cell) {
  if (!selectedNumber) return;
  if (cell.dataset.number === selectedNumber && cell.textContent !== '') {
    cell.style.backgroundColor = cell.dataset.color;
    cell.textContent = '';
    cell.classList.remove('highlight');
    cell.classList.add('filled');
    cell.style.border = 'none';
    filledCounts[selectedNumber] = (filledCounts[selectedNumber] || 0) + 1;
    if (filledCounts[selectedNumber] === totalCounts[selectedNumber]) {
      buttons.forEach(btn => {
        if (btn.dataset.number === selectedNumber) {
          btn.classList.add('finished');
          btn.classList.remove('selected');
        }
      });
      selectedNumber = null;
      document.querySelectorAll('.cell.highlight').forEach(c => c.classList.remove('highlight'));
    }
  }
}

document.querySelectorAll('.cell').forEach(cell => {
  cell.addEventListener('click', () => {
    fillCell(cell);
  });

  cell.addEventListener('mousedown', () => {
    isDragging = true;
    fillCell(cell);
  });

  cell.addEventListener('mouseover', () => {
    if (isDragging) {
      fillCell(cell);
    }
  });

  cell.addEventListener('mouseup', () => {
    isDragging = false;
  });

  cell.addEventListener('touchstart', (e) => {
    e.preventDefault();
    fillCell(cell);
  }, { passive: false });

  cell.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    if (el && el.classList.contains('cell')) {
      fillCell(el);
    }
  }, { passive: false });
});

document.body.addEventListener('mouseup', () => {
  isDragging = false;
});