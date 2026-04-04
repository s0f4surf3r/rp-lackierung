// stylyCMS — Image Editor
// Klick auf Bilder mit data-cms-image → Fokuspunkt setzen + Bild ersetzen
// Aktiviert sich nur wenn cms_token im localStorage existiert (eingeloggt)

(function() {
  var token = localStorage.getItem('cms_token');
  if (!token) return;

  var images = document.querySelectorAll('[data-cms-image]');
  if (!images.length) return;

  var API = localStorage.getItem('cms_api_url') || 'https://perfectcmstm6mdmqs-rp-cms-api.functions.fnc.fr-par.scw.cloud';
  var PAGE_PATH = document.body.getAttribute('data-cms-path');
  var STORAGE_KEY = 'cms-image-crops';
  var REPLACE_KEY = 'cms-image-replacements';

  // Gespeicherte Daten laden
  var crops = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  var replacements = JSON.parse(localStorage.getItem(REPLACE_KEY) || '{}');

  // Anwenden
  applyAllCrops();
  applyAllReplacements();

  // Hover-Indikator auf alle CMS-Bilder
  images.forEach(function(img) {
    img.style.cursor = 'crosshair';
    img.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      openEditor(img);
    });
  });

  // ============ EDITOR OVERLAY ============

  function openEditor(img) {
    var imageId = img.getAttribute('data-cms-image');
    var originalSrc = img.getAttribute('data-original-src') || img.src;
    var currentCrops = crops[imageId] || {};
    var device = 'desktop';
    var activeTab = 'focus'; // 'focus' oder 'replace'

    // Overlay
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,0.92);display:flex;flex-direction:column;align-items:center;font-family:-apple-system,sans-serif;overflow-y:auto;';

    // Header
    var header = document.createElement('div');
    header.style.cssText = 'width:100%;max-width:900px;padding:1.5rem 2rem 0;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;';

    var title = document.createElement('div');
    title.style.cssText = 'color:#fff;font-size:0.95rem;font-weight:600;';
    title.textContent = imageId;

    var closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = 'background:none;border:none;color:#999;font-size:1.5rem;cursor:pointer;padding:0.5rem;min-height:44px;min-width:44px;';
    closeBtn.addEventListener('click', function() { overlay.remove(); });

    header.appendChild(title);
    header.appendChild(closeBtn);
    overlay.appendChild(header);

    // ===== TAB BAR =====
    var tabBar = document.createElement('div');
    tabBar.style.cssText = 'display:flex;gap:0;margin:1rem 0;border-radius:8px;overflow:hidden;border:1px solid rgba(255,255,255,0.15);flex-shrink:0;';

    var tabFocus = createTabBtn('Fokuspunkt', true);
    var tabReplace = createTabBtn('Bild ersetzen', false);

    tabBar.appendChild(tabFocus);
    tabBar.appendChild(tabReplace);
    overlay.appendChild(tabBar);

    // ===== CONTENT AREA =====
    var contentArea = document.createElement('div');
    contentArea.style.cssText = 'width:100%;max-width:900px;padding:0 2rem 2rem;display:flex;flex-direction:column;align-items:center;';
    overlay.appendChild(contentArea);

    // Tab switching
    tabFocus.addEventListener('click', function() {
      activeTab = 'focus';
      tabFocus.style.background = '#0a84ff'; tabFocus.style.color = '#fff';
      tabReplace.style.background = 'rgba(255,255,255,0.05)'; tabReplace.style.color = '#999';
      renderContent();
    });
    tabReplace.addEventListener('click', function() {
      activeTab = 'replace';
      tabReplace.style.background = '#0a84ff'; tabReplace.style.color = '#fff';
      tabFocus.style.background = 'rgba(255,255,255,0.05)'; tabFocus.style.color = '#999';
      renderContent();
    });

    function renderContent() {
      contentArea.innerHTML = '';
      if (activeTab === 'focus') {
        renderFocusTab();
      } else {
        renderReplaceTab();
      }
    }

    // ===== FOKUSPUNKT TAB =====
    function renderFocusTab() {
      // Device Toggle
      var toggleBar = document.createElement('div');
      toggleBar.style.cssText = 'display:flex;gap:0.5rem;margin-bottom:1rem;';

      var btnDesktop = createToggleBtn('Desktop', device === 'desktop');
      var btnMobile = createToggleBtn('Mobile', device === 'mobile');

      btnDesktop.addEventListener('click', function() {
        device = 'desktop';
        btnDesktop.style.background = '#0a84ff'; btnDesktop.style.color = '#fff';
        btnMobile.style.background = 'rgba(255,255,255,0.1)'; btnMobile.style.color = '#999';
        updateMarker();
      });
      btnMobile.addEventListener('click', function() {
        device = 'mobile';
        btnMobile.style.background = '#0a84ff'; btnMobile.style.color = '#fff';
        btnDesktop.style.background = 'rgba(255,255,255,0.1)'; btnDesktop.style.color = '#999';
        updateMarker();
      });

      toggleBar.appendChild(btnDesktop);
      toggleBar.appendChild(btnMobile);
      contentArea.appendChild(toggleBar);

      // Bild-Container
      var container = document.createElement('div');
      container.style.cssText = 'position:relative;max-width:100%;cursor:crosshair;';

      var preview = document.createElement('img');
      preview.src = img.src;
      preview.style.cssText = 'max-width:100%;max-height:55vh;display:block;border-radius:8px;';

      // Fokuspunkt-Marker
      var marker = document.createElement('div');
      marker.style.cssText = 'position:absolute;width:24px;height:24px;border:2px solid #0a84ff;border-radius:50%;transform:translate(-50%,-50%);pointer-events:none;box-shadow:0 0 0 2px rgba(0,0,0,0.5),0 0 20px rgba(10,132,255,0.4);';

      var crossH = document.createElement('div');
      crossH.style.cssText = 'position:absolute;top:50%;left:0;right:0;height:1px;background:rgba(10,132,255,0.3);pointer-events:none;transform:translateY(-50%);';
      var crossV = document.createElement('div');
      crossV.style.cssText = 'position:absolute;left:50%;top:0;bottom:0;width:1px;background:rgba(10,132,255,0.3);pointer-events:none;transform:translateX(-50%);';
      marker.appendChild(crossH);
      marker.appendChild(crossV);

      container.appendChild(preview);
      container.appendChild(marker);
      contentArea.appendChild(container);

      // Position-Anzeige
      var posLabel = document.createElement('div');
      posLabel.style.cssText = 'color:#999;font-size:0.8rem;margin-top:0.8rem;font-family:monospace;';
      contentArea.appendChild(posLabel);

      // Action-Buttons
      var actions = document.createElement('div');
      actions.style.cssText = 'display:flex;gap:1rem;margin-top:1.5rem;flex-wrap:wrap;justify-content:center;';

      var saveBtn = createActionBtn('Speichern', true);
      saveBtn.addEventListener('click', function() {
        saveCrops(imageId);
        overlay.remove();
      });

      var resetBtn = createActionBtn('Reset', false);
      resetBtn.addEventListener('click', function() {
        delete currentCrops[device];
        if (crops[imageId]) delete crops[imageId][device];
        updateMarker();
      });

      var cssBtn = createActionBtn('CSS kopieren', false);
      cssBtn.addEventListener('click', function() {
        var css = generateCSS(imageId);
        navigator.clipboard.writeText(css).then(function() {
          cssBtn.textContent = '✓ Kopiert';
          setTimeout(function() { cssBtn.textContent = 'CSS kopieren'; }, 2000);
        });
      });

      actions.appendChild(saveBtn);
      actions.appendChild(resetBtn);
      actions.appendChild(cssBtn);
      contentArea.appendChild(actions);

      // Klick auf Bild → Fokuspunkt setzen
      container.addEventListener('click', function(e) {
        var rect = preview.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
        var y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
        currentCrops[device] = x + '% ' + y + '%';
        if (!crops[imageId]) crops[imageId] = {};
        crops[imageId][device] = currentCrops[device];
        updateMarker();
      });

      function updateMarker() {
        var pos = currentCrops[device] || '50% 50%';
        var parts = pos.split(' ');
        marker.style.left = parseFloat(parts[0]) + '%';
        marker.style.top = parseFloat(parts[1]) + '%';
        posLabel.textContent = device + ': object-position: ' + pos + ';';
        preview.style.objectFit = 'cover';
        preview.style.objectPosition = pos;
      }

      updateMarker();
    }

    // ===== BILD ERSETZEN TAB =====
    function renderReplaceTab() {
      // Info
      var info = document.createElement('div');
      info.style.cssText = 'color:#999;font-size:0.85rem;margin-bottom:1.5rem;text-align:center;';
      info.textContent = 'Aktuell: ' + img.src.split('/').pop();
      contentArea.appendChild(info);

      // Upload-Button
      var uploadArea = document.createElement('div');
      uploadArea.style.cssText = 'width:100%;margin-bottom:2rem;';

      var fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.style.cssText = 'position:absolute;width:1px;height:1px;opacity:0;overflow:hidden;';

      var uploadBtn = document.createElement('button');
      uploadBtn.style.cssText = 'display:flex;align-items:center;justify-content:center;gap:0.8rem;width:100%;padding:2rem;border:2px dashed rgba(255,255,255,0.2);border-radius:12px;cursor:pointer;color:#999;font-size:0.95rem;transition:all 0.2s;background:none;font-family:inherit;';
      uploadBtn.textContent = 'Foto hochladen (vom Computer)';
      uploadBtn.addEventListener('mouseenter', function() { uploadBtn.style.borderColor = '#0a84ff'; uploadBtn.style.color = '#fff'; });
      uploadBtn.addEventListener('mouseleave', function() { uploadBtn.style.borderColor = 'rgba(255,255,255,0.2)'; uploadBtn.style.color = '#999'; });
      uploadBtn.addEventListener('click', function(e) {
        e.preventDefault();
        fileInput.click();
      });

      fileInput.addEventListener('change', function() {
        if (!fileInput.files.length) return;
        handleUpload(fileInput.files[0]);
      });

      uploadArea.appendChild(fileInput);
      uploadArea.appendChild(uploadBtn);
      contentArea.appendChild(uploadArea);

      // Galerie-Header
      var galHeader = document.createElement('div');
      galHeader.style.cssText = 'color:#fff;font-size:0.85rem;font-weight:600;margin-bottom:1rem;letter-spacing:0.05em;';
      galHeader.textContent = 'Oder aus vorhandenen Bildern wählen:';
      contentArea.appendChild(galHeader);

      // Galerie laden
      var gallery = document.createElement('div');
      gallery.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:0.8rem;width:100%;';
      contentArea.appendChild(gallery);

      var loadingMsg = document.createElement('div');
      loadingMsg.style.cssText = 'color:#666;font-size:0.85rem;grid-column:1/-1;text-align:center;padding:2rem;';
      loadingMsg.textContent = 'Lade Bilder...';
      gallery.appendChild(loadingMsg);

      // Bilder aus dem images-Ordner laden (über API oder DOM)
      loadGalleryImages(gallery, loadingMsg);

      function handleUpload(file) {
        // Datei als Data-URL lesen und sofort anzeigen
        var reader = new FileReader();
        reader.onload = function(e) {
          var dataUrl = e.target.result;

          // Vorschau ersetzen
          img.src = dataUrl;

          // In localStorage speichern (temporär, bis zum Server-Upload)
          if (!replacements[imageId]) replacements[imageId] = {};
          replacements[imageId].src = dataUrl;
          replacements[imageId].filename = file.name;
          localStorage.setItem(REPLACE_KEY, JSON.stringify(replacements));

          // Upload an Server versuchen
          uploadToServer(file, imageId);

          overlay.remove();
          showToast('✓ Bild ersetzt — ' + file.name);
        };
        reader.readAsDataURL(file);
      }

      function loadGalleryImages(container, loading) {
        // Alle <img> auf der Seite sammeln als Galerie-Quelle
        var allImages = [];
        var seen = {};
        document.querySelectorAll('img[src]').forEach(function(i) {
          var src = i.src;
          if (seen[src]) return;
          if (src.startsWith('data:')) return;
          seen[src] = true;
          allImages.push(src);
        });

        // Auch bekannte Ordner durchsuchen (Story-Bilder)
        var knownPaths = [
          '/images/story/', '/images/gear/', '/images/'
        ];

        loading.remove();

        if (allImages.length === 0) {
          var empty = document.createElement('div');
          empty.style.cssText = 'color:#666;font-size:0.85rem;grid-column:1/-1;text-align:center;padding:2rem;';
          empty.textContent = 'Keine Bilder gefunden';
          container.appendChild(empty);
          return;
        }

        allImages.forEach(function(src) {
          var thumb = document.createElement('div');
          thumb.style.cssText = 'aspect-ratio:1;border-radius:8px;overflow:hidden;cursor:pointer;border:2px solid transparent;transition:border-color 0.2s;position:relative;';

          var thumbImg = document.createElement('img');
          thumbImg.src = src;
          thumbImg.style.cssText = 'width:100%;height:100%;object-fit:cover;';

          var thumbLabel = document.createElement('div');
          thumbLabel.style.cssText = 'position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,0.7);color:#ccc;font-size:0.65rem;padding:0.3rem 0.5rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
          thumbLabel.textContent = src.split('/').pop();

          // Aktuelles Bild markieren
          if (src === img.src) {
            thumb.style.borderColor = '#0a84ff';
          }

          thumb.addEventListener('mouseenter', function() { thumb.style.borderColor = '#0a84ff'; });
          thumb.addEventListener('mouseleave', function() {
            thumb.style.borderColor = src === img.src ? '#0a84ff' : 'transparent';
          });

          thumb.addEventListener('click', function() {
            img.src = src;
            if (!replacements[imageId]) replacements[imageId] = {};
            replacements[imageId].src = src;
            replacements[imageId].filename = src.split('/').pop();
            localStorage.setItem(REPLACE_KEY, JSON.stringify(replacements));

            overlay.remove();
            showToast('✓ Bild gewechselt — ' + src.split('/').pop());

            // In Console loggen
            console.log('[Image Editor] Bild ' + imageId + ' → ' + src);
          });

          thumb.appendChild(thumbImg);
          thumb.appendChild(thumbLabel);
          container.appendChild(thumb);
        });
      }
    }

    // Initial rendern
    renderContent();

    // Escape schließt
    function onKey(e) {
      if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', onKey); }
    }
    document.addEventListener('keydown', onKey);

    document.body.appendChild(overlay);
  }

  // ============ UPLOAD ============

  function uploadToServer(file, imageId) {
    // Versuche Upload über perfectCMS API
    var formData = new FormData();
    formData.append('file', file);
    formData.append('path', 'src/images/story/' + file.name);

    fetch(API + '/api/upload', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token },
      body: formData
    })
    .then(function(r) { return r.json(); })
    .then(function(d) {
      if (d.error) {
        console.warn('[Image Editor] Upload fehlgeschlagen:', d.error);
        console.log('[Image Editor] Bild liegt lokal als Data-URL — manuell in src/images/ legen');
      } else {
        console.log('[Image Editor] Upload erfolgreich:', d);
      }
    })
    .catch(function(err) {
      console.warn('[Image Editor] Upload nicht möglich (lokal?):', err.message);
      console.log('[Image Editor] Bild manuell in src/images/story/ legen: ' + file.name);
    });
  }

  // ============ HELFER ============

  function createTabBtn(label, active) {
    var btn = document.createElement('button');
    btn.textContent = label;
    btn.style.cssText = 'padding:0.6rem 1.5rem;border:none;font-size:0.85rem;cursor:pointer;min-height:44px;font-weight:500;' +
      (active ? 'background:#0a84ff;color:#fff;' : 'background:rgba(255,255,255,0.05);color:#999;');
    return btn;
  }

  function createToggleBtn(label, active) {
    var btn = document.createElement('button');
    btn.textContent = label;
    btn.style.cssText = 'padding:0.5rem 1.2rem;border-radius:6px;border:none;font-size:0.85rem;cursor:pointer;min-height:44px;font-weight:500;' +
      (active ? 'background:#0a84ff;color:#fff;' : 'background:rgba(255,255,255,0.1);color:#999;');
    return btn;
  }

  function createActionBtn(label, primary) {
    var btn = document.createElement('button');
    btn.textContent = label;
    btn.style.cssText = 'padding:0.7rem 1.5rem;border-radius:8px;font-size:0.95rem;cursor:pointer;min-height:44px;font-weight:' + (primary ? '600' : '400') + ';' +
      (primary ? 'background:#0a84ff;color:#fff;border:none;' : 'background:rgba(255,255,255,0.1);color:#999;border:1px solid rgba(255,255,255,0.15);');
    return btn;
  }

  function generateCSS(imageId) {
    var c = crops[imageId] || {};
    var lines = [];
    if (c.desktop) {
      lines.push('.story-image [data-cms-image="' + imageId + '"] { object-position: ' + c.desktop + '; }');
    }
    if (c.mobile) {
      lines.push('@media (max-width: 768px) { .story-image [data-cms-image="' + imageId + '"] { object-position: ' + c.mobile + '; } }');
    }
    return lines.join('\n');
  }

  function showToast(text) {
    var toast = document.createElement('div');
    toast.textContent = text;
    toast.style.cssText = 'position:fixed;bottom:1.5rem;left:50%;transform:translateX(-50%);background:#4caf50;color:#fff;padding:0.6rem 1.5rem;border-radius:8px;z-index:99999;font-family:sans-serif;font-size:0.9rem;box-shadow:0 4px 20px rgba(0,0,0,0.3);';
    document.body.appendChild(toast);
    setTimeout(function() { toast.remove(); }, 2500);
  }

  function saveCrops(imageId) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(crops));
    applyAllCrops();
    showToast('✓ Fokuspunkt gespeichert');
    var css = generateCSS(imageId);
    if (css) console.log('[Image Editor] CSS für ' + imageId + ':\n' + css);
  }

  function applyAllCrops() {
    var styleId = 'cms-image-crops-style';
    var style = document.getElementById(styleId);
    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      document.head.appendChild(style);
    }

    var css = '';
    Object.keys(crops).forEach(function(imageId) {
      var c = crops[imageId];
      if (c.desktop) {
        css += '[data-cms-image="' + imageId + '"] { object-fit: cover !important; object-position: ' + c.desktop + ' !important; }\n';
      }
      if (c.mobile) {
        css += '@media (max-width: 768px) { [data-cms-image="' + imageId + '"] { object-position: ' + c.mobile + ' !important; } }\n';
      }
    });

    style.textContent = css;
  }

  function applyAllReplacements() {
    Object.keys(replacements).forEach(function(imageId) {
      var r = replacements[imageId];
      if (r && r.src) {
        var el = document.querySelector('[data-cms-image="' + imageId + '"]');
        if (el) {
          if (!el.getAttribute('data-original-src')) {
            el.setAttribute('data-original-src', el.src);
          }
          el.src = r.src;
        }
      }
    });
  }

})();
