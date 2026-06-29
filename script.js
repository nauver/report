const revealEls = document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
const counters = document.querySelectorAll('.counter');
const progressBar = document.getElementById('progressBar');
const seen = new WeakSet();

function formatNumber(value){
  if(value >= 1000000){
    const m = value / 1000000;
    return Number.isInteger(m) ? `${m}m` : `${m.toFixed(1)}m`;
  }
  return new Intl.NumberFormat('en-GB').format(value);
}

function animateCounter(el){
  const target = Number(el.dataset.target || 0);
  const duration = 1350;
  const start = performance.now();
  function tick(now){
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = formatNumber(Math.round(target * eased));
    if(progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('is-visible');
      if(entry.target.classList.contains('counter') && !seen.has(entry.target)){
        seen.add(entry.target);
        animateCounter(entry.target);
      }
      entry.target.querySelectorAll?.('.counter').forEach(counter=>{
        if(!seen.has(counter)){
          seen.add(counter);
          animateCounter(counter);
        }
      });
    }
  });
},{threshold:.22});

revealEls.forEach(el=>observer.observe(el));
counters.forEach(el=>observer.observe(el));

function updateProgress(){
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;
}
window.addEventListener('scroll', updateProgress, {passive:true});
updateProgress();
