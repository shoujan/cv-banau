/* CV Banau AI — real animated loader plus application enhancements */
(function () {
  const quotes = [
    'Your future is created by what you do today.',
    'Great resumes open doors. Great skills keep them open.',
    'Believe in your potential, then build it.',
    'Every expert was once a beginner.',
    'Small progress every day creates big results.',
    'Your next opportunity may start with one great CV.',
    'Keep learning. Keep growing. Keep going.',
    'A strong career begins with a strong first step.'
  ];

  const statuses = [
    'Preparing your professional journey...',
    'Polishing your career profile...',
    'Optimizing your resume...',
    'Checking ATS readiness...',
    'Adding a touch of AI...',
    'Almost ready...'
  ];

  function runRealLoader() {
    const loader = document.getElementById('appBootLoader');
    const quote = document.getElementById('loaderQuote');
    const status = document.getElementById('loaderStatus');
    const progress = document.getElementById('loaderProgress');
    const percent = document.getElementById('loaderPercent');
    const startButton = document.getElementById('loaderStartButton');
    if (!loader || !quote || !status || !progress || !percent || !startButton) return;

    quote.textContent = `“ ${quotes[Math.floor(Math.random() * quotes.length)]} ”`;

    const enterBuilder = () => {
      startButton.disabled = true;
      startButton.classList.add('is-launching');
      loader.classList.add('is-complete');
      window.setTimeout(() => {
        loader.remove();
        if (typeof window.switchMainTab === 'function') window.switchMainTab('builder');
        document.querySelector('.app-main')?.scrollTo(0, 0);
      }, 680);
    };
    startButton.addEventListener('click', enterBuilder);

    // Animate the opening sequence once, then keep the landing screen visible until Start is clicked.
    const progressDuration = 1450;
    const startedAt = performance.now();
    let statusIndex = 0;
    let lastPercent = -1;
    let rafId = 0;
    const animateLoader = (now) => {
      const elapsed = now - startedAt;
      const progressTime = Math.min(elapsed / progressDuration, 1);
      const eased = 1 - Math.pow(1 - progressTime, 0.86);
      const value = Math.min(100, Math.round(eased * 100));
      progress.style.transform = `scaleX(${progressTime})`;

      if (value !== lastPercent) {
        lastPercent = value;
        percent.textContent = `${value}%`;
        if (value > 18 && statusIndex < 1) { statusIndex = 1; status.textContent = statuses[1]; }
        if (value > 38 && statusIndex < 2) { statusIndex = 2; status.textContent = statuses[2]; }
        if (value > 57 && statusIndex < 3) { statusIndex = 3; status.textContent = statuses[3]; }
        if (value > 76 && statusIndex < 4) { statusIndex = 4; status.textContent = statuses[4]; }
        if (value > 93 && statusIndex < 5) { statusIndex = 5; status.textContent = 'Your workspace is ready.'; }
      }

      if (elapsed >= progressDuration) {
        progress.style.transform = 'scaleX(1)';
        percent.textContent = '100%';
        status.textContent = 'Your workspace is ready.';
        startButton.classList.add('is-ready');
        return;
      }
      rafId = window.requestAnimationFrame(animateLoader);
    };
    rafId = window.requestAnimationFrame(animateLoader);

    window.addEventListener('beforeunload', () => {
      window.cancelAnimationFrame(rafId);
    }, { once: true });
  }

  function initAppEnhancements() {
    runRealLoader();

    const form = document.getElementById('aiInput');
    const purpose = document.getElementById('cvPurpose');
    if (form) form.setAttribute('maxlength', '3000');
    if (purpose) purpose.addEventListener('change', () => {
      if (typeof showToast === 'function') showToast('CV focus updated for your goal.', 'info', 1800);
    });

    const buttons = Array.from(document.querySelectorAll('.gen-btn, .generate-all-btn'));
    const originalGenerate = window.generateWithAI;
    if (typeof originalGenerate === 'function' && !originalGenerate.__wrapped) {
      const wrapped = async function (type) {
        buttons.forEach(button => { button.disabled = true; button.classList.add('is-loading'); });
        try { return await originalGenerate(type); }
        finally { buttons.forEach(button => { button.disabled = false; button.classList.remove('is-loading'); }); }
      };
      wrapped.__wrapped = true;
      window.generateWithAI = wrapped;
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAppEnhancements);
  else initAppEnhancements();
})();
