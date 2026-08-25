document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
    });
  });

  /* ---------- Scroll-reveal ---------- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('.section').forEach(section => {
    section.classList.add('reveal');
  });

  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  /* ---------- Hero code typewriter ---------- */
  const codeLines = [
    [{ t: 'kw', v: 'public class ' }, { t: 'type', v: 'Developer' }, { t: '', v: ' {' }],
    [{ t: '', v: '    ' }, { t: 'kw', v: 'private ' }, { t: 'type', v: 'String ' }, { t: '', v: 'name = ' }, { t: 'str', v: '"Mohd Anas"' }, { t: '', v: ';' }],
    [{ t: '', v: '    ' }, { t: 'kw', v: 'private ' }, { t: 'type', v: 'String ' }, { t: '', v: 'role = ' }, { t: 'str', v: '"Software Engineer"' }, { t: '', v: ';' }],
    [{ t: '', v: '    ' }, { t: 'kw', v: 'private ' }, { t: 'type', v: 'String ' }, { t: '', v: 'status = ' }, { t: 'str', v: '"Open to opportunities"' }, { t: '', v: ';' }],
    [{ t: '', v: '' }],
    [{ t: '', v: '    ' }, { t: 'kw', v: 'public static void ' }, { t: '', v: 'main(' }, { t: 'type', v: 'String' }, { t: '', v: '[] args) {' }],
    [{ t: '', v: '        System.out.println(' }, { t: 'kw', v: 'new ' }, { t: 'type', v: 'Developer' }, { t: '', v: '());' }],
    [{ t: '', v: '    }' }],
    [{ t: '', v: '}' }],
  ];

  const codeEl = document.querySelector('#typedCode code');
  const gutterEl = document.getElementById('gutter');

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function renderGutter(lineCount) {
    gutterEl.innerHTML = Array.from({ length: lineCount }, (_, i) => i + 1).join('<br>');
  }

  function wrapSeg(seg) {
    return seg.t ? `<span class="${seg.t}">${escapeHtml(seg.v)}</span>` : escapeHtml(seg.v);
  }

  function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }

  async function typeCode() {
    renderGutter(codeLines.length);

    if (prefersReducedMotion) {
      codeEl.innerHTML = codeLines.map(line => line.map(wrapSeg).join('')).join('\n');
      return;
    }

    let output = '';
    for (const line of codeLines) {
      for (let segIndex = 0; segIndex < line.length; segIndex++) {
        const seg = line[segIndex];
        const completed = line.slice(0, segIndex).map(wrapSeg).join('');
        let partial = '';
        for (const char of seg.v) {
          partial += char;
          const inProgress = seg.t ? `<span class="${seg.t}">${escapeHtml(partial)}</span>` : escapeHtml(partial);
          codeEl.innerHTML = output + completed + inProgress + '<span class="cursor"></span>';
          await sleep(6);
        }
      }
      output += line.map(wrapSeg).join('') + '\n';
    }
    codeEl.innerHTML = output + '<span class="cursor"></span>';
  }

  typeCode();

  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (form.action.includes('YOUR_FORM_ID')) {
      status.textContent = 'Form not connected yet — add your Formspree form ID in index.html (see script.js comments).';
      status.classList.add('error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    status.textContent = '';
    status.classList.remove('error');

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        status.textContent = '200 OK — message sent. I\'ll get back to you soon.';
        form.reset();
      } else {
        status.textContent = 'Something went wrong — please try again or email me directly.';
        status.classList.add('error');
      }
    } catch (err) {
      status.textContent = 'Network error — please try again or email me directly.';
      status.classList.add('error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send →';
    }
  });

});