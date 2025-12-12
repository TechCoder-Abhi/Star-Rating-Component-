// load saved rating from localStorage if present
// const SAVED_KEY = 'rating-component-value';
// let rating = Number(localStorage.getItem(SAVED_KEY)) || 0;

// // when updating rating, persist it
// function updateRating() {
//   ratingValue.textContent = rating;
//   highlightStar(rating);
//   liveRegion.textContent = rating === 0 ? 'No rating' : `${rating} star${rating > 1 ? 's' : ''} selected`;
//   localStorage.setItem(SAVED_KEY, String(rating));
// }


document.addEventListener('DOMContentLoaded', () => {
  const TOTAL_STARS = 5;
  const starContainer = document.getElementById('star-container');
  const ratingValue = document.getElementById('rating-value');
  const resetBtn = document.getElementById('reset-btn');
  const liveRegion = document.getElementById('rating-live');

  let rating = 0;

  // render star buttons with ARIA roles and keyboard handlers
  function renderStars(total) {
    starContainer.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const btn = document.createElement('button');
      btn.className = 'star';
      btn.type = 'button';
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-label', `${i + 1} star${i + 1 > 1 ? 's' : ''}`);
      btn.setAttribute('aria-checked', 'false');
      btn.dataset.value = i + 1;
      btn.textContent = '★';

      // hover preview
      btn.addEventListener('mouseover', () => highlightStar(i + 1));
      btn.addEventListener('mouseout', () => highlightStar(rating));

      // click: toggle when clicking currently selected star
      btn.addEventListener('click', () => {
        const selected = i + 1;
        rating = rating === selected ? 0 : selected;
        updateRating();
      });

      // keyboard: Enter/Space to toggle, arrows to move focus
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
          return;
        }
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          e.preventDefault();
          focusStar(i + 2); // 1-based
          return;
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          e.preventDefault();
          focusStar(i); // move to previous
          return;
        }
      });

      starContainer.appendChild(btn);
    }

    // make sure first star is focusable by keyboard
    const stars = starContainer.querySelectorAll('.star');
    stars.forEach((s) => (s.tabIndex = 0));
  }

  // clamp and focus by 1-based index
  function focusStar(oneBasedIndex) {
    const stars = starContainer.querySelectorAll('.star');
    if (stars.length === 0) return;
    let idx = oneBasedIndex;
    if (idx < 1) idx = 1;
    if (idx > stars.length) idx = stars.length;
    stars[idx - 1].focus();
  }

  // visual highlight + ARIA checked update
  function highlightStar(r) {
    const stars = starContainer.querySelectorAll('.star');
    stars.forEach((s, idx) => {
      const val = idx + 1;
      const checked = val <= r;
      s.classList.toggle('filled', checked);
      s.setAttribute('aria-checked', checked ? 'true' : 'false');
    });
  }

  function updateRating() {
    ratingValue.textContent = rating;
    highlightStar(rating);
    liveRegion.textContent = rating === 0 ? 'No rating' : `${rating} star${rating > 1 ? 's' : ''} selected`;
  }

  // For reset button
  resetBtn.addEventListener('click', () => {
    rating = 0;
    updateRating();
    focusStar(1);
  });

  // initial render
  renderStars(TOTAL_STARS);
  updateRating();
});