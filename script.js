// temp.js
// Makes second spans in each .column clickable and types out pressed character using font from first span

document.addEventListener('DOMContentLoaded', function() {
  const grid = document.querySelector('.alphabet-grid');
  const columnsContainer = grid.querySelector('.columns-container');
  const typedRow = grid.querySelector('.typed-row');
  const columns = columnsContainer.querySelectorAll('.column');

  columns.forEach(col => {
    const spans = col.querySelectorAll('span');
    if (spans.length < 2) return;
    const fontSpan = spans[0];
    const letterSpan = spans[1];
    letterSpan.style.cursor = 'pointer';
    letterSpan.addEventListener('click', () => {
      const letter = letterSpan.textContent;
      const letterElem = document.createElement('span');
      letterElem.textContent = letter;
      letterElem.classList.add('typed-letter-font');
      letterElem.style.marginRight = '8px';
      typedRow.appendChild(letterElem);
    });
  });

  // Backspace button logic
  const backspaceBtn = document.getElementById('backspace-btn');
  if (backspaceBtn) {
    backspaceBtn.addEventListener('click', () => {
      const letters = typedRow.querySelectorAll('.typed-letter-font');
      if (letters.length > 0) {
        typedRow.removeChild(letters[letters.length - 1]);
      }
    });
  }

  // Clear button logic
  const clearBtn = document.getElementById('clear-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      typedRow.innerHTML = '';
    });
  }
});
