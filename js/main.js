/**
 * Bella Casa — landing de conversão para o grupo de ofertas no WhatsApp.
 *
 * CONFIGURAÇÃO:
 * - WHATSAPP_GROUP_URL: link do grupo
 * - Pixel do Meta: inicialização oficial em index.html (fbq init + PageView)
 *   ID: 27974338368882893
 */

const WHATSAPP_GROUP_URL = 'https://chat.whatsapp.com/KGD9ZYXC1YPI0k7iVTFcGa?mode=gi_t';

function trackEvent(name, params, custom) {
  try {
    if (typeof window.fbq !== 'function') return;
    if (custom) {
      window.fbq('trackCustom', name, params || {});
    } else {
      window.fbq('track', name, params || {});
    }
  } catch (err) {
    /* Pixel indisponível: o clique no WhatsApp segue normalmente */
  }
}

function trackWhatsAppClick(position) {
  trackEvent('Lead', {
    content_name: 'whatsapp_group',
    cta: position
  });
  trackEvent(
    'WhatsAppGroupClick',
    { cta: position },
    true
  );
}

/* -------------------------------------------------------------------------- */
/* Interface                                                                  */
/* -------------------------------------------------------------------------- */

function bindWhatsAppCtas() {
  var links = document.querySelectorAll('[data-analytics="whatsapp-group"]');
  var i;
  var link;

  for (i = 0; i < links.length; i += 1) {
    link = links[i];
    link.setAttribute('href', WHATSAPP_GROUP_URL);
    link.addEventListener('click', onCtaClick);
  }
}

function onCtaClick(event) {
  var position = event.currentTarget.getAttribute('data-position') || 'unknown';
  trackWhatsAppClick(position);
}

function initCarousel() {
  var viewport = document.getElementById('carousel-viewport');
  var prevBtn = document.querySelector('[data-carousel-dir="-1"]');
  var nextBtn = document.querySelector('[data-carousel-dir="1"]');

  if (!viewport || typeof EmblaCarousel !== 'function') return;

  var embla = EmblaCarousel(viewport, {
    loop: true,
    align: 'start',
    dragFree: true,
    skipSnaps: true,
    containScroll: 'trimSnaps'
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      embla.scrollPrev();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      embla.scrollNext();
    });
  }
}

bindWhatsAppCtas();
initCarousel();
