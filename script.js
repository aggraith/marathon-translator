document.addEventListener('DOMContentLoaded', function () {
  const grid = document.querySelector('.alphabet-grid');
  const columnsContainer = grid.querySelector('.columns-container');
  const typedRow = grid.querySelector('.typed-row');
  const columns = columnsContainer.querySelectorAll('.column');

  columns.forEach(col => {
    const spans = col.querySelectorAll('span');
    if (spans.length < 2) return;
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

  const copyBtn = document.getElementById('copy-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const letters = Array.from(typedRow.querySelectorAll('.typed-letter-font'));
      let text = letters.map(span => span.textContent).join('');
      text = text.replace(/[\r\n]+/g, '');
      if (text.length > 0) {
        navigator.clipboard.writeText(text).then(() => {
          copyBtn.textContent = 'Copied!';
          setTimeout(() => {
            copyBtn.textContent = 'Copy';
          }, 1200);
        });
      }
    });
  }

  const backspaceBtn = document.getElementById('backspace-btn');
  if (backspaceBtn) {
    backspaceBtn.addEventListener('click', () => {
      const letters = typedRow.querySelectorAll('.typed-letter-font');
      if (letters.length > 0) {
        typedRow.removeChild(letters[letters.length - 1]);
      }
    });
  }

  const clearBtn = document.getElementById('clear-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      typedRow.innerHTML = '';
    });
  }

  const vault = document.getElementById('vlt-7');
  const vaultInput = document.getElementById('vlt-7-in');
  const vaultOutput = document.getElementById('vlt-7-out');
  const vaultNote = document.getElementById('vlt-7-note');
  const vaultCopyFont = document.getElementById('vlt-7-copy-font');
  const vaultCopyDiscord = document.getElementById('vlt-7-copy-discord');
  const vaultClear = document.getElementById('vlt-7-clear');
  const vaultClose = document.getElementById('vlt-7-close');
  const vx = document.getElementById('vx-9');
  const vxMsg = document.getElementById('vx-9-msg');
  const vxVid = document.getElementById('vx-9-vid');
  const vxHint = document.getElementById('vx-9-hint');
  const vxOpen = document.getElementById('vx-9-open');
  const vxClose = document.getElementById('vx-9-close');

  let secretHashA = ['c806cd9c716cfbfdb4763c71dd1394b3', 'e602fce81291a0338bf8e3225416ac32'].join('');
  let secretHashB = ['5e884898da28047151d0e56f8dc62927', '73603d0d6aabbdd62a11ef721d1542d8'].join('');
  let secretInput = '';
  const glyphSpacingPx = 5;
  const renderFontSizePx = 18;
  const renderLineHeightPx = 25;
  const renderPaddingPx = 8;
  const renderMaxWidthPx = 560;
  const qMsg = [65, 84, 87, 35, 84, 75, 66, 87, 80, 35, 87, 75, 70, 35, 76, 87, 75, 70, 81, 35, 80, 70, 64, 81, 70, 87]
    .map(n => String.fromCharCode(n ^ 35))
    .join('');

  if (vxMsg) {
    vxMsg.textContent = qMsg;
  }

  const getVaultText = () => {
    if (!vaultInput) return '';
    return vaultInput.value.toUpperCase();
  };

  const layoutGlyphLines = (ctx, text, maxContentWidth) => {
    const lines = [];
    const paragraphs = text.split('\n');

    for (let p = 0; p < paragraphs.length; p += 1) {
      const paragraph = paragraphs[p];
      if (paragraph.length === 0) {
        lines.push('');
        continue;
      }

      let line = '';
      let width = 0;

      for (const ch of paragraph) {
        const baseWidth = ch === ' ' ? Math.max(ctx.measureText('N').width * 0.5, 7) : ctx.measureText(ch).width;
        const charWidth = baseWidth + glyphSpacingPx;

        if (line.length > 0 && width + charWidth > maxContentWidth) {
          lines.push(line);
          line = ch;
          width = charWidth;
        } else {
          line += ch;
          width += charWidth;
        }
      }

      lines.push(line);
      if (p < paragraphs.length - 1 && paragraph.length > 0) {
        // Explicit newline between non-empty paragraphs
      }
    }

    return lines.length ? lines : [''];
  };

  const drawSpacedLine = (ctx, line, x, y) => {
    let cursorX = x;
    for (const ch of line) {
      ctx.fillText(ch, cursorX, y);
      const baseWidth = ch === ' ' ? Math.max(ctx.measureText('N').width * 0.5, 7) : ctx.measureText(ch).width;
      cursorX += baseWidth + glyphSpacingPx;
    }
  };

  const makeDiscordImageBlob = async (text) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return null;

    ctx.font = `${renderFontSizePx}px "CodeLanguage2_1_Monospace", monospace`;
    const lines = layoutGlyphLines(ctx, text, renderMaxWidthPx - (renderPaddingPx * 2));

    let widest = 0;
    for (const line of lines) {
      let width = 0;
      for (const ch of line) {
        const baseWidth = ch === ' ' ? Math.max(ctx.measureText('N').width * 0.5, 7) : ctx.measureText(ch).width;
        width += baseWidth + glyphSpacingPx;
      }
      widest = Math.max(widest, width);
    }

    const contentWidth = Math.min(Math.max(widest, 80), renderMaxWidthPx - (renderPaddingPx * 2));
    canvas.width = Math.ceil(contentWidth + (renderPaddingPx * 2));
    canvas.height = Math.ceil((lines.length * renderLineHeightPx) + (renderPaddingPx * 2));

    const paint = canvas.getContext('2d', { alpha: true });
    if (!paint) return null;
    paint.clearRect(0, 0, canvas.width, canvas.height);
    paint.font = `${renderFontSizePx}px "CodeLanguage2_1_Monospace", monospace`;
    paint.fillStyle = '#ffffff';
    paint.textBaseline = 'top';

    lines.forEach((line, index) => {
      drawSpacedLine(paint, line, renderPaddingPx, renderPaddingPx + (index * renderLineHeightPx));
    });

    const blob = await new Promise(resolve => {
      canvas.toBlob(resolve, 'image/png');
    });
    return blob;
  };

  const sha256Hex = async (value) => {
    if (!window.crypto || !window.crypto.subtle) return '';
    const bytes = new TextEncoder().encode(value);
    const digest = await window.crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const loadLocalSecrets = async () => {
    try {
      const response = await fetch('secrets.local.txt', { cache: 'no-store' });
      if (!response.ok) return;
      const raw = await response.text();
      const lines = raw.split(/\r?\n/);
      let keyA = '';
      let keyB = '';

      for (const lineRaw of lines) {
        const line = lineRaw.trim();
        if (!line || line.startsWith('#') || !line.includes('=')) continue;
        const idx = line.indexOf('=');
        const k = line.slice(0, idx).trim().toLowerCase();
        const v = line.slice(idx + 1).trim();
        if (k === 'alpha') keyA = v;
        if (k === 'beta') keyB = v;
      }

      if (keyA) {
        const h = await sha256Hex(keyA.toLowerCase());
        if (h) secretHashA = h;
      }
      if (keyB) {
        const h = await sha256Hex(keyB.toLowerCase());
        if (h) secretHashB = h;
      }
    } catch (_err) {
      // Local secret file is optional
    }
  };

  const showNote = (message) => {
    if (!vaultNote) return;
    vaultNote.textContent = message;
  };

  const renderVaultOutput = () => {
    if (!vaultInput || !vaultOutput) return;
    vaultOutput.textContent = getVaultText();
  };

  const openVault = () => {
    if (!vault) return;
    vault.classList.add('is-open');
    vault.setAttribute('aria-hidden', 'false');
    renderVaultOutput();
    if (vaultInput) vaultInput.focus();
  };

  const closeVault = () => {
    if (!vault) return;
    vault.classList.remove('is-open');
    vault.setAttribute('aria-hidden', 'true');
  };

  const rollExternalUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  const rollEmbedUrl = [
    'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    '?autoplay=1',
    '&mute=0',
    '&rel=0',
    '&modestbranding=1',
    '&playsinline=1',
    '&enablejsapi=1',
    '&origin=',
    encodeURIComponent(window.location.origin)
  ].join('');
  let vxFallbackTimer = null;

  const setVxHint = (message) => {
    if (vxHint) vxHint.textContent = message;
  };

  const openExternalRoll = () => {
    const win = window.open(rollExternalUrl, '_blank', 'noopener,noreferrer');
    if (!win) {
      setVxHint('Launch blocked. Use Open Video.');
    }
  };

  const runVxFallbackTimer = () => {
    if (vxFallbackTimer) {
      clearTimeout(vxFallbackTimer);
    }
    vxFallbackTimer = setTimeout(() => {
      if (!(vx && vx.classList.contains('is-open'))) return;
      setVxHint('Embed issue detected. Opening externally...');
      openExternalRoll();
    }, 3500);
  };

  const openVX = () => {
    if (!vx) return;
    vx.classList.add('is-open');
    vx.setAttribute('aria-hidden', 'false');
    setVxHint('Attempting embedded playback...');

    if (vxVid) {
      vxVid.src = rollEmbedUrl;
      vxVid.onerror = () => {
        setVxHint('Embed error detected. Opening externally...');
        openExternalRoll();
      };
      vxVid.onload = () => {
        if (vxFallbackTimer) clearTimeout(vxFallbackTimer);
        setVxHint('If playback fails, use Open Video.');
      };
      runVxFallbackTimer();
    } else {
      setVxHint('Embed unavailable. Opening externally...');
      openExternalRoll();
    }
  };

  const closeVX = () => {
    if (!vx) return;
    vx.classList.remove('is-open');
    vx.setAttribute('aria-hidden', 'true');
    if (vxFallbackTimer) {
      clearTimeout(vxFallbackTimer);
      vxFallbackTimer = null;
    }
    if (vxVid) {
      vxVid.src = '';
    }
  };

  if (vaultInput) {
    vaultInput.addEventListener('input', renderVaultOutput);
  }

  if (vaultCopyFont) {
    vaultCopyFont.addEventListener('click', () => {
      if (!vaultOutput) return;
      const text = vaultOutput.textContent || '';
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => {
        showNote('Signal A sent.');
      });
    });
  }

  if (vaultCopyDiscord) {
    vaultCopyDiscord.addEventListener('click', async () => {
      const text = getVaultText();
      if (!text.trim()) return;

      const imageBlob = await makeDiscordImageBlob(text);
      if (!imageBlob) {
        showNote('Could not generate image.');
        return;
      }

      if (window.ClipboardItem && navigator.clipboard && navigator.clipboard.write) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': imageBlob })
          ]);
          showNote('Signal B sent.');
          return;
        } catch (err) {
          // Continue to fallback download path
        }
      }

      const url = URL.createObjectURL(imageBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'discord-font.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1200);
      showNote('Signal B packaged.');
    });
  }

  if (vaultClear) {
    vaultClear.addEventListener('click', () => {
      if (!vaultInput) return;
      vaultInput.value = '';
      renderVaultOutput();
      showNote('');
      vaultInput.focus();
    });
  }

  if (vaultClose) {
    vaultClose.addEventListener('click', closeVault);
  }

  if (vxClose) {
    vxClose.addEventListener('click', closeVX);
  }

  if (vxOpen) {
    vxOpen.addEventListener('click', () => {
      openExternalRoll();
    });
  }

  loadLocalSecrets();

  document.addEventListener('keydown', async (event) => {
    if (event.key === 'Escape') {
      if (vault && vault.classList.contains('is-open')) closeVault();
      if (vx && vx.classList.contains('is-open')) closeVX();
      return;
    }

    if (
      (vault && vault.classList.contains('is-open')) ||
      (vx && vx.classList.contains('is-open'))
    ) {
      return;
    }

    if (event.key === 'Backspace') {
      secretInput = '';
      event.preventDefault();
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      const entered = secretInput;
      secretInput = '';
      if (!entered) return;

      const enteredHash = await sha256Hex(entered);
      if (enteredHash && enteredHash === secretHashA) {
        openVault();
      } else if (enteredHash && enteredHash === secretHashB) {
        openVX();
      }
      return;
    }

    if (event.ctrlKey || event.altKey || event.metaKey || event.key.length !== 1) return;
    secretInput = (secretInput + event.key.toLowerCase()).slice(-64);
  });
});
