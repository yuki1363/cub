// JIS C 0617 準拠 単線図用電気図記号定義
// シンボル形状は JIS-C-0617-LR 単線図用カタログ（PDF）に準拠

// --- SVG描画ヘルパー ---
function el(g, tag, attrs) {
  const e = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  g.appendChild(e);
  return e;
}
function line(g, x1, y1, x2, y2) { el(g, 'line', { x1, y1, x2, y2 }); }
function circle(g, cx, cy, r) { el(g, 'circle', { cx, cy, r }); }
function circleFill(g, cx, cy, r) { el(g, 'circle', { cx, cy, r, class: 'filled' }); }
function rect(g, x, y, w, h) { el(g, 'rect', { x, y, width: w, height: h }); }
function drect(g, x, y, w, h) { el(g, 'rect', { x, y, width: w, height: h, 'stroke-dasharray': '4,3', fill: 'none' }); }
function path(g, d) { el(g, 'path', { d }); }
function text(g, x, y, str, size = 11) {
  const t = el(g, 'text', { x, y, 'font-size': size, 'text-anchor': 'middle', 'dominant-baseline': 'middle', class: 'component-label' });
  t.textContent = str;
}
function arc(g, cx, cy, r, startDeg, endDeg, clockwise) {
  const s = startDeg * Math.PI / 180, e = endDeg * Math.PI / 180;
  const x1 = cx + r * Math.cos(s), y1 = cy + r * Math.sin(s);
  const x2 = cx + r * Math.cos(e), y2 = cy + r * Math.sin(e);
  path(g, `M ${x1} ${y1} A ${r} ${r} 0 0 ${clockwise ? 1 : 0} ${x2} ${y2}`);
}
function wavePath(g, x1, y, x2) {
  const w = x2 - x1;
  path(g, `M ${x1} ${y} C ${x1+w*.1} ${y-8} ${x1+w*.4} ${y-8} ${x1+w*.5} ${y} S ${x2-w*.1} ${y+8} ${x2} ${y}`);
}

// 円形計器（円+テキスト+左右端子）共通
function drawCircleMeter(g, label, r = 18, fontSize = 12) {
  line(g, -(r+10), 0, -r, 0);
  circle(g, 0, 0, r);
  text(g, 0, 0, label, fontSize);
  line(g, r, 0, r+10, 0);
}
// 矩形継電器（矩形+テキスト+左右端子）共通
function drawRectRelay(g, label, w = 36, h = 22, fontSize = 10) {
  line(g, -(w/2+10), 0, -w/2, 0);
  rect(g, -w/2, -h/2, w, h);
  text(g, 0, 0, label, fontSize);
  line(g, w/2, 0, w/2+10, 0);
}

export const SYMBOL_GROUPS = [
  // ===================== 電源・電路 =====================
  {
    id: 'power', label: '電源・電路',
    items: [
      {
        id: 'ac-source', label: '交流電源',
        bbox: { minX: -30, minY: -20, maxX: 30, maxY: 20 },
        draw(g) {
          line(g, -30, 0, -20, 0); circle(g, 0, 0, 20); wavePath(g, -10, 0, 10); line(g, 20, 0, 30, 0);
        }
      },
      {
        id: 'dc-source', label: '直流電源',
        bbox: { minX: -30, minY: -12, maxX: 30, maxY: 12 },
        draw(g) {
          line(g, -30, 0, -14, 0);
          line(g, -14, -10, -14, 10); line(g, -5, -5, -5, 5);
          line(g, 5, -10, 5, 10); line(g, 14, -5, 14, 5);
          line(g, 14, 0, 30, 0);
        }
      },
      {
        id: 'battery', label: '蓄電池',
        bbox: { minX: -30, minY: -12, maxX: 30, maxY: 12 },
        draw(g) {
          line(g, -30, 0, -18, 0);
          line(g, -18, -10, -18, 10); line(g, -10, -5, -10, 5);
          line(g, -2, -10, -2, 10);  line(g, 6, -5, 6, 5);
          line(g, 6, 0, 30, 0);
        }
      },
      {
        // E_T1 - 接地 三本線
        id: 'ground', label: '接地（E）',
        bbox: { minX: -16, minY: -20, maxX: 16, maxY: 16 },
        draw(g) {
          line(g, 0, -20, 0, 0);
          line(g, -16, 0, 16, 0);
          line(g, -10, 7, 10, 7);
          line(g, -4, 14, 4, 14);
        }
      },
      {
        // E-TB terminal block
        id: 'neutral', label: '中性線（N）',
        bbox: { minX: -16, minY: -20, maxX: 16, maxY: 8 },
        draw(g) {
          line(g, 0, -20, 0, 0);
          line(g, -16, 0, 16, 0);
          line(g, -16, 7, 16, 7);
        }
      },
      {
        // E-TB terminal block symbol
        id: 'e-tb', label: '端子台（E-TB）',
        bbox: { minX: -40, minY: -8, maxX: 40, maxY: 8 },
        draw(g) {
          // ○ ○ ○ --- ○ form
          circle(g, -24, 0, 7); circle(g, -8, 0, 7); circle(g, 8, 0, 7);
          line(g, 15, 0, 40, 0); line(g, -40, 0, -31, 0);
          line(g, -1, 0, 1, 0);
        }
      },
      {
        id: 'wire-cross', label: '交差（非接続）',
        bbox: { minX: -20, minY: -20, maxX: 20, maxY: 20 },
        draw(g) {
          line(g, -20, 0, -6, 0); line(g, 6, 0, 20, 0); line(g, 0, -20, 0, 20);
          arc(g, 0, 0, 6, 180, 0, false);
        }
      },
      {
        id: 'wire-junction', label: 'T接続（接続点）',
        bbox: { minX: -20, minY: -20, maxX: 20, maxY: 20 },
        draw(g) {
          line(g, -20, 0, 20, 0); line(g, 0, -20, 0, 0); circleFill(g, 0, 0, 4);
        }
      },
    ]
  },

  // ===================== 高圧機器 =====================
  {
    id: 'high-voltage', label: '高圧機器',
    items: [
      {
        // PAS_T1H: dashed rect, circle+diagonal contact inside
        id: 'pas', label: '高圧気中開閉器（PAS）',
        bbox: { minX: -30, minY: -18, maxX: 30, maxY: 18 },
        draw(g) {
          line(g, -30, 0, -20, 0);
          drect(g, -20, -18, 40, 36);
          // diagonal contact blade
          line(g, -14, 10, 8, -10);
          // small circle (arc gap element)
          circle(g, 12, -10, 5);
          line(g, 20, 0, 30, 0);
        }
      },
      {
        // LBS_T1H: dashed rect, circle + slash
        id: 'lbs', label: '負荷開閉器（LBS）',
        bbox: { minX: -30, minY: -18, maxX: 30, maxY: 18 },
        draw(g) {
          line(g, -30, 0, -20, 0);
          drect(g, -20, -18, 40, 36);
          circle(g, 8, 0, 9);
          line(g, -14, 12, 4, -12);
          line(g, 20, 0, 30, 0);
        }
      },
      {
        // LBS-PF_T1H: diamond shape
        id: 'lbs-pf', label: 'PF付負荷開閉器（LBS-PF）',
        bbox: { minX: -30, minY: -18, maxX: 30, maxY: 18 },
        draw(g) {
          line(g, -30, 0, -20, 0);
          path(g, 'M 0 -18 L 20 0 L 0 18 L -20 0 Z');
          circle(g, 8, 0, 6);
          line(g, -14, 8, 2, -8);
          line(g, 20, 0, 30, 0);
        }
      },
      {
        // PC_T1H: diagonal line (power condenser/cutout)
        id: 'pc', label: '高圧カットアウト（PC）',
        bbox: { minX: -30, minY: -14, maxX: 30, maxY: 14 },
        draw(g) {
          line(g, -30, 0, 30, 0);
          line(g, -14, 12, 14, -12);
        }
      },
      {
        // PC-PF_T1H/FDS-PF: diamond
        id: 'pc-pf', label: 'PF付カットアウト（PC-PF）',
        bbox: { minX: -30, minY: -18, maxX: 30, maxY: 18 },
        draw(g) {
          line(g, -30, 0, -20, 0);
          path(g, 'M 0 -18 L 20 0 L 0 18 L -20 0 Z');
          line(g, 20, 0, 30, 0);
        }
      },
      {
        // DS-1P_T1H: dashed rect, single diagonal contact
        id: 'ds-1p', label: '断路器 1極（DS-1P）',
        bbox: { minX: -30, minY: -18, maxX: 30, maxY: 18 },
        draw(g) {
          line(g, -30, 0, -20, 0);
          drect(g, -20, -18, 40, 36);
          // switch contact blade
          line(g, -14, 12, 14, -12);
          line(g, 20, 0, 30, 0);
        }
      },
      {
        // DS-3P_T1H: dashed rect, 3 diagonal contacts
        id: 'ds-3p', label: '断路器 3極（DS-3P）',
        bbox: { minX: -30, minY: -18, maxX: 30, maxY: 18 },
        draw(g) {
          line(g, -30, 0, -20, 0);
          drect(g, -20, -18, 40, 36);
          line(g, -14, 12, 14, -12);
          line(g, -8,  12, 14,  -6);
          line(g, -14,  6, 8,  -12);
          line(g, 20, 0, 30, 0);
        }
      },
      {
        id: 'ds-il', label: '断路器 インターロック付（DS-IL）',
        bbox: { minX: -40, minY: -14, maxX: 40, maxY: 14 },
        draw(g) {
          line(g, -40, 0, -30, 0);
          drect(g, -30, -14, 60, 28);
          line(g, -20, 10, 20, -10);
          path(g, 'M -8 -4 L 8 -4');  // interlock mark
          line(g, 30, 0, 40, 0);
        }
      },
      {
        id: 'ds-rmo', label: '断路器 遠隔操作（DS-RMO）',
        bbox: { minX: -20, minY: -30, maxX: 20, maxY: 10 },
        draw(g) {
          line(g, 0, -30, 0, 10);
          line(g, -20, 10, 20, 10);
        }
      },
      {
        // VCB_T1H: dashed rect with × inside
        id: 'vcb', label: '真空遮断器（VCB）',
        bbox: { minX: -30, minY: -18, maxX: 30, maxY: 18 },
        draw(g) {
          line(g, -30, 0, -20, 0);
          drect(g, -20, -18, 40, 36);
          line(g, -12, -12, 12, 12);
          line(g, -12,  12, 12, -12);
          line(g, 20, 0, 30, 0);
        }
      },
      {
        // VCB-AUT: VCB with actuator (spring charging mark)
        id: 'vcb-aut', label: '自動VCB（VCB-AUT）',
        bbox: { minX: -30, minY: -22, maxX: 30, maxY: 22 },
        draw(g) {
          line(g, -30, 0, -20, 0);
          drect(g, -20, -18, 40, 36);
          line(g, -12, -12, 12, 12); line(g, -12, 12, 12, -12);
          // actuator symbol (spring)
          line(g, 0, 18, 0, 22); circleFill(g, 0, -22, 4);
          line(g, 20, 0, 30, 0);
        }
      },
      {
        // LA-1P: solid filled triangle (lightning arrester)
        id: 'la-1p', label: '避雷器（LA）',
        bbox: { minX: -20, minY: -20, maxX: 20, maxY: 20 },
        draw(g) {
          line(g, -20, 0, -14, 0);
          path(g, 'M -14 -16 L 14 0 L -14 16 Z');
          el(g, 'path', { d: 'M -14 -16 L 14 0 L -14 16 Z', class: 'filled' });
          line(g, 14, 0, 20, 0);
        }
      },
      {
        // VCMC: vacuum contactor
        id: 'vcmc', label: '真空電磁接触器（VCMC）',
        bbox: { minX: -30, minY: -18, maxX: 30, maxY: 18 },
        draw(g) {
          line(g, -30, 0, -20, 0);
          drect(g, -20, -18, 40, 36);
          // contactor symbol inside: arc + diagonal
          line(g, -10, 12, 10, -4);
          arc(g, 10, -4, 6, 90, 270, false);
          line(g, 20, 0, 30, 0);
        }
      },
    ]
  },

  // ===================== 低圧遮断器・開閉器 =====================
  {
    id: 'breaker', label: '低圧遮断器・開閉器',
    items: [
      {
        // MCCB_T1H: × cross with left/right terminals
        id: 'mccb', label: '配線用遮断器（MCCB）',
        bbox: { minX: -28, minY: -14, maxX: 28, maxY: 14 },
        draw(g) {
          line(g, -28, 0, -12, 0);
          line(g, -10, -10, 10, 10);
          line(g, -10,  10, 10, -10);
          line(g, 12, 0, 28, 0);
        }
      },
      {
        // MCCB 2P (same visual for single-line)
        id: 'mccb-2p', label: 'MCCB 2極',
        bbox: { minX: -28, minY: -14, maxX: 28, maxY: 14 },
        draw(g) {
          line(g, -28, 0, -12, 0);
          line(g, -10, -10, 10, 10); line(g, -10, 10, 10, -10);
          line(g, 12, 0, 28, 0);
          text(g, 0, -16, '2P', 8);
        }
      },
      {
        id: 'mccb-3p', label: 'MCCB 3極',
        bbox: { minX: -28, minY: -14, maxX: 28, maxY: 14 },
        draw(g) {
          line(g, -28, 0, -12, 0);
          line(g, -10, -10, 10, 10); line(g, -10, 10, 10, -10);
          line(g, 12, 0, 28, 0);
          text(g, 0, -16, '3P', 8);
        }
      },
      {
        // ELCB_T1H: × with earth fault indicator (circle with Ø below)
        id: 'elcb', label: '漏電遮断器（ELCB）',
        bbox: { minX: -28, minY: -14, maxX: 28, maxY: 20 },
        draw(g) {
          line(g, -28, 0, -12, 0);
          line(g, -10, -10, 10, 10); line(g, -10, 10, 10, -10);
          // earth fault indicator below
          line(g, 0, 10, 0, 14);
          circle(g, 0, 18, 4);
          line(g, 12, 0, 28, 0);
        }
      },
      {
        id: 'elcb-2p', label: 'ELCB 2極',
        bbox: { minX: -28, minY: -14, maxX: 28, maxY: 20 },
        draw(g) {
          line(g, -28, 0, -12, 0);
          line(g, -10, -10, 10, 10); line(g, -10, 10, 10, -10);
          line(g, 0, 10, 0, 14); circle(g, 0, 18, 4);
          line(g, 12, 0, 28, 0);
          text(g, 0, -16, '2P', 8);
        }
      },
      {
        id: 'elcb-3p', label: 'ELCB 3極',
        bbox: { minX: -28, minY: -14, maxX: 28, maxY: 20 },
        draw(g) {
          line(g, -28, 0, -12, 0);
          line(g, -10, -10, 10, 10); line(g, -10, 10, 10, -10);
          line(g, 0, 10, 0, 14); circle(g, 0, 18, 4);
          line(g, 12, 0, 28, 0);
          text(g, 0, -16, '3P', 8);
        }
      },
      {
        // F_T1H: plain rectangle (fuse)
        id: 'fuse', label: 'ヒューズ（F）',
        bbox: { minX: -28, minY: -10, maxX: 28, maxY: 10 },
        draw(g) {
          line(g, -28, 0, -18, 0);
          rect(g, -18, -10, 36, 20);
          line(g, 18, 0, 28, 0);
        }
      },
      {
        // FBU: wave/coil shape
        id: 'fbu', label: 'ヒューズユニット（FBU）',
        bbox: { minX: -30, minY: -12, maxX: 30, maxY: 12 },
        draw(g) {
          line(g, -30, 0, -22, 0);
          wavePath(g, -22, 0, 22);
          line(g, 22, 0, 30, 0);
        }
      },
      {
        // FDS-1P: dashed rect with diagonal (fused disconnector)
        id: 'fds-1p', label: '断路ヒューズ 1極（FDS-1P）',
        bbox: { minX: -30, minY: -18, maxX: 30, maxY: 18 },
        draw(g) {
          line(g, -30, 0, -20, 0);
          drect(g, -20, -18, 40, 36);
          // fuse rect inside
          rect(g, -6, -7, 12, 14);
          line(g, -14, 12, -6, 4);
          line(g, 6, -4, 14, -12);
          line(g, 20, 0, 30, 0);
        }
      },
      {
        // FDS-PF: diamond (power fuse disconnector)
        id: 'fds-pf', label: '電力ヒューズ断路器（FDS-PF）',
        bbox: { minX: -30, minY: -18, maxX: 30, maxY: 18 },
        draw(g) {
          line(g, -30, 0, -20, 0);
          path(g, 'M 0 -18 L 20 0 L 0 18 L -20 0 Z');
          line(g, 20, 0, 30, 0);
        }
      },
      {
        // ACB: similar to MCCB but in solid rect
        id: 'acb', label: '気中遮断器（ACB）',
        bbox: { minX: -28, minY: -14, maxX: 28, maxY: 14 },
        draw(g) {
          line(g, -28, 0, -18, 0);
          rect(g, -18, -14, 36, 28);
          line(g, -10, -10, 10, 10); line(g, -10, 10, 10, -10);
          line(g, 18, 0, 28, 0);
        }
      },
      {
        // ELR: rect with "EL" text
        id: 'elr', label: '漏電リレー（ELR）',
        bbox: { minX: -28, minY: -14, maxX: 28, maxY: 14 },
        draw(g) { drawRectRelay(g, 'EL', 36, 28, 11); }
      },
      {
        // KS: knife switch
        id: 'ks', label: '切換スイッチ（KS）',
        bbox: { minX: -30, minY: -22, maxX: 30, maxY: 22 },
        draw(g) {
          line(g, -30, 0, -16, 0);
          // pivot
          circleFill(g, -16, 0, 3);
          // blade
          line(g, -16, 0, 14, -14);
          // foot/ground
          line(g, 16, 0, 30, 0);
          line(g, 16, -8, 16, 8);
          line(g, 0, 22, 20, 22);
          line(g, 10, 22, 10, 8);
        }
      },
    ]
  },

  // ===================== 継電器 =====================
  {
    id: 'relay', label: '継電器',
    items: [
      {
        // OCR_T1H: rect "I>"
        id: 'ocr', label: '過電流継電器（OCR）',
        bbox: { minX: -28, minY: -14, maxX: 28, maxY: 14 },
        draw(g) { drawRectRelay(g, 'I >', 36, 28, 11); }
      },
      {
        // OCR-DO: with direct trip contacts
        id: 'ocr-do', label: 'OCR 直動型（OCR-DO）',
        bbox: { minX: -28, minY: -20, maxX: 28, maxY: 20 },
        draw(g) {
          line(g, -28, 0, -18, 0);
          rect(g, -18, -14, 36, 28);
          text(g, 0, 0, 'I >', 11);
          line(g, 18, 0, 28, 0);
          // DO contacts below
          circleFill(g, -20, 20, 4); line(g, -20, 16, -8, 16); line(g, -8, 16, -8, 20);
          circleFill(g, 20, 20, 4);  line(g, 20, 16, 8, 16);  line(g, 8, 16, 8, 20);
        }
      },
      {
        // OCGR_T1: rect "I≥"
        id: 'ocgr', label: '過電流地絡継電器（OCGR）',
        bbox: { minX: -28, minY: -14, maxX: 28, maxY: 14 },
        draw(g) { drawRectRelay(g, 'I≥', 36, 28, 11); }
      },
      {
        // DGR_T1H: rect "I≥" with direction arrow below
        id: 'dgr', label: '地絡方向継電器（DGR）',
        bbox: { minX: -28, minY: -14, maxX: 28, maxY: 22 },
        draw(g) {
          line(g, -28, 0, -18, 0);
          rect(g, -18, -14, 36, 28);
          text(g, 0, -2, 'I≥', 10);
          // direction arrow below rect
          path(g, 'M -8 20 L 8 20');
          path(g, 'M 4 16 L 8 20 L 4 24');
          line(g, 18, 0, 28, 0);
        }
      },
      {
        id: 'dgr-do', label: 'DGR 直動型（DGR-DO）',
        bbox: { minX: -28, minY: -20, maxX: 28, maxY: 26 },
        draw(g) {
          line(g, -28, 0, -18, 0);
          rect(g, -18, -14, 36, 28);
          text(g, 0, -2, 'I≥', 10);
          path(g, 'M -8 20 L 8 20'); path(g, 'M 4 16 L 8 20 L 4 24');
          line(g, 18, 0, 28, 0);
          circleFill(g, -20, -20, 4); circleFill(g, 20, -20, 4);
          line(g, -20, -20, -20, -14); line(g, 20, -20, 20, -14);
        }
      },
      {
        // OVR_T1H: rect "U>"
        id: 'ovr', label: '過電圧継電器（OVR）',
        bbox: { minX: -28, minY: -14, maxX: 28, maxY: 14 },
        draw(g) { drawRectRelay(g, 'U >', 36, 28, 11); }
      },
      {
        // OVGR_T1H: rect "U≥"
        id: 'ovgr', label: '過電圧地絡継電器（OVGR）',
        bbox: { minX: -28, minY: -14, maxX: 28, maxY: 14 },
        draw(g) { drawRectRelay(g, 'U≥', 36, 28, 11); }
      },
      {
        // UVR_T1H: rect "U<"
        id: 'uvr', label: '不足電圧継電器（UVR）',
        bbox: { minX: -28, minY: -14, maxX: 28, maxY: 14 },
        draw(g) { drawRectRelay(g, 'U <', 36, 28, 11); }
      },
      {
        // NVR_T1H: rect "U=0"
        id: 'nvr', label: '無電圧継電器（NVR）',
        bbox: { minX: -28, minY: -14, maxX: 28, maxY: 14 },
        draw(g) { drawRectRelay(g, 'U=0', 36, 28, 10); }
      },
      {
        // RPR: rect "P←"
        id: 'rpr', label: '逆電力継電器（RPR）',
        bbox: { minX: -28, minY: -14, maxX: 28, maxY: 14 },
        draw(g) { drawRectRelay(g, 'P←', 36, 28, 10); }
      },
      {
        // UFR: rect "f<"
        id: 'ufr', label: '不足周波数継電器（UFR）',
        bbox: { minX: -28, minY: -14, maxX: 28, maxY: 14 },
        draw(g) { drawRectRelay(g, 'f <', 36, 28, 11); }
      },
      {
        // OFR: rect "f>"
        id: 'ofr', label: '過周波数継電器（OFR）',
        bbox: { minX: -28, minY: -14, maxX: 28, maxY: 14 },
        draw(g) { drawRectRelay(g, 'f >', 36, 28, 11); }
      },
      {
        // THR: thermal relay (rect with thermal symbol)
        id: 'thr', label: 'サーマルリレー（THR）',
        bbox: { minX: -28, minY: -14, maxX: 28, maxY: 14 },
        draw(g) {
          line(g, -28, 0, -18, 0);
          rect(g, -18, -14, 36, 28);
          // thermal symbol: small zigzag
          path(g, 'M -8 6 L -4 -6 L 0 6 L 4 -6 L 8 6');
          line(g, 18, 0, 28, 0);
        }
      },
      {
        // ZCT_T2_T1HL: circle with diagonal (zero-sequence current transformer)
        id: 'zct', label: '零相変流器（ZCT）',
        bbox: { minX: -28, minY: -14, maxX: 28, maxY: 14 },
        draw(g) {
          line(g, -28, 0, -18, 0);
          circle(g, 0, 0, 14);
          line(g, -10, 10, 10, -10);
          line(g, 18, 0, 28, 0);
        }
      },
      {
        id: 'zvt', label: '零相変圧器（ZVT）',
        bbox: { minX: -28, minY: -14, maxX: 28, maxY: 14 },
        draw(g) {
          line(g, -28, 0, -18, 0);
          circle(g, 0, 0, 14);
          text(g, 0, 0, 'ZV', 8);
          line(g, 18, 0, 28, 0);
        }
      },
      {
        // EVT_T1HL: dashed rect with circle inside
        id: 'evt', label: '零相電圧変成器（EVT）',
        bbox: { minX: -28, minY: -18, maxX: 28, maxY: 18 },
        draw(g) {
          line(g, -28, 0, -18, 0);
          drect(g, -18, -18, 36, 36);
          circle(g, 0, 0, 10);
          line(g, 18, 0, 28, 0);
        }
      },
      {
        id: 'la', label: '避雷器（LA）',
        bbox: { minX: -20, minY: -20, maxX: 20, maxY: 20 },
        draw(g) {
          line(g, -20, 0, -14, 0);
          path(g, 'M -14 -16 L 14 0 L -14 16 Z');
          el(g, 'path', { d: 'M -14 -16 L 14 0 L -14 16 Z', class: 'filled' });
          line(g, 14, 0, 20, 0);
        }
      },
    ]
  },

  // ===================== 変圧器・変流器 =====================
  {
    id: 'transformer', label: '変圧器・変流器',
    items: [
      {
        // T-1P_T1H: two touching circles (single-phase transformer)
        id: 't-1p', label: '単相変圧器（T-1P）',
        bbox: { minX: -38, minY: -16, maxX: 38, maxY: 16 },
        draw(g) {
          line(g, -38, 0, -28, 0);
          circle(g, -14, 0, 14);
          circle(g, 14, 0, 14);
          line(g, 28, 0, 38, 0);
        }
      },
      {
        // T-3P_T1H: three overlapping circles (simplified)
        id: 't-3p', label: '三相変圧器（T-3P）',
        bbox: { minX: -38, minY: -24, maxX: 38, maxY: 24 },
        draw(g) {
          line(g, -38, 0, -28, 0);
          // primary (left): 3 circles stacked
          circle(g, -14, -8, 10);
          circle(g, -14,  0, 10);
          circle(g, -14,  8, 10);
          // secondary (right): 3 circles stacked
          circle(g, 14, -8, 10);
          circle(g, 14,  0, 10);
          circle(g, 14,  8, 10);
          line(g, 28, 0, 38, 0);
        }
      },
      {
        // CT-H_T1HL: dashed rect with circle inside (high voltage CT)
        id: 'ct-h', label: '変流器 高圧（CT-H）',
        bbox: { minX: -28, minY: -18, maxX: 28, maxY: 18 },
        draw(g) {
          line(g, -28, 0, -18, 0);
          drect(g, -18, -18, 36, 36);
          circle(g, 0, 0, 10);
          line(g, 18, 0, 28, 0);
        }
      },
      {
        // CT-L_T1HL: plain circle (low voltage CT)
        id: 'ct-l', label: '変流器 低圧（CT-L）',
        bbox: { minX: -28, minY: -14, maxX: 28, maxY: 14 },
        draw(g) {
          line(g, -28, 0, -14, 0);
          circle(g, 0, 0, 14);
          line(g, 14, 0, 28, 0);
        }
      },
      {
        // VT-H_T1H: dashed rect with concentric circles (high voltage VT)
        id: 'vt-h', label: '計器用変圧器 高圧（VT-H）',
        bbox: { minX: -28, minY: -18, maxX: 28, maxY: 18 },
        draw(g) {
          line(g, -28, 0, -18, 0);
          drect(g, -18, -18, 36, 36);
          circle(g, 0, 0, 12);
          circle(g, 0, 0, 6);
          line(g, 18, 0, 28, 0);
        }
      },
      {
        // VT-L / VTT_T1H: concentric circles (low voltage VT / toroidal)
        id: 'vt-l', label: '計器用変圧器 低圧（VT-L）',
        bbox: { minX: -28, minY: -14, maxX: 28, maxY: 14 },
        draw(g) {
          line(g, -28, 0, -14, 0);
          circle(g, 0, 0, 14);
          circle(g, 0, 0, 7);
          line(g, 14, 0, 28, 0);
        }
      },
      {
        // SRX-H_T1H: ring/toroid shape (series reactor high)
        id: 'srx-h', label: '直列リアクトル 高圧（SRX-H）',
        bbox: { minX: -28, minY: -18, maxX: 28, maxY: 18 },
        draw(g) {
          line(g, -28, 0, -18, 0);
          drect(g, -18, -18, 36, 36);
          // toroid: outer and inner circle
          circle(g, 0, 0, 12);
          circle(g, 0, 0, 6);
          line(g, 18, 0, 28, 0);
        }
      },
      {
        // SRX-L_T1H: crescent/arc (series reactor low)
        id: 'srx-l', label: '直列リアクトル 低圧（SRX-L）',
        bbox: { minX: -28, minY: -14, maxX: 28, maxY: 14 },
        draw(g) {
          line(g, -28, 0, -14, 0);
          // crescent: two arcs
          arc(g, 0, 0, 14, 150, 30, true);
          arc(g, -6, 0, 12, -30, 30, true);
          line(g, 14, 0, 28, 0);
        }
      },
      {
        // CC: capacitor bank (rectangle)
        id: 'cc', label: 'コンデンサ（CC）',
        bbox: { minX: -28, minY: -14, maxX: 28, maxY: 14 },
        draw(g) {
          line(g, -28, 0, -18, 0);
          rect(g, -18, -14, 36, 28);
          line(g, 18, 0, 28, 0);
        }
      },
      {
        id: 'apfc', label: '自動力率調整（APFC）',
        bbox: { minX: -28, minY: -14, maxX: 28, maxY: 14 },
        draw(g) { drawRectRelay(g, 'APFC', 36, 28, 8); }
      },
      {
        // SC-H: series capacitor high (two vertical lines with terminals)
        id: 'sc-h', label: '開閉コンデンサ 高圧（SC-H）',
        bbox: { minX: -28, minY: -14, maxX: 28, maxY: 14 },
        draw(g) {
          line(g, -28, 0, -8, 0);
          line(g, -8, -14, -8, 14);
          line(g, 8, -14, 8, 14);
          line(g, 8, 0, 28, 0);
        }
      },
      {
        id: 'sc-l', label: '開閉コンデンサ 低圧（SC-L）',
        bbox: { minX: -28, minY: -14, maxX: 28, maxY: 14 },
        draw(g) {
          line(g, -28, 0, -8, 0);
          line(g, -8, -14, -8, 14);
          line(g, 8, -10, 8, 10);
          line(g, 8, 0, 28, 0);
        }
      },
    ]
  },

  // ===================== 電磁接触器・開閉器 =====================
  {
    id: 'contactor', label: '電磁接触器・開閉器',
    items: [
      {
        // MC_T1HL: arc (opening contact) with small circle at end
        id: 'mc', label: '電磁接触器（MC）',
        bbox: { minX: -28, minY: -14, maxX: 28, maxY: 14 },
        draw(g) {
          line(g, -28, 0, -14, 0);
          // contact: arc
          arc(g, -14, 0, 14, -30, 30, true);
          // small open circle at arc end = load contact
          circle(g, 14, 0, 5);
          line(g, 19, 0, 28, 0);
        }
      },
      {
        // MC-DT: MC with directional trip indicator
        id: 'mc-dt', label: '電磁接触器 タイムドライ（MC-DT）',
        bbox: { minX: -28, minY: -14, maxX: 28, maxY: 14 },
        draw(g) {
          line(g, -28, 0, -14, 0);
          arc(g, -14, 0, 14, -30, 30, true);
          circle(g, 14, 0, 5);
          line(g, 19, 0, 28, 0);
          // DT: small diagonal marks
          line(g, -4, -6, 4, -10);
        }
      },
      {
        // MS: magnetic starter (MC + thermal relay = same as MC with THR mark)
        id: 'ms', label: '電磁開閉器（MS）',
        bbox: { minX: -28, minY: -14, maxX: 28, maxY: 14 },
        draw(g) {
          line(g, -28, 0, -16, 0);
          // MC arc
          arc(g, -16, 0, 12, -30, 30, true);
          // THR zigzag
          path(g, 'M 0 4 L 3 -4 L 6 4 L 9 -4 L 12 4');
          circle(g, 16, 0, 5);
          line(g, 21, 0, 28, 0);
        }
      },
      {
        id: 'ks', label: '切換スイッチ（KS）',
        bbox: { minX: -30, minY: -22, maxX: 30, maxY: 22 },
        draw(g) {
          line(g, -30, 0, -16, 0);
          circleFill(g, -16, 0, 3);
          line(g, -16, 0, 14, -14);
          line(g, 16, 0, 30, 0);
          line(g, 16, -8, 16, 8);
          line(g, 0, 22, 20, 22); line(g, 10, 22, 10, 8);
        }
      },
      {
        // INV: rectangle (inverter)
        id: 'inv', label: 'インバータ（INV）',
        bbox: { minX: -28, minY: -16, maxX: 28, maxY: 16 },
        draw(g) {
          line(g, -28, 0, -18, 0);
          rect(g, -18, -16, 36, 32);
          // INV symbol: wave inside
          wavePath(g, -10, 4, 10);
          line(g, -10, -4, 10, -4);
          line(g, 18, 0, 28, 0);
        }
      },
      {
        id: 'inv-dcr', label: 'INV DCリアクトル付（INV-DCR）',
        bbox: { minX: -38, minY: -16, maxX: 38, maxY: 16 },
        draw(g) {
          line(g, -38, 0, -28, 0);
          // DCR: coil
          wavePath(g, -28, 0, -18);
          rect(g, -18, -16, 36, 32);
          wavePath(g, -10, 4, 10);
          line(g, -10, -4, 10, -4);
          line(g, 18, 0, 38, 0);
        }
      },
    ]
  },

  // ===================== 電動機・発電機 =====================
  {
    id: 'motor', label: '電動機・発電機',
    items: [
      {
        // IM_T1H: circle with "M"
        id: 'im', label: '誘導電動機（IM）',
        bbox: { minX: -28, minY: -18, maxX: 28, maxY: 18 },
        draw(g) { drawCircleMeter(g, 'M', 18, 14); }
      },
      {
        id: 'motor-3p', label: '三相誘導電動機（3M）',
        bbox: { minX: -28, minY: -18, maxX: 28, maxY: 18 },
        draw(g) {
          line(g, -28, 0, -18, 0); circle(g, 0, 0, 18);
          text(g, 0, -3, 'M', 12); text(g, 0, 8, '3~', 8);
          line(g, 18, 0, 28, 0);
        }
      },
      {
        id: 'motor-1p', label: '単相電動機（1M）',
        bbox: { minX: -28, minY: -18, maxX: 28, maxY: 18 },
        draw(g) {
          line(g, -28, 0, -18, 0); circle(g, 0, 0, 18);
          text(g, 0, -3, 'M', 12); text(g, 0, 8, '1~', 8);
          line(g, 18, 0, 28, 0);
        }
      },
      {
        // G_T1: circle with "G"
        id: 'generator', label: '発電機（G）',
        bbox: { minX: -28, minY: -18, maxX: 28, maxY: 18 },
        draw(g) { drawCircleMeter(g, 'G', 18, 14); }
      },
    ]
  },

  // ===================== 計測器 =====================
  {
    id: 'meter', label: '計測器',
    items: [
      {
        // AM_T1H: circle "A"
        id: 'am', label: '電流計（AM）',
        bbox: { minX: -28, minY: -18, maxX: 28, maxY: 18 },
        draw(g) { drawCircleMeter(g, 'A', 18, 14); }
      },
      {
        // VM_T1H: circle "V"
        id: 'vm', label: '電圧計（VM）',
        bbox: { minX: -28, minY: -18, maxX: 28, maxY: 18 },
        draw(g) { drawCircleMeter(g, 'V', 18, 14); }
      },
      {
        // WM_T1H: circle "W"
        id: 'wm', label: '電力計（WM）',
        bbox: { minX: -28, minY: -18, maxX: 28, maxY: 18 },
        draw(g) { drawCircleMeter(g, 'W', 18, 14); }
      },
      {
        // WHM_T1H: rectangle "Wh"
        id: 'whm', label: '電力量計（WHM）',
        bbox: { minX: -28, minY: -18, maxX: 28, maxY: 18 },
        draw(g) {
          line(g, -28, 0, -18, 0);
          rect(g, -18, -18, 36, 36);
          text(g, 0, 0, 'Wh', 12);
          line(g, 18, 0, 28, 0);
        }
      },
      {
        // FM_T1H: circle "Hz"
        id: 'fm', label: '周波数計（FM）',
        bbox: { minX: -28, minY: -18, maxX: 28, maxY: 18 },
        draw(g) { drawCircleMeter(g, 'Hz', 18, 11); }
      },
      {
        // PFM_T1H: circle "cosψ"
        id: 'pfm', label: '力率計（PFM）',
        bbox: { minX: -28, minY: -18, maxX: 28, maxY: 18 },
        draw(g) { drawCircleMeter(g, 'cosψ', 18, 8); }
      },
      {
        // VARM_T1H: circle "var"
        id: 'varm', label: '無効電力計（VARM）',
        bbox: { minX: -28, minY: -18, maxX: 28, maxY: 18 },
        draw(g) { drawCircleMeter(g, 'var', 18, 10); }
      },
      {
        // VARHM_T1H: rect "varh"
        id: 'mdam', label: '無効電力量計（VARHM）',
        bbox: { minX: -28, minY: -18, maxX: 28, maxY: 18 },
        draw(g) {
          line(g, -28, 0, -18, 0);
          rect(g, -18, -18, 36, 36);
          text(g, 0, 0, 'varh', 10);
          line(g, 18, 0, 28, 0);
        }
      },
      {
        // HAM_T1H: circle "HA"
        id: 'ham', label: '高調波計（HAM）',
        bbox: { minX: -28, minY: -18, maxX: 28, maxY: 18 },
        draw(g) { drawCircleMeter(g, 'HA', 18, 12); }
      },
      {
        // MAM_T1H: circle "MA"
        id: 'mam', label: '最大電流計（MAM）',
        bbox: { minX: -28, minY: -18, maxX: 28, maxY: 18 },
        draw(g) { drawCircleMeter(g, 'MA', 18, 12); }
      },
      {
        // MWM_T1H: circle "MW"
        id: 'mwm', label: '最大電力計（MWM）',
        bbox: { minX: -28, minY: -18, maxX: 28, maxY: 18 },
        draw(g) { drawCircleMeter(g, 'MW', 18, 12); }
      },
      {
        // VOM_T1H: circle "V₀"
        id: 'v0m', label: '零相電圧計（V0M）',
        bbox: { minX: -28, minY: -18, maxX: 28, maxY: 18 },
        draw(g) { drawCircleMeter(g, 'V₀', 18, 12); }
      },
      {
        // TD-A/V/W/VAR: rect with diagonal (variable/digital indicator)
        id: 'td-a', label: 'デジタル電流計（TD-A）',
        bbox: { minX: -28, minY: -18, maxX: 28, maxY: 18 },
        draw(g) {
          line(g, -28, 0, -18, 0);
          rect(g, -18, -18, 36, 36);
          line(g, -14, 14, 14, -14);
          text(g, 8, 8, 'A', 10);
          line(g, 18, 0, 28, 0);
        }
      },
      {
        id: 'td-v', label: 'デジタル電圧計（TD-V）',
        bbox: { minX: -28, minY: -18, maxX: 28, maxY: 18 },
        draw(g) {
          line(g, -28, 0, -18, 0);
          rect(g, -18, -18, 36, 36);
          line(g, -14, 14, 14, -14);
          text(g, 8, 8, 'V', 10);
          line(g, 18, 0, 28, 0);
        }
      },
      {
        id: 'td-w', label: 'デジタル電力計（TD-W）',
        bbox: { minX: -28, minY: -18, maxX: 28, maxY: 18 },
        draw(g) {
          line(g, -28, 0, -18, 0);
          rect(g, -18, -18, 36, 36);
          line(g, -14, 14, 14, -14);
          text(g, 8, 8, 'W', 9);
          line(g, 18, 0, 28, 0);
        }
      },
      {
        id: 'td-pf', label: 'デジタル力率計（TD-PF）',
        bbox: { minX: -28, minY: -18, maxX: 28, maxY: 18 },
        draw(g) {
          line(g, -28, 0, -18, 0);
          rect(g, -18, -18, 36, 36);
          line(g, -14, 14, 14, -14);
          text(g, 6, 8, 'PF', 8);
          line(g, 18, 0, 28, 0);
        }
      },
    ]
  },

  // ===================== 制御・接点 =====================
  {
    id: 'control', label: '制御・接点',
    items: [
      {
        // RY-A: normally open contact (a接点)
        id: 'ry-a', label: 'リレー a接点（RY-A）',
        bbox: { minX: -20, minY: -14, maxX: 20, maxY: 14 },
        draw(g) {
          line(g, -20, 0, -8, 0);
          line(g, -8, 0, 8, -12);
          line(g, 8, 0, 20, 0);
        }
      },
      {
        // RY-B: normally closed contact (b接点)
        id: 'ry-b', label: 'リレー b接点（RY-B）',
        bbox: { minX: -20, minY: -14, maxX: 20, maxY: 14 },
        draw(g) {
          line(g, -20, 0, -8, 0);
          line(g, -8, 0, 8, -12);
          line(g, 0, -12, 0, 2);
          line(g, 8, 0, 20, 0);
        }
      },
      {
        id: 'ry-c', label: 'リレー c接点（切換）（RY-C）',
        bbox: { minX: -20, minY: -14, maxX: 20, maxY: 14 },
        draw(g) {
          line(g, -20, 0, -8, 0);
          line(g, -8, 0, 8, -12);
          line(g, -8, 0, 8, 12);
          line(g, 8, 0, 20, 0);
        }
      },
      {
        // R: relay coil
        id: 'r', label: 'リレーコイル（R）',
        bbox: { minX: -20, minY: -10, maxX: 20, maxY: 10 },
        draw(g) {
          line(g, -20, 0, -12, 0);
          rect(g, -12, -10, 24, 20);
          line(g, 12, 0, 20, 0);
        }
      },
      {
        // PBS-A: push button normally open
        id: 'pbs-a', label: '押しボタン a接点（PBS-A）',
        bbox: { minX: -20, minY: -16, maxX: 20, maxY: 8 },
        draw(g) {
          line(g, -20, 0, -8, 0);
          line(g, -8, 0, 8, -12);
          line(g, -4, -12, 4, -12);
          line(g, 0, -12, 0, -16);
          line(g, 8, 0, 20, 0);
        }
      },
      {
        // PBS-B: push button normally closed
        id: 'pbs-b', label: '押しボタン b接点（PBS-B）',
        bbox: { minX: -20, minY: -16, maxX: 20, maxY: 8 },
        draw(g) {
          line(g, -20, 0, -8, 0);
          line(g, -8, 0, 8, -12);
          line(g, 0, -12, 0, 2);
          line(g, -4, -12, 4, -12);
          line(g, 0, -12, 0, -16);
          line(g, 8, 0, 20, 0);
        }
      },
      {
        id: 'cos-a', label: '切換スイッチ a接点（COS-A）',
        bbox: { minX: -20, minY: -14, maxX: 20, maxY: 14 },
        draw(g) {
          line(g, -20, 0, -8, 0);
          line(g, -8, 0, 8, -12);
          line(g, -12, -8, -6, -2);
          line(g, 8, 0, 20, 0);
        }
      },
      {
        id: 'cos-b', label: '切換スイッチ b接点（COS-B）',
        bbox: { minX: -20, minY: -14, maxX: 20, maxY: 14 },
        draw(g) {
          line(g, -20, 0, -8, 0);
          line(g, -8, 0, 8, -12);
          line(g, 0, -12, 0, 2);
          line(g, -12, -8, -6, -2);
          line(g, 8, 0, 20, 0);
        }
      },
      {
        // TDR on-delay: a-contact with timing mark
        id: 'tdr-on', label: 'タイマリレー オンディレイ（TDR-ON）',
        bbox: { minX: -20, minY: -16, maxX: 20, maxY: 8 },
        draw(g) {
          line(g, -20, 0, -8, 0);
          line(g, -8, 0, 8, -12);
          // timing mark: small arc
          path(g, 'M -4 -14 A 4 4 0 0 1 4 -14');
          line(g, 8, 0, 20, 0);
        }
      },
      {
        id: 'tdr-off', label: 'タイマリレー オフディレイ（TDR-OFF）',
        bbox: { minX: -20, minY: -16, maxX: 20, maxY: 8 },
        draw(g) {
          line(g, -20, 0, -8, 0);
          line(g, -8, 0, 8, -12);
          line(g, 0, -12, 0, 2);
          path(g, 'M -4 -14 A 4 4 0 0 1 4 -14');
          line(g, 8, 0, 20, 0);
        }
      },
      {
        id: 'thr-a', label: 'サーマルリレー 動作接点（THR-A）',
        bbox: { minX: -20, minY: -14, maxX: 20, maxY: 14 },
        draw(g) {
          line(g, -20, 0, -8, 0);
          line(g, -8, 0, 8, -12);
          // thermal mark
          path(g, 'M -12 4 L -8 -2 L -4 4 L 0 -2');
          line(g, 8, 0, 20, 0);
        }
      },
      {
        id: 'ls-a', label: 'リミットスイッチ a接点（LS-A）',
        bbox: { minX: -20, minY: -16, maxX: 20, maxY: 8 },
        draw(g) {
          line(g, -20, 0, -8, 0);
          line(g, -8, 0, 8, -12);
          line(g, -4, -16, 4, -8);
          line(g, 8, 0, 20, 0);
        }
      },
      {
        id: 'ls-b', label: 'リミットスイッチ b接点（LS-B）',
        bbox: { minX: -20, minY: -16, maxX: 20, maxY: 8 },
        draw(g) {
          line(g, -20, 0, -8, 0);
          line(g, -8, 0, 8, -12);
          line(g, 0, -12, 0, 2);
          line(g, -4, -16, 4, -8);
          line(g, 8, 0, 20, 0);
        }
      },
      {
        id: 'pl', label: 'パイロットランプ（PL）',
        bbox: { minX: -20, minY: -14, maxX: 20, maxY: 14 },
        draw(g) {
          line(g, -20, 0, -12, 0);
          circle(g, 0, 0, 12);
          line(g, -8, -8, 8, 8); line(g, 8, -8, -8, 8);
          line(g, 12, 0, 20, 0);
        }
      },
      {
        id: 'phos', label: '光電スイッチ（PHOS）',
        bbox: { minX: -20, minY: -14, maxX: 20, maxY: 14 },
        draw(g) {
          line(g, -20, 0, -12, 0);
          circle(g, 0, 0, 12);
          path(g, 'M -4 0 L 4 -6 L 4 6 Z');
          line(g, 12, 0, 20, 0);
        }
      },
    ]
  },

  // ===================== 表示・警報 =====================
  {
    id: 'signal', label: '表示・警報',
    items: [
      {
        id: 'b', label: 'ベル（B）',
        bbox: { minX: -20, minY: -18, maxX: 20, maxY: 18 },
        draw(g) {
          line(g, -20, 0, -14, 0);
          // bell shape
          path(g, 'M -14 -14 A 14 14 0 0 1 14 -14 L 14 10 L -14 10 Z');
          line(g, -10, 14, 10, 14);
          line(g, 0, 10, 0, 14);
        }
      },
      {
        id: 'bz', label: 'ブザー（BZ）',
        bbox: { minX: -20, minY: -14, maxX: 20, maxY: 14 },
        draw(g) {
          line(g, -20, 0, -12, 0);
          circle(g, 0, 0, 12);
          text(g, 0, 0, 'BZ', 9);
          line(g, 12, 0, 20, 0);
        }
      },
      {
        id: 'h', label: 'ホーン（H）',
        bbox: { minX: -22, minY: -14, maxX: 22, maxY: 14 },
        draw(g) {
          line(g, -22, 0, -14, 0);
          path(g, 'M -14 -8 L -14 8 L 8 14 L 8 -14 Z');
          path(g, 'M 8 -14 Q 22 0 8 14');
          line(g, 22, 0, 22, 0);
        }
      },
      {
        id: 'fan', label: '送風機・換気扇（FAN）',
        bbox: { minX: -20, minY: -20, maxX: 20, maxY: 20 },
        draw(g) {
          circle(g, 0, 0, 18);
          line(g, 0, -18, 0, 18); line(g, -18, 0, 18, 0);
          arc(g, 0, 0, 10, -90, 0, true);
          arc(g, 0, 0, 10, 90, 180, true);
        }
      },
      {
        id: 'fl', label: '蛍光灯（FL）',
        bbox: { minX: -24, minY: -8, maxX: 24, maxY: 8 },
        draw(g) {
          line(g, -24, 0, -16, 0);
          rect(g, -16, -8, 32, 16);
          line(g, -10, 0, 10, 0);
          line(g, 16, 0, 24, 0);
        }
      },
      {
        id: 'bl', label: '白熱灯（BL）',
        bbox: { minX: -20, minY: -14, maxX: 20, maxY: 14 },
        draw(g) {
          line(g, -20, 0, -12, 0);
          circle(g, 0, 0, 12);
          line(g, -8, -8, 8, 8); line(g, -8, 8, 8, -8);
          line(g, 12, 0, 20, 0);
        }
      },
      {
        id: 'eal', label: '非常警報装置（EAL）',
        bbox: { minX: -20, minY: -14, maxX: 20, maxY: 14 },
        draw(g) {
          line(g, -20, 0, -12, 0);
          circle(g, 0, 0, 12);
          text(g, 0, 0, '!', 14);
          line(g, 12, 0, 20, 0);
        }
      },
    ]
  },

  // ===================== その他 =====================
  {
    id: 'misc', label: 'その他',
    items: [
      {
        id: 'junction', label: '接続点（4方向）',
        bbox: { minX: -20, minY: -20, maxX: 20, maxY: 20 },
        draw(g) {
          line(g, -20, 0, 20, 0); line(g, 0, -20, 0, 20); circleFill(g, 0, 0, 4);
        }
      },
      {
        id: 'terminal', label: '端子',
        bbox: { minX: -10, minY: -10, maxX: 10, maxY: 10 },
        draw(g) { circle(g, 0, 0, 8); }
      },
      {
        // E-TB terminal block
        id: 'terminal-block', label: '端子台（TB）',
        bbox: { minX: -30, minY: -10, maxX: 30, maxY: 10 },
        draw(g) {
          line(g, -30, 0, -22, 0);
          circle(g, -14, 0, 8); circle(g, 0, 0, 8); circle(g, 14, 0, 8);
          line(g, 22, 0, 30, 0);
        }
      },
      {
        id: 'busbar', label: 'ブスバー（母線）',
        bbox: { minX: -40, minY: -4, maxX: 40, maxY: 4 },
        draw(g) {
          el(g, 'rect', { x: -40, y: -4, width: 80, height: 8, class: 'filled' });
        }
      },
      {
        id: 'cable-head', label: 'ケーブル終端',
        bbox: { minX: -20, minY: -16, maxX: 20, maxY: 16 },
        draw(g) {
          line(g, -20, 0, -10, 0);
          path(g, 'M -10 -16 L 10 0 L -10 16 Z');
          line(g, 10, -12, 10, 12);
        }
      },
      {
        id: 'distribution-board', label: '分電盤',
        bbox: { minX: -24, minY: -20, maxX: 24, maxY: 20 },
        draw(g) {
          rect(g, -24, -20, 48, 40);
          line(g, -16, -20, -16, 20);
          line(g, -16, -10, 24, -10);
          line(g, -16, 0, 24, 0);
          line(g, -16, 10, 24, 10);
        }
      },
      {
        id: 'fuka', label: '負荷（総称）',
        bbox: { minX: -20, minY: -14, maxX: 20, maxY: 14 },
        draw(g) {
          line(g, -20, 0, -12, 0);
          rect(g, -12, -14, 24, 28);
          line(g, 12, 0, 20, 0);
        }
      },
      {
        id: 'label-wire', label: '配線ラベル',
        bbox: { minX: -20, minY: -8, maxX: 20, maxY: 8 },
        draw(g) {
          line(g, -20, 0, 20, 0);
          path(g, 'M -10 -6 L 10 -6 L 16 0 L 10 6 L -10 6 Z');
        }
      },
    ]
  },
];

// 接続点を四方向（上下左右）で返す
export function getConnectionPoints(symbolDef, cx, cy, rotation = 0) {
  const { minX, minY, maxX, maxY } = symbolDef.bbox;
  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;
  const locals = [
    { dir: 'left',   x: minX, y: midY },
    { dir: 'right',  x: maxX, y: midY },
    { dir: 'top',    x: midX, y: minY },
    { dir: 'bottom', x: midX, y: maxY },
  ];
  const rad = (rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return locals.map(p => ({
    dir: p.dir,
    x: cx + p.x * cos - p.y * sin,
    y: cy + p.x * sin + p.y * cos,
  }));
}

export function renderSymbol(symbolId) {
  for (const group of SYMBOL_GROUPS) {
    const item = group.items.find(i => i.id === symbolId);
    if (!item) continue;
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'component-symbol');
    item.draw(g);
    return g;
  }
  return null;
}

export function getSymbolDef(symbolId) {
  for (const group of SYMBOL_GROUPS) {
    const item = group.items.find(i => i.id === symbolId);
    if (item) return item;
  }
  return null;
}
