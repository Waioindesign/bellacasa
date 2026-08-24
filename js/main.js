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

function initStickyCta() {
  var mainCta = document.getElementById('main-cta');
  var sticky = document.getElementById('sticky-cta');

  if (!mainCta || !sticky || !('IntersectionObserver' in window)) return;

  var desktopQuery = window.matchMedia('(min-width: 768px)');
  var hasScrolled = false;
  var mainVisible = true;

  function setStickyVisible(visible) {
    if (desktopQuery.matches) {
      sticky.classList.remove('is-visible');
      sticky.setAttribute('aria-hidden', 'true');
      sticky.setAttribute('inert', '');
      return;
    }

    sticky.classList.toggle('is-visible', visible);
    sticky.setAttribute('aria-hidden', visible ? 'false' : 'true');
    if (visible) {
      sticky.removeAttribute('inert');
    } else {
      sticky.setAttribute('inert', '');
    }
  }

  function updateSticky() {
    setStickyVisible(hasScrolled && !mainVisible);
  }

  var observer = new IntersectionObserver(
    function (entries) {
      mainVisible = entries[0].isIntersecting;
      updateSticky();
    },
    { threshold: 0, rootMargin: '0px' }
  );

  observer.observe(mainCta);

  window.addEventListener(
    'scroll',
    function () {
      hasScrolled = true;
      updateSticky();
    },
    { passive: true, once: true }
  );

  if (typeof desktopQuery.addEventListener === 'function') {
    desktopQuery.addEventListener('change', function () {
      if (desktopQuery.matches) setStickyVisible(false);
    });
  }
}

bindWhatsAppCtas();
initStickyCta();
