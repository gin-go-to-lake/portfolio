/* ============================================================
   ELENCO PROGETTI CON PAGINA DEDICATA
   Aggiungi qui ogni nuova pagina progetto, nello stesso ordine
   della galleria. "file" deve corrispondere al nome del file
   HTML e a body[data-project] in quella pagina. Precedente/
   successivo scorrono su questo intero elenco, senza distinzione
   di categoria.
   ============================================================ */
const PROJECTS = [
  { file: 'progetto-trentasettecentigradi.html', title: 'Trentasette centigradi' },
  { file: 'progetto-dagrandesaròunafoca.html', title: 'Da grande sarò una foca' },
  { file: 'progetto-botanicadiunaresistenza.html', title: 'Botanica di una resistenza' },
  { file: 'progetto-missioneterra.html', title: 'Missione: Terra!' },
  { file: 'progetto-girini.html', title: 'Tornando a casa' },
  { file: 'progetto-madonnadellasalute.html', title: 'Madonna della salute' },
  { file: 'progetto-lenostreetà.html', title: 'Le nostre età' },
  { file: 'progetto-martissimavini.html', title: 'Martissima vini' },
  { file: 'progetto-leforze.html', title: 'Le forze' },
  { file: 'progetto-martissimasito.html', title: 'Martissima sito' },
  { file: 'progetto-giunellaforra.html', title: 'Giù nella forra' },
  { file: 'progetto-buio.html', title: 'A volte arriva il buio' },
  { file: 'progetto-tandem.html', title: 'Il mito del tandem' },
  { file: 'progetto-matoaka.html', title: 'Mataoka' },
  { file: 'progetto-botanicaimmaginaria.html', title: 'Botanica immaginaria' },
  { file: 'progetto-ritratti.html', title: 'Ritratti' },
  { file: 'progetto-odissea.html', title: 'La Odissea contada a los ninos' },
  { file: 'progetto-iliade.html', title: 'La Iliada contada a los ninos' },
  { file: 'progetto-arancioamaro.html', title: 'Arancio Amaro' },
  { file: 'progetto-zanichelli.html', title: 'Vivavoce' },
  { file: 'progetto-respiro.html', title: 'Respiro' },
  { file: 'progetto-lasirenetta.html', title: 'La Sirenetta' },
  { file: 'progetto-krivapeta.html', title: 'La krivapeta' },
  { file: 'progetto-leggeretutti.html', title: 'Leggere: tutti' },
];

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Protezione leggera immagini ----------
     Blocca il menu tasto destro e il trascinamento sulle <img> del sito.
     Non impedisce lo screenshot: è un deterrente, non una vera protezione. */
  document.addEventListener('contextmenu', (e) => {
    if(e.target.tagName === 'IMG') e.preventDefault();
  });
  document.addEventListener('dragstart', (e) => {
    if(e.target.tagName === 'IMG') e.preventDefault();
  });

  /* ---------- Scroll del menu, a velocità controllata ----------
     Lo scroll "smooth" nativo del browser non si può rallentare via CSS:
     la sua durata è decisa dal browser. Per controllarla esattamente,
     animiamo lo scroll a mano, frame per frame, con una durata fissa
     (DURATA_SCROLL, in millisecondi) e una leggera accelerazione/
     decelerazione (easing) invece di una velocità costante e brusca. */
  const DURATA_SCROLL = 1800; // millisecondi — alza per più lento, abbassa per più veloce
  const OFFSET_HEADER = 127;  // deve combaciare con "scroll-margin-top" nel CSS

  function easeInOutQuad(t){ return t < 0.5 ? 2*t*t : -1 + (4 - 2*t) * t; }

  function scrollLentoA(target, durata, alTermine){
    if(!target) return;
    const startY = window.scrollY;
    const header = document.querySelector('header');
    const offset = header ? header.offsetHeight : 0;
    const distanza = target.getBoundingClientRect().top - offset;
    const partenza = performance.now();

    function step(now){
      const trascorso = now - partenza;
      const progresso = Math.min(trascorso / durata, 1);
      window.scrollTo({ top: startY + distanza * easeInOutQuad(progresso), left:0, behavior:'instant' });
      if(progresso < 1){
        requestAnimationFrame(step);
      } else if(typeof alTermine === 'function'){
        alTermine();
      }
    }
    requestAnimationFrame(step);
  }

  /* ---------- Hero: tolta dal flusso solo a scroll concluso ----------
     Al click su una voce del menu, lo scroll (ora animato da noi, non più
     nativo) attraversa fisicamente l'Hero e le sezioni intermedie fino a
     quella scelta. Solo quando lo scroll è finito togliamo l'Hero dal
     flusso, compensando la posizione a mano per non causare salti visivi.
     Da quel momento non ricompare più (nemmeno risalendo), finché non si
     ricarica la pagina (es. cliccando il logo).
     Lo "scroll anchoring" nativo del browser (che farebbe la stessa cosa
     da solo) è disattivato globalmente in CSS (overflow-anchor:none):
     con uno scroll animato via JS a raffica di scrollTo, e sul mobile con
     il menu che si apre/chiude nello stesso istante, si è rivelato
     inaffidabile — a volte compensava due volte (la pagina scendeva alla
     sezione scelta e risaliva di scatto), a volte non compensava affatto
     (si finiva sulla sezione successiva). Meglio farlo sempre a mano, in
     modo prevedibile. */
  const heroSection = document.querySelector('.hero');
  const linkSezioni = document.querySelectorAll('#navLinks a[href^="#"]');
  const riduciMovimentoHero = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let heroGiaRimossa = false;

  function rimuoviHeroSenzaSalti(target){
    if(heroGiaRimossa || !heroSection) return;
    heroGiaRimossa = true;
    heroSection.style.display = 'none';
    // Ricalcola lo scarto DOPO aver nascosto l'Hero, invece di sottrarre
    // alla cieca la sua altezza: su "Contatti" (l'ultima sezione, con poco
    // spazio sotto verso il footer) il browser può già aver bloccato da
    // solo lo scroll al nuovo massimo possibile quando il documento si
    // accorcia; sottrarre comunque l'altezza dell'Hero sommava un'altra
    // correzione a quella già avvenuta, sballando il punto d'arrivo. Così
    // invece si corregge esattamente lo scarto residuo, qualunque esso sia.
    if(target){
      const header = document.querySelector('header');
      const offset = header ? header.offsetHeight : 0;
      const scarto = target.getBoundingClientRect().top - offset;
      if(scarto) window.scrollBy({ top: scarto, left: 0, behavior: 'instant' });
    }
  }

  linkSezioni.forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if(!target) return;
      e.preventDefault();

      if(riduciMovimentoHero){
        target.scrollIntoView({ behavior: 'auto' });
        rimuoviHeroSenzaSalti(target);
        return;
      }

      scrollLentoA(target, DURATA_SCROLL, () => rimuoviHeroSenzaSalti(target));
    });
  });

  /* ---------- Menu mobile (a schermo intero) ----------
     Blocca lo scroll della pagina sotto mentre il menu è aperto. */
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if(toggle && links){
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }));
  }

  /* ---------- Filtro galleria (animato) ----------
     Tecnica FLIP: misura le posizioni prima e dopo il cambio di filtro,
     poi anima la differenza — le tavole che restano visibili scivolano
     nella nuova posizione invece di saltarci istantaneamente. */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const riduciMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function applicaFiltro(filter){
    const tutte = Array.from(document.querySelectorAll('.plate'));

    if(riduciMovimento){
      tutte.forEach(p => {
        p.classList.toggle('hidden', filter !== 'all' && p.dataset.cat !== filter);
      });
      return;
    }

    const primaVisibili = tutte.filter(p => !p.classList.contains('hidden'));
    const usciranno = primaVisibili.filter(p => !(filter === 'all' || p.dataset.cat === filter));
    const restanoOEntrano = tutte.filter(p => filter === 'all' || p.dataset.cat === filter);

    // 1) Le tavole che devono sparire si dissolvono per prime
    usciranno.forEach(p => {
      p.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      p.style.opacity = '0';
      p.style.transform = 'scale(0.96)';
    });

    const dopoUscita = () => {
      // 2) FIRST: posizione attuale di chi resta visibile, prima del riflow
      const first = new Map();
      restanoOEntrano.forEach(p => {
        if(!p.classList.contains('hidden')) first.set(p, p.getBoundingClientRect());
      });

      // Applica lo stato finale: nasconde chi è uscito, mostra chi entra
      usciranno.forEach(p => {
        p.classList.add('hidden');
        p.style.opacity = ''; p.style.transform = ''; p.style.transition = '';
      });
      restanoOEntrano.forEach(p => p.classList.remove('hidden'));

      // 3) LAST + inversione: chi c'era già scivola dalla vecchia posizione,
      // chi è nuovo appare in dissolvenza.
      // Prima si leggono TUTTE le posizioni finali (getBoundingClientRect),
      // poi si scrivono gli stili: se lettura e scrittura si alternano tavola
      // per tavola, il browser è costretto a ricalcolare il layout ad ogni
      // singola tavola invece che una volta sola ("layout thrashing"), il che
      // può risultare in un primo scatto percepibile prima che il layout "si scaldi".
      const lastRects = restanoOEntrano.map(p => p.getBoundingClientRect());

      restanoOEntrano.forEach((p, i) => {
        const last = lastRects[i];
        const firstRect = first.get(p);
        if(firstRect){
          const dx = firstRect.left - last.left;
          const dy = firstRect.top - last.top;
          if(dx || dy){
            p.style.transition = 'none';
            p.style.transform = `translate(${dx}px, ${dy}px)`;
          }
        } else {
          p.style.transition = 'none';
          p.style.opacity = '0';
          p.style.transform = 'scale(0.95)';
        }
      });

      requestAnimationFrame(() => {
        restanoOEntrano.forEach(p => {
          const firstRect = first.get(p);
          if(firstRect){
            if(p.style.transform){
              p.style.transition = 'transform 0.6s ease';
              p.style.transform = '';
            }
          } else {
            p.style.transition = 'opacity 0.53s ease, transform 0.53s ease';
            p.style.opacity = '1';
            p.style.transform = '';
          }
        });
      });
    };

    if(usciranno.length){
      setTimeout(dopoUscita, 300);
    } else {
      dopoUscita();
    }
  }

  if(filterButtons.length){
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed','true');
        applicaFiltro(btn.dataset.filter);
      });
    });
  }

  /* ---------- Lingua IT / EN ----------
     Applica la traduzione a qualunque elemento con data-it/data-en,
     incluso <title> (textContent) e i <meta> (attributo content). */
  const langButtons = document.querySelectorAll('.lang-switch button');
  
  function setLanguage(lang){
    document.querySelectorAll('[data-it], [data-en]').forEach(el => {
      const text = el.getAttribute('data-' + lang);
      if(text === null) return;
      if(el.tagName === 'META'){ el.setAttribute('content', text); }
      else { el.textContent = text; }
    });
    /* Sezioni presenti solo in italiano (es. Laboratori): nascoste del tutto in EN */
    document.querySelectorAll('[data-it-only]').forEach(el => {
      el.style.display = (lang === 'en') ? 'none' : '';
    });
    langButtons.forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('site-lang', lang);
  }
  
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });
  
  setLanguage(localStorage.getItem('site-lang') || 'it');

    /* ---------- Pallino sulla voce di menu della sezione attiva ----------
     Osserva quale sezione è al centro dello schermo mentre si scorre e
     sposta la classe .is-active sulla voce di menu corrispondente. */
  const vociMenu = document.querySelectorAll('#navLinks a[href^="#"]');
  if(vociMenu.length){
    const sezioniOsservate = [];
    vociMenu.forEach(a => {
      const sez = document.querySelector(a.getAttribute('href'));
      if(sez) sezioniOsservate.push({ voce:a, sezione:sez });
    });

    if(sezioniOsservate.length){
      const osservatore = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if(entry.isIntersecting){
            const match = sezioniOsservate.find(s => s.sezione === entry.target);
            if(match){
              vociMenu.forEach(v => v.classList.remove('is-active'));
              match.voce.classList.add('is-active');
            }
          }
        });
      }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

      sezioniOsservate.forEach(s => osservatore.observe(s.sezione));
    }
  }

  /* ---------- Navigazione progetto (precedente/successivo) ----------
     Precedente/successivo scorrono sull'intero elenco PROJECTS, nell'ordine
     in cui è definito, senza distinzione di categoria. */
  const currentFile = document.body.dataset.project;
  if(currentFile){
    const idx = PROJECTS.findIndex(p => p.file === currentFile);
    if(idx !== -1 && PROJECTS.length > 1){
      const prev = PROJECTS[(idx - 1 + PROJECTS.length) % PROJECTS.length];
      const next = PROJECTS[(idx + 1) % PROJECTS.length];
      const prevLink = document.getElementById('prevProject');
      const nextLink = document.getElementById('nextProject');
      if(prevLink) prevLink.href = prev.file;
      if(nextLink) nextLink.href = next.file;
    }
  }

  /* ---------- Reveal on scroll ----------
     Qualunque elemento con class="reveal" compare (dissolvenza + leggero
     spostamento, definiti in style.css) quando entra nello schermo. */
  const revealItems = document.querySelectorAll('.reveal');
  if(revealItems.length){
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduceMotion){
      revealItems.forEach(el => el.classList.add('is-visible'));
    } else {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if(entry.isIntersecting){
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      revealItems.forEach(el => observer.observe(el));
    }
  }

  /* ---------- Zoom / lightbox ----------
     Si attiva sulle <img class="zoomable">. Crea l'overlay una sola volta
     e lo riusa per ogni immagine cliccata. */
  const immaginiZoomabili = document.querySelectorAll('img.zoomable');
  if(immaginiZoomabili.length){
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = '<button class="lightbox-close" aria-label="Chiudi">&times;</button><img alt="">';
    document.body.appendChild(overlay);

    const overlayImg = overlay.querySelector('img');
    const closeBtn = overlay.querySelector('.lightbox-close');

    function apriLightbox(src, alt){
      overlayImg.src = src;
      overlayImg.alt = alt || '';
      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function chiudiLightbox(){
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    immaginiZoomabili.forEach(img => {
      img.addEventListener('click', () => apriLightbox(img.src, img.alt));
    });
    overlay.addEventListener('click', chiudiLightbox);
    closeBtn.addEventListener('click', chiudiLightbox);
  }

  /* ---------- Sequenza immagini in loop (laboratori) ---------- */
  const labLoop = document.getElementById('labLoop');
  if(labLoop){
    const frame = labLoop.querySelectorAll('img');
    if(frame.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      let indice = 0;
      setInterval(() => {
        frame[indice].classList.remove('is-active');
        indice = (indice + 1) % frame.length;
        frame[indice].classList.add('is-active');
      }, 1800);
    }
  }

  /* ---------- Sequenza immagini in loop (hero-smartphome) ---------- */
  const heroLoop = document.getElementById('heroLoop');
  if(heroLoop){
    const frame = heroLoop.querySelectorAll('img');
    if(frame.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      let indice = 0;
      setInterval(() => {
        frame[indice].classList.remove('is-active');
        indice = (indice + 1) % frame.length;
        frame[indice].classList.add('is-active');
      }, 1800);
    }
  }

  /* ---------- Dissolvenza immagini al caricamento ----------
     Solo sulle immagini "statiche" (galleria, immagini progetto,
     ritratto about): i caroselli hero/laboratori gestiscono già da
     soli la propria opacità (classe is-active) e vanno lasciati stare. */
  const immaginiDaAnimare = document.querySelectorAll(
    '.plate-image img, .project-hero-image img, .process-image img, .about-portrait img'
  );
  immaginiDaAnimare.forEach(img => {
    if(img.complete){
      img.classList.add('img-loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('img-loaded'), { once: true });
    }
  });

  /* ---------- Barra di caricamento pagina ----------
     Il sito è multipagina: al click su un link interno che porta a
     un'altra pagina (non un'ancora #sezione, già gestita sopra) mostra
     subito una sottile barra in alto, per dare un riscontro immediato
     se il caricamento richiede un attimo. Non serve nasconderla: quando
     la nuova pagina arriva, il documento attuale (barra compresa) viene
     sostituito da solo. */
  const barraCaricamento = document.createElement('div');
  barraCaricamento.className = 'page-loading-bar';
  document.body.appendChild(barraCaricamento);

  document.addEventListener('click', (e) => {
    if(e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = e.target.closest('a[href]');
    if(!link || link.target === '_blank' || link.hasAttribute('download')) return;
    const href = link.getAttribute('href');
    if(!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    let url;
    try { url = new URL(href, window.location.href); } catch(err){ return; }
    if(url.origin !== window.location.origin) return;
    requestAnimationFrame(() => barraCaricamento.classList.add('is-loading'));
  });

});
