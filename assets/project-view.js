const cards = document.getElementById('project-cards');
const timeline = document.getElementById('project-timeline');
const buttons = document.querySelectorAll('[data-project-view]');

if (cards && timeline && buttons.length === 2) {
  for (const button of buttons) {
    button.addEventListener('click', () => {
      const showCards = button.dataset.projectView === 'cards';
      cards.hidden = !showCards;
      timeline.hidden = showCards;
      for (const choice of buttons) {
        choice.setAttribute('aria-pressed', String(choice === button));
      }
    });
  }
}

const movingMedia = document.querySelectorAll('[data-card-video]');
if (movingMedia.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.play().catch(() => {});
      } else {
        entry.target.pause();
      }
    }
  }, { threshold: 0.1 });
  for (const video of movingMedia) observer.observe(video);
}
