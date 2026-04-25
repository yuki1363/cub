// JIS C 0617 準拠 単線図用電気図記号定義
// シンボルIDはJIS C 0617 PDFコードに準拠

export const SYMBOL_GROUPS = [
  {
    id: 'power',
    label: '電源・電路',
    items: [
      {
        id: 'ac-source', label: '交流電源',
        bbox: { minX: -30, minY: -20, maxX: 30, maxY: 20 },
        draw(g) {
          circle(g, 0, 0, 20); wavePath(g, -10, 0, 10);
          line(g, -30, 0, -20, 0); line(g, 20, 0, 30, 0);
        }
      },
      {
        id: 'dc-source', label: '直流電源',
        bbox: { minX: -30, minY: -10, maxX: 30, maxY: 10 },
        draw(g) {
          line(g, -30, 0, -14, 0);
          line(g, -14, -8, -14, 8); line(g, -5, -4, -5, 4);
          line(g, 5, -8, 5, 8);    line(g, 14, -4, 14, 4);
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
        id: 'ground', label: '接地（E）',
        bbox: { minX: -16, minY: -20, maxX: 16, maxY: 14 },
        draw(g) {
          line(g, 0, -20, 0, 0); line(g, -16, 0, 16, 0);
          line(g, -10, 6, 10, 6); line(g, -5, 12, 5, 12);
        }
      },
      {
        id: 'neutral', label: '中性線',
        bbox: { minX: -14, minY: -20, maxX: 14, maxY: 8 },
        draw(g) {
          line(g, 0, -20, 0, 0); line(g, -14, 0, 14, 0); line(g, -14, 6, 14, 6);
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
  {
    id: 'high-voltage',
    label: '高圧機器',
    items: [
      {
        id: 'pas', label: '高圧気中開閉器（PAS）',
        bbox: { minX: -32, minY: -22, maxX: 32, maxY: 6 },
        draw(g) {
          line(g, -32, 0, -14, 0);
          circleFill(g, -14, 0, 3); circleFill(g, 14, 0, 3);
          line(g, -14, 0, 16, -18); line(g, 14, 0, 32, 0);
          arc(g, 0, -10, 8, 200, 340, true);
          path(g, 'M 7 -3 L 8 -10 L 3 -5 Z');
        }
      },
      {
        id: 'lbs', label: '負荷開閉器（LBS）',
        bbox: { minX: -32, minY: -18, maxX: 32, maxY: 6 },
        draw(g) {
          line(g, -32, 0, -14, 0);
          circleFill(g, -14, 0, 3); circleFill(g, 14, 0, 3);
          line(g, -14, 0, 16, -16); line(g, 14, 0, 32, 0);
          line(g, 3, -12, 10, -5);
        }
      },
      {
        id: 'lbs-pf', label: 'PF付負荷開閉器（LBS-PF）',
        bbox: { minX: -32, minY: -20, maxX: 32, maxY: 6 },
        draw(g) {
          line(g, -32, 0, -20, 0);
          rect(g, -20, -8, 10, 16); line(g, -10, 0, -4, 0);
          circleFill(g, -4, 0, 3); circleFill(g, 14, 0, 3);
          line(g, -4, 0, 16, -16); line(g, 14, 0, 32, 0);
        }
      },
      {
        id: 'pc', label: '高圧カットアウト（PC）',
        bbox: { minX: -30, minY: -18, maxX: 30, maxY: 6 },
        draw(g) {
          line(g, -30, 0, -14, 0);
          circleFill(g, -14, 0, 3); circleFill(g, 14, 0, 3);
          line(g, -14, 0, 16, -16); line(g, 14, 0, 30, 0);
          // ヒューズ筒マーク
          rect(g, -4, -12, 8, 8);
        }
      },
      {
        id: 'pc-pf', label: 'PF付カットアウト（PC-PF）',
        bbox: { minX: -30, minY: -18, maxX: 30, maxY: 6 },
        draw(g) {
          line(g, -30, 0, -14, 0);
          circleFill(g, -14, 0, 3); circleFill(g, 14, 0, 3);
          line(g, -14, 0, 16, -16); line(g, 14, 0, 30, 0);
          rect(g, -5, -13, 10, 10); line(g, -5, -13, 5, -3);
        }
      },
      {
        id: 'ds-1p', label: '断路器 1極（DS-1P）',
        bbox: { minX: -30, minY: -16, maxX: 30, maxY: 6 },
        draw(g) {
          line(g, -30, 0, -12, 0);
          circleFill(g, -12, 0, 3); circleFill(g, 12, 0, 3);
          line(g, -12, 0, 14, -14); line(g, 12, 0, 30, 0);
        }
      },
      {
        id: 'ds-il', label: '断路器 インターロック付（DS-IL）',
        bbox: { minX: -30, minY: -16, maxX: 30, maxY: 6 },
        draw(g) {
          line(g, -30, 0, -12, 0);
          circleFill(g, -12, 0, 3); circleFill(g, 12, 0, 3);
          line(g, -12, 0, 14, -14); line(g, 12, 0, 30, 0);
          line(g, 2, -10, 8, -4); line(g, 8, -10, 2, -4);
        }
      },
      {
        id: 'ds-rmo', label: '断路器 遠隔操作（DS-RMO）',
        bbox: { minX: -30, minY: -18, maxX: 30, maxY: 6 },
        draw(g) {
          line(g, -30, 0, -12, 0);
          circleFill(g, -12, 0, 3); circleFill(g, 12, 0, 3);
          line(g, -12, 0, 14, -14); line(g, 12, 0, 30, 0);
          // 遠隔操作マーク（矢印）
          line(g, 0, -8, 0, -16); path(g, 'M -4 -13 L 0 -17 L 4 -13');
        }
      },
      {
        id: 'vcb', label: '真空遮断器（VCB）',
        bbox: { minX: -30, minY: -14, maxX: 30, maxY: 14 },
        draw(g) {
          line(g, -30, 0, -18, 0); rect(g, -18, -12, 36, 24);
          circleFill(g, -8, 0, 3); circleFill(g, 8, 0, 3);
          line(g, -8, 0, 10, -10);
          line(g, 6, -8, 12, -8); line(g, 12, -8, 12, 8);
          text(g, 0, 10, 'VCB', 7); line(g, 18, 0, 30, 0);
        }
      },
      {
        id: 'vcb-aut', label: '自動VCB（VCB-AUT）',
        bbox: { minX: -30, minY: -16, maxX: 30, maxY: 16 },
        draw(g) {
          line(g, -30, 0, -18, 0); rect(g, -18, -14, 36, 28);
          circleFill(g, -8, 0, 3); circleFill(g, 8, 0, 3);
          line(g, -8, 0, 10, -10);
          line(g, 6, -8, 12, -8); line(g, 12, -8, 12, 5);
          text(g, 0, 10, 'AUT', 7); line(g, 18, 0, 30, 0);
        }
      },
      {
        id: 'la-1p', label: '避雷器 1極（LA-1P）',
        bbox: { minX: -20, minY: -22, maxX: 20, maxY: 22 },
        draw(g) {
          line(g, 0, -22, 0, -10);
          line(g, -8, -10, 0, -2); line(g, 8, -10, 0, -2);
          line(g, 0, -2, 0, 6);
          line(g, -12, 6, 12, 6); line(g, -8, 12, 8, 12); line(g, -4, 18, 4, 18);
        }
      },
      {
        id: 'vcmc', label: '真空電磁接触器（VCMC）',
        bbox: { minX: -30, minY: -16, maxX: 30, maxY: 16 },
        draw(g) {
          line(g, -30, 0, -18, 0); rect(g, -18, -14, 36, 28);
          circleFill(g, -8, 0, 3); circleFill(g, 8, 0, 3);
          line(g, -8, 0, 10, -10);
          text(g, 0, 10, 'VCMC', 7); line(g, 18, 0, 30, 0);
        }
      },
    ]
  },
  {
    id: 'breaker',
    label: '低圧遮断器',
    items: [
      {
        id: 'mccb', label: '配線用遮断器（MCCB）',
        bbox: { minX: -30, minY: -14, maxX: 30, maxY: 14 },
        draw(g) {
          line(g, -30, 0, -18, 0); rect(g, -18, -12, 36, 24);
          circleFill(g, -8, 0, 3); circleFill(g, 8, 0, 3);
          line(g, -8, 0, 10, -10);
          line(g, 6, -8, 12, -8); line(g, 12, -8, 12, 8);
          line(g, 18, 0, 30, 0);
        }
      },
      {
        id: 'mccb-2p', label: 'MCCB 2極',
        bbox: { minX: -30, minY: -18, maxX: 30, maxY: 18 },
        draw(g) {
          line(g, -30, 0, -18, 0); rect(g, -18, -16, 36, 32);
          // 上極
          circleFill(g, -8, -6, 3); circleFill(g, 8, -6, 3);
          line(g, -8, -6, 10, -16);
          // 下極
          circleFill(g, -8, 6, 3); circleFill(g, 8, 6, 3);
          line(g, -8, 6, 10, -4);
          line(g, 18, 0, 30, 0);
        }
      },
      {
        id: 'mccb-3p', label: 'MCCB 3極',
        bbox: { minX: -30, minY: -20, maxX: 30, maxY: 20 },
        draw(g) {
          line(g, -30, 0, -18, 0); rect(g, -18, -18, 36, 36);
          text(g, 0, 14, '3P', 8);
          circleFill(g, -8, 0, 3); circleFill(g, 8, 0, 3);
          line(g, -8, 0, 10, -10);
          line(g, 6, -8, 12, -8); line(g, 12, -8, 12, 8);
          line(g, 18, 0, 30, 0);
        }
      },
      {
        id: 'elcb', label: '漏電遮断器（ELCB）',
        bbox: { minX: -30, minY: -16, maxX: 30, maxY: 16 },
        draw(g) {
          line(g, -30, 0, -18, 0); rect(g, -18, -14, 36, 28);
          circleFill(g, -8, -3, 3); circleFill(g, 8, -3, 3);
          line(g, -8, -3, 10, -13);
          line(g, 6, -11, 12, -11); line(g, 12, -11, 12, 5);
          text(g, 0, 9, 'E', 9); line(g, 18, 0, 30, 0);
        }
      },
      {
        id: 'elcb-2p', label: 'ELCB 2極',
        bbox: { minX: -30, minY: -16, maxX: 30, maxY: 16 },
        draw(g) {
          line(g, -30, 0, -18, 0); rect(g, -18, -14, 36, 28);
          circleFill(g, -8, -3, 3); circleFill(g, 8, -3, 3);
          line(g, -8, -3, 10, -13);
          line(g, 6, -11, 12, -11); line(g, 12, -11, 12, 5);
          text(g, 0, 9, '2E', 9); line(g, 18, 0, 30, 0);
        }
      },
      {
        id: 'elcb-3p', label: 'ELCB 3極',
        bbox: { minX: -30, minY: -18, maxX: 30, maxY: 18 },
        draw(g) {
          line(g, -30, 0, -18, 0); rect(g, -18, -16, 36, 32);
          circleFill(g, -8, -3, 3); circleFill(g, 8, -3, 3);
          line(g, -8, -3, 10, -13);
          line(g, 6, -11, 12, -11); line(g, 12, -11, 12, 5);
          text(g, 0, 11, '3E', 9); line(g, 18, 0, 30, 0);
        }
      },
      {
        id: 'fuse', label: 'ヒューズ（F）',
        bbox: { minX: -28, minY: -9, maxX: 28, maxY: 9 },
        draw(g) {
          line(g, -28, 0, -14, 0); rect(g, -14, -7, 28, 14); line(g, 14, 0, 28, 0);
        }
      },
      {
        id: 'fbu', label: 'ヒューズユニット（FBU）',
        bbox: { minX: -28, minY: -12, maxX: 28, maxY: 12 },
        draw(g) {
          line(g, -28, 0, -14, 0); rect(g, -14, -10, 28, 20);
          line(g, -10, -6, 10, 6); line(g, -10, 6, 10, -6);
          line(g, 14, 0, 28, 0);
        }
      },
      {
        id: 'fds-1p', label: '断路ヒューズ 1極（FDS-1P）',
        bbox: { minX: -30, minY: -16, maxX: 30, maxY: 6 },
        draw(g) {
          line(g, -30, 0, -14, 0); rect(g, -14, -7, 14, 14);
          line(g, 0, 0, 8, 0);
          circleFill(g, 8, 0, 3); circleFill(g, 20, 0, 3);
          line(g, 8, 0, 22, -14); line(g, 20, 0, 30, 0);
        }
      },
      {
        id: 'fds-pf', label: '電力ヒューズ断路器（FDS-PF）',
        bbox: { minX: -30, minY: -16, maxX: 30, maxY: 6 },
        draw(g) {
          line(g, -30, 0, -14, 0); rect(g, -14, -7, 14, 14);
          line(g, -14, -7, 0, 7); // 斜線（PF マーク）
          line(g, 0, 0, 8, 0);
          circleFill(g, 8, 0, 3); circleFill(g, 20, 0, 3);
          line(g, 8, 0, 22, -14); line(g, 20, 0, 30, 0);
        }
      },
      {
        id: 'acb', label: '気中遮断器（ACB）',
        bbox: { minX: -30, minY: -14, maxX: 30, maxY: 14 },
        draw(g) {
          line(g, -30, 0, -18, 0); rect(g, -18, -12, 36, 24);
          circleFill(g, -8, 0, 3); circleFill(g, 8, 0, 3);
          line(g, -8, 0, 10, -10);
          line(g, 6, -8, 12, -8); line(g, 12, -8, 12, 8);
          text(g, 0, 10, 'ACB', 7); line(g, 18, 0, 30, 0);
        }
      },
      {
        id: 'elr', label: '漏電リレー（ELR）',
        bbox: { minX: -30, minY: -14, maxX: 30, maxY: 14 },
        draw(g) {
          line(g, -30, 0, -18, 0); rect(g, -18, -12, 36, 24);
          text(g, 0, 4, 'ELR', 10); line(g, 18, 0, 30, 0);
        }
      },
    ]
  },
  {
    id: 'relay',
    label: '保護継電器',
    items: [
      {
        id: 'ocr', label: '過電流継電器（OCR）',
        bbox: { minX: -25, minY: -14, maxX: 25, maxY: 14 },
        draw(g) {
          line(g, -25, 0, -14, 0); circle(g, 0, 0, 14);
          text(g, 0, -2, 'OCR', 7); line(g, 14, 0, 25, 0);
        }
      },
      {
        id: 'ocr-do', label: 'OCR 直動型（OCR-DO）',
        bbox: { minX: -25, minY: -14, maxX: 25, maxY: 14 },
        draw(g) {
          line(g, -25, 0, -14, 0); circle(g, 0, 0, 14);
          text(g, 0, -4, 'OCR', 6); text(g, 0, 6, 'DO', 6); line(g, 14, 0, 25, 0);
        }
      },
      {
        id: 'ocgr', label: '過電流地絡継電器（OCGR）',
        bbox: { minX: -25, minY: -14, maxX: 25, maxY: 14 },
        draw(g) {
          line(g, -25, 0, -14, 0); circle(g, 0, 0, 14);
          text(g, 0, -2, 'OCGR', 6); line(g, 14, 0, 25, 0);
        }
      },
      {
        id: 'dgr', label: '地絡方向継電器（DGR）',
        bbox: { minX: -25, minY: -14, maxX: 25, maxY: 14 },
        draw(g) {
          line(g, -25, 0, -14, 0); circle(g, 0, 0, 14);
          text(g, 0, -2, 'DGR', 7); line(g, 14, 0, 25, 0);
        }
      },
      {
        id: 'dgr-do', label: 'DGR 直動型（DGR-DO）',
        bbox: { minX: -25, minY: -14, maxX: 25, maxY: 14 },
        draw(g) {
          line(g, -25, 0, -14, 0); circle(g, 0, 0, 14);
          text(g, 0, -4, 'DGR', 6); text(g, 0, 6, 'DO', 6); line(g, 14, 0, 25, 0);
        }
      },
      {
        id: 'ovr', label: '過電圧継電器（OVR）',
        bbox: { minX: -25, minY: -14, maxX: 25, maxY: 14 },
        draw(g) {
          line(g, -25, 0, -14, 0); circle(g, 0, 0, 14);
          text(g, 0, -2, 'OVR', 7); line(g, 14, 0, 25, 0);
        }
      },
      {
        id: 'ovgr', label: '過電圧地絡継電器（OVGR）',
        bbox: { minX: -25, minY: -14, maxX: 25, maxY: 14 },
        draw(g) {
          line(g, -25, 0, -14, 0); circle(g, 0, 0, 14);
          text(g, 0, -2, 'OVGR', 6); line(g, 14, 0, 25, 0);
        }
      },
      {
        id: 'uvr', label: '不足電圧継電器（UVR）',
        bbox: { minX: -25, minY: -14, maxX: 25, maxY: 14 },
        draw(g) {
          line(g, -25, 0, -14, 0); circle(g, 0, 0, 14);
          text(g, 0, -2, 'UVR', 7); line(g, 14, 0, 25, 0);
        }
      },
      {
        id: 'nvr', label: '不足電圧継電器（NVR）',
        bbox: { minX: -25, minY: -14, maxX: 25, maxY: 14 },
        draw(g) {
          line(g, -25, 0, -14, 0); circle(g, 0, 0, 14);
          text(g, 0, -2, 'NVR', 7); line(g, 14, 0, 25, 0);
        }
      },
      {
        id: 'rpr', label: '逆電力継電器（RPR）',
        bbox: { minX: -25, minY: -14, maxX: 25, maxY: 14 },
        draw(g) {
          line(g, -25, 0, -14, 0); circle(g, 0, 0, 14);
          text(g, 0, -2, 'RPR', 7); line(g, 14, 0, 25, 0);
        }
      },
      {
        id: 'ufr', label: '不足周波数継電器（UFR）',
        bbox: { minX: -25, minY: -14, maxX: 25, maxY: 14 },
        draw(g) {
          line(g, -25, 0, -14, 0); circle(g, 0, 0, 14);
          text(g, 0, -2, 'UFR', 7); line(g, 14, 0, 25, 0);
        }
      },
      {
        id: 'ofr', label: '過周波数継電器（OFR）',
        bbox: { minX: -25, minY: -14, maxX: 25, maxY: 14 },
        draw(g) {
          line(g, -25, 0, -14, 0); circle(g, 0, 0, 14);
          text(g, 0, -2, 'OFR', 7); line(g, 14, 0, 25, 0);
        }
      },
      {
        id: 'thr', label: 'サーマルリレー（THR）',
        bbox: { minX: -28, minY: -12, maxX: 28, maxY: 12 },
        draw(g) {
          line(g, -28, 0, -16, 0); rect(g, -16, -10, 32, 20);
          for (let i = -10; i <= 4; i += 7) arc(g, i, 0, 3.5, 180, 0, false);
          line(g, 16, 0, 28, 0);
        }
      },
      {
        id: 'zct', label: '零相変流器（ZCT）',
        bbox: { minX: -25, minY: -16, maxX: 25, maxY: 16 },
        draw(g) {
          circle(g, 0, 0, 14); line(g, -25, 0, 25, 0); text(g, 0, -3, 'ZCT', 7);
        }
      },
      {
        id: 'zvt', label: '零相変圧器（ZVT）',
        bbox: { minX: -25, minY: -16, maxX: 25, maxY: 16 },
        draw(g) {
          circle(g, 0, 0, 14); line(g, -25, 0, -14, 0); line(g, 14, 0, 25, 0);
          text(g, 0, -3, 'ZVT', 7);
        }
      },
      {
        id: 'evt', label: '零相変圧器（EVT）',
        bbox: { minX: -25, minY: -16, maxX: 25, maxY: 16 },
        draw(g) {
          circle(g, 0, 0, 14); line(g, -25, 0, -14, 0); line(g, 14, 0, 25, 0);
          text(g, 0, -3, 'EVT', 7);
        }
      },
      {
        id: 'la', label: '避雷器（LA）',
        bbox: { minX: -20, minY: -22, maxX: 20, maxY: 22 },
        draw(g) {
          line(g, 0, -22, 0, -10);
          line(g, -8, -10, 0, -2); line(g, 8, -10, 0, -2);
          line(g, 0, -2, 0, 6);
          line(g, -12, 6, 12, 6); line(g, -8, 12, 8, 12); line(g, -4, 18, 4, 18);
        }
      },
    ]
  },
  {
    id: 'transformer',
    label: '変圧器・変流器',
    items: [
      {
        id: 't-1p', label: '単相変圧器（T-1P）',
        bbox: { minX: -35, minY: -16, maxX: 35, maxY: 16 },
        draw(g) {
          circle(g, -10, 0, 14); circle(g, 10, 0, 14);
          line(g, -35, -8, -24, -8); line(g, -35, 8, -24, 8);
          line(g, 24, -8, 35, -8); line(g, 24, 8, 35, 8);
        }
      },
      {
        id: 't-3p', label: '三相変圧器（T-3P）',
        bbox: { minX: -35, minY: -20, maxX: 35, maxY: 20 },
        draw(g) {
          circle(g, -10, 0, 16); circle(g, 10, 0, 16);
          text(g, -10, 0, 'Y', 10); text(g, 10, 0, 'Δ', 10);
          line(g, -35, 0, -26, 0); line(g, 26, 0, 35, 0);
        }
      },
      {
        id: 'ct-h', label: '変流器 高圧（CT-H）',
        bbox: { minX: -25, minY: -22, maxX: 25, maxY: 16 },
        draw(g) {
          circle(g, 0, 0, 14); line(g, -25, 0, 25, 0);
          line(g, -6, -14, -6, -22); line(g, 6, -14, 6, -22);
          text(g, 0, 8, 'H', 8);
        }
      },
      {
        id: 'ct-l', label: '変流器 低圧（CT-L）',
        bbox: { minX: -25, minY: -22, maxX: 25, maxY: 16 },
        draw(g) {
          circle(g, 0, 0, 14); line(g, -25, 0, 25, 0);
          line(g, -6, -14, -6, -22); line(g, 6, -14, 6, -22);
          text(g, 0, 8, 'L', 8);
        }
      },
      {
        id: 'vt-h', label: '計器用変圧器 高圧（VT-H）',
        bbox: { minX: -30, minY: -16, maxX: 30, maxY: 16 },
        draw(g) {
          circle(g, -8, 0, 12); circle(g, 8, 0, 12);
          line(g, -30, 0, -20, 0); line(g, 20, 0, 30, 0);
          text(g, 0, 0, 'VTH', 7);
        }
      },
      {
        id: 'vt-l', label: '計器用変圧器 低圧（VT-L）',
        bbox: { minX: -30, minY: -16, maxX: 30, maxY: 16 },
        draw(g) {
          circle(g, -8, 0, 12); circle(g, 8, 0, 12);
          line(g, -30, 0, -20, 0); line(g, 20, 0, 30, 0);
          text(g, 0, 0, 'VTL', 7);
        }
      },
      {
        id: 'srx-h', label: '直列リアクトル 高圧（SRX-H）',
        bbox: { minX: -30, minY: -12, maxX: 30, maxY: 12 },
        draw(g) {
          line(g, -30, 0, -18, 0);
          arc(g, -12, 0, 6, 180, 0, false); arc(g, 0, 0, 6, 180, 0, false); arc(g, 12, 0, 6, 180, 0, false);
          line(g, 18, 0, 30, 0); text(g, 0, 10, 'SRX', 7);
        }
      },
      {
        id: 'srx-l', label: '直列リアクトル 低圧（SRX-L）',
        bbox: { minX: -30, minY: -10, maxX: 30, maxY: 10 },
        draw(g) {
          line(g, -30, 0, -18, 0);
          arc(g, -12, 0, 6, 180, 0, false); arc(g, 0, 0, 6, 180, 0, false); arc(g, 12, 0, 6, 180, 0, false);
          line(g, 18, 0, 30, 0);
        }
      },
      {
        id: 'cc', label: 'コンデンサ（CC）',
        bbox: { minX: -22, minY: -14, maxX: 22, maxY: 14 },
        draw(g) {
          line(g, -22, 0, -4, 0); line(g, -4, -13, -4, 13); line(g, 4, -13, 4, 13); line(g, 4, 0, 22, 0);
        }
      },
      {
        id: 'apfc', label: '自動力率調整（APFC）',
        bbox: { minX: -28, minY: -14, maxX: 28, maxY: 14 },
        draw(g) {
          line(g, -28, 0, -16, 0); rect(g, -16, -12, 32, 24);
          text(g, 0, 3, 'APFC', 7); line(g, 16, 0, 28, 0);
        }
      },
      {
        id: 'sc-h', label: '開閉コンデンサ 高圧（SC-H）',
        bbox: { minX: -28, minY: -14, maxX: 28, maxY: 14 },
        draw(g) {
          line(g, -28, 0, -16, 0); rect(g, -16, -12, 32, 24);
          text(g, 0, 3, 'SC-H', 8); line(g, 16, 0, 28, 0);
        }
      },
      {
        id: 'sc-l', label: '開閉コンデンサ 低圧（SC-L）',
        bbox: { minX: -28, minY: -14, maxX: 28, maxY: 14 },
        draw(g) {
          line(g, -28, 0, -16, 0); rect(g, -16, -12, 32, 24);
          text(g, 0, 3, 'SC-L', 8); line(g, 16, 0, 28, 0);
        }
      },
    ]
  },
  {
    id: 'contactor',
    label: '開閉器・接触器',
    items: [
      {
        id: 'mc', label: '電磁接触器（MC）',
        bbox: { minX: -30, minY: -18, maxX: 30, maxY: 22 },
        draw(g) {
          line(g, -30, 0, -18, 0);
          circleFill(g, -8, 0, 3); circleFill(g, 8, 0, 3);
          line(g, -8, 0, 10, -10); line(g, 8, 0, 18, 0); line(g, 18, 0, 30, 0);
          rect(g, -8, 8, 16, 10); line(g, 0, 18, 0, 22);
        }
      },
      {
        id: 'mc-dt', label: '電磁接触器 タイムドライ（MC-DT）',
        bbox: { minX: -30, minY: -18, maxX: 30, maxY: 22 },
        draw(g) {
          line(g, -30, 0, -18, 0);
          circleFill(g, -8, 0, 3); circleFill(g, 8, 0, 3);
          line(g, -8, 0, 10, -10); line(g, 8, 0, 18, 0); line(g, 18, 0, 30, 0);
          rect(g, -8, 8, 16, 10);
          // タイムドライマーク
          line(g, -4, 8, -4, 18); line(g, 4, 8, 4, 18);
          line(g, 0, 18, 0, 22);
        }
      },
      {
        id: 'ms', label: '電磁開閉器（MS）',
        bbox: { minX: -30, minY: -18, maxX: 30, maxY: 18 },
        draw(g) {
          line(g, -30, 0, -18, 0); rect(g, -18, -14, 36, 28);
          circleFill(g, -6, -3, 3); circleFill(g, 6, -3, 3);
          line(g, -6, -3, 8, -11);
          for (let i = -8; i <= 2; i += 5) arc(g, i, 5, 2.5, 180, 0, false);
          line(g, 18, 0, 30, 0);
        }
      },
      {
        id: 'ks', label: '切換スイッチ（KS）',
        bbox: { minX: -30, minY: -18, maxX: 30, maxY: 18 },
        draw(g) {
          line(g, -30, 0, -18, 0); rect(g, -18, -16, 36, 32);
          // 2接点選択
          circleFill(g, -8, -6, 3); circleFill(g, 8, -6, 3);
          line(g, -8, -6, 10, -14);
          circleFill(g, -8, 6, 3); circleFill(g, 8, 6, 3);
          line(g, -8, 6, 10, -2);
          line(g, 18, 0, 30, 0);
        }
      },
      {
        id: 'inv', label: 'インバータ（INV）',
        bbox: { minX: -28, minY: -14, maxX: 28, maxY: 14 },
        draw(g) {
          line(g, -28, 0, -16, 0); rect(g, -16, -12, 32, 24);
          text(g, 0, 3, 'INV', 9); line(g, 16, 0, 28, 0);
        }
      },
      {
        id: 'inv-dcr', label: 'INV DCリアクトル付（INV-DCR）',
        bbox: { minX: -28, minY: -14, maxX: 28, maxY: 14 },
        draw(g) {
          line(g, -28, 0, -16, 0); rect(g, -16, -12, 32, 24);
          text(g, 0, -3, 'INV', 8); text(g, 0, 7, 'DCR', 7); line(g, 16, 0, 28, 0);
        }
      },
    ]
  },
  {
    id: 'motor',
    label: '電動機・発電機',
    items: [
      {
        id: 'im', label: '誘導電動機（IM）',
        bbox: { minX: -25, minY: -16, maxX: 25, maxY: 16 },
        draw(g) {
          line(g, -25, 0, -16, 0); circle(g, 0, 0, 16);
          text(g, 0, 4, 'IM', 13); line(g, 16, 0, 25, 0);
        }
      },
      {
        id: 'motor-3p', label: '三相誘導電動機（3M）',
        bbox: { minX: -25, minY: -16, maxX: 25, maxY: 16 },
        draw(g) {
          line(g, -25, 0, -16, 0); circle(g, 0, 0, 16);
          text(g, 0, 3, '3M', 11); line(g, 16, 0, 25, 0);
        }
      },
      {
        id: 'motor-1p', label: '単相電動機（1M）',
        bbox: { minX: -25, minY: -16, maxX: 25, maxY: 16 },
        draw(g) {
          line(g, -25, 0, -16, 0); circle(g, 0, 0, 16);
          text(g, 0, 3, '1M', 11); line(g, 16, 0, 25, 0);
        }
      },
      {
        id: 'generator', label: '発電機（G）',
        bbox: { minX: -25, minY: -16, maxX: 25, maxY: 16 },
        draw(g) {
          line(g, -25, 0, -16, 0); circle(g, 0, 0, 16);
          text(g, 0, 5, 'G', 14); line(g, 16, 0, 25, 0);
        }
      },
    ]
  },
  {
    id: 'meter',
    label: '計測器',
    items: [
      {
        id: 'am', label: '電流計（AM）',
        bbox: { minX: -25, minY: -14, maxX: 25, maxY: 14 },
        draw(g) { line(g,-25,0,-14,0); circle(g,0,0,14); text(g,0,4,'A',12); line(g,14,0,25,0); }
      },
      {
        id: 'vm', label: '電圧計（VM）',
        bbox: { minX: -25, minY: -14, maxX: 25, maxY: 14 },
        draw(g) { line(g,-25,0,-14,0); circle(g,0,0,14); text(g,0,4,'V',12); line(g,14,0,25,0); }
      },
      {
        id: 'wm', label: '電力計（WM）',
        bbox: { minX: -25, minY: -14, maxX: 25, maxY: 14 },
        draw(g) { line(g,-25,0,-14,0); circle(g,0,0,14); text(g,0,4,'W',11); line(g,14,0,25,0); }
      },
      {
        id: 'whm', label: '電力量計（WHM）',
        bbox: { minX: -25, minY: -14, maxX: 25, maxY: 14 },
        draw(g) { line(g,-25,0,-14,0); circle(g,0,0,14); text(g,0,4,'Wh',9); line(g,14,0,25,0); }
      },
      {
        id: 'fm', label: '周波数計（FM）',
        bbox: { minX: -25, minY: -14, maxX: 25, maxY: 14 },
        draw(g) { line(g,-25,0,-14,0); circle(g,0,0,14); text(g,0,4,'Hz',9); line(g,14,0,25,0); }
      },
      {
        id: 'pfm', label: '力率計（PFM）',
        bbox: { minX: -25, minY: -14, maxX: 25, maxY: 14 },
        draw(g) { line(g,-25,0,-14,0); circle(g,0,0,14); text(g,0,4,'PF',9); line(g,14,0,25,0); }
      },
      {
        id: 'varm', label: '無効電力計（VARM）',
        bbox: { minX: -25, minY: -14, maxX: 25, maxY: 14 },
        draw(g) { line(g,-25,0,-14,0); circle(g,0,0,14); text(g,0,4,'var',9); line(g,14,0,25,0); }
      },
      {
        id: 'mdam', label: '最大需要電力計（MDAM）',
        bbox: { minX: -25, minY: -14, maxX: 25, maxY: 14 },
        draw(g) { line(g,-25,0,-14,0); circle(g,0,0,14); text(g,0,-2,'MD',9); text(g,0,8,'AM',8); line(g,14,0,25,0); }
      },
      {
        id: 'ham', label: '高調波計（HAM）',
        bbox: { minX: -25, minY: -14, maxX: 25, maxY: 14 },
        draw(g) { line(g,-25,0,-14,0); circle(g,0,0,14); text(g,0,4,'HAM',7); line(g,14,0,25,0); }
      },
      {
        id: 'mam', label: '最大電流計（MAM）',
        bbox: { minX: -25, minY: -14, maxX: 25, maxY: 14 },
        draw(g) { line(g,-25,0,-14,0); circle(g,0,0,14); text(g,0,4,'MA',9); line(g,14,0,25,0); }
      },
      {
        id: 'mwm', label: '最大電力計（MWM）',
        bbox: { minX: -25, minY: -14, maxX: 25, maxY: 14 },
        draw(g) { line(g,-25,0,-14,0); circle(g,0,0,14); text(g,0,4,'MW',9); line(g,14,0,25,0); }
      },
      {
        id: 'v0m', label: '零相電圧計（V0M）',
        bbox: { minX: -25, minY: -14, maxX: 25, maxY: 14 },
        draw(g) { line(g,-25,0,-14,0); circle(g,0,0,14); text(g,0,4,'V0',10); line(g,14,0,25,0); }
      },
      {
        id: 'td-a', label: 'デジタル電流計（TD-A）',
        bbox: { minX: -26, minY: -14, maxX: 26, maxY: 14 },
        draw(g) {
          line(g,-26,0,-14,0); rect(g,-14,-12,28,24);
          text(g,0,-4,'TD',8); text(g,0,6,'A',10); line(g,14,0,26,0);
        }
      },
      {
        id: 'td-v', label: 'デジタル電圧計（TD-V）',
        bbox: { minX: -26, minY: -14, maxX: 26, maxY: 14 },
        draw(g) {
          line(g,-26,0,-14,0); rect(g,-14,-12,28,24);
          text(g,0,-4,'TD',8); text(g,0,6,'V',10); line(g,14,0,26,0);
        }
      },
      {
        id: 'td-w', label: 'デジタル電力計（TD-W）',
        bbox: { minX: -26, minY: -14, maxX: 26, maxY: 14 },
        draw(g) {
          line(g,-26,0,-14,0); rect(g,-14,-12,28,24);
          text(g,0,-4,'TD',8); text(g,0,6,'W',10); line(g,14,0,26,0);
        }
      },
      {
        id: 'td-pf', label: 'デジタル力率計（TD-PF）',
        bbox: { minX: -26, minY: -14, maxX: 26, maxY: 14 },
        draw(g) {
          line(g,-26,0,-14,0); rect(g,-14,-12,28,24);
          text(g,0,-4,'TD',8); text(g,0,6,'PF',8); line(g,14,0,26,0);
        }
      },
    ]
  },
  {
    id: 'control',
    label: '制御・接点（制御回路）',
    items: [
      {
        id: 'ry-a', label: 'リレー a接点（RY-A）',
        bbox: { minX: -25, minY: -16, maxX: 25, maxY: 6 },
        draw(g) {
          line(g,-25,0,-10,0); circleFill(g,-10,0,3); circleFill(g,10,0,3);
          line(g,-10,0,12,-14); line(g,10,0,25,0);
        }
      },
      {
        id: 'ry-b', label: 'リレー b接点（RY-B）',
        bbox: { minX: -25, minY: -16, maxX: 25, maxY: 6 },
        draw(g) {
          line(g,-25,0,-10,0); circleFill(g,-10,0,3); circleFill(g,10,0,3);
          line(g,-10,0,12,-14); line(g,2,-10,14,0); line(g,10,0,25,0);
        }
      },
      {
        id: 'ry-c', label: 'リレー c接点（切換）（RY-C）',
        bbox: { minX: -25, minY: -16, maxX: 25, maxY: 16 },
        draw(g) {
          line(g,-25,0,-10,0); circleFill(g,-10,0,3);
          circleFill(g,10,-12,3); circleFill(g,10,12,3);
          line(g,-10,0,12,-12);
          line(g,10,-12,25,-12); line(g,10,12,25,12);
        }
      },
      {
        id: 'r', label: 'リレーコイル（R）',
        bbox: { minX: -22, minY: -12, maxX: 22, maxY: 12 },
        draw(g) {
          line(g,-22,0,-12,0); rect(g,-12,-10,24,20); line(g,12,0,22,0);
        }
      },
      {
        id: 'pbs-a', label: '押しボタン a接点（PBS-A）',
        bbox: { minX: -25, minY: -20, maxX: 25, maxY: 6 },
        draw(g) {
          line(g,-25,0,-8,0); line(g,8,0,25,0);
          circleFill(g,-8,0,3); circleFill(g,8,0,3);
          line(g,-8,0,10,-12); line(g,0,-12,0,-18); line(g,-5,-18,5,-18);
        }
      },
      {
        id: 'pbs-b', label: '押しボタン b接点（PBS-B）',
        bbox: { minX: -25, minY: -20, maxX: 25, maxY: 6 },
        draw(g) {
          line(g,-25,0,-8,0); line(g,8,0,25,0);
          circleFill(g,-8,0,3); circleFill(g,8,0,3);
          line(g,-8,0,10,-12); line(g,2,-8,12,0);
          line(g,0,-12,0,-18); line(g,-5,-18,5,-18);
        }
      },
      {
        id: 'cos-a', label: '切換スイッチ a接点（COS-A）',
        bbox: { minX: -25, minY: -16, maxX: 25, maxY: 16 },
        draw(g) {
          line(g,-25,0,-10,0); circleFill(g,-10,0,3);
          circleFill(g,10,-10,3); circleFill(g,10,10,3);
          line(g,-10,0,12,-10);
          line(g,10,-10,25,-10); line(g,10,10,25,10);
        }
      },
      {
        id: 'cos-b', label: '切換スイッチ b接点（COS-B）',
        bbox: { minX: -25, minY: -16, maxX: 25, maxY: 16 },
        draw(g) {
          line(g,-25,0,-10,0); circleFill(g,-10,0,3);
          circleFill(g,10,-10,3); circleFill(g,10,10,3);
          line(g,-10,0,12,-10); line(g,2,-8,12,-2);
          line(g,10,-10,25,-10); line(g,10,10,25,10);
        }
      },
      {
        id: 'tdr-on', label: 'タイマリレー オンディレイ（TDR-ON）',
        bbox: { minX: -25, minY: -18, maxX: 25, maxY: 6 },
        draw(g) {
          line(g,-25,0,-10,0); circleFill(g,-10,0,3); circleFill(g,10,0,3);
          line(g,-10,0,12,-12); line(g,10,0,25,0);
          // タイマーマーク（半円）
          arc(g,1,-13,5,0,180,false);
        }
      },
      {
        id: 'tdr-off', label: 'タイマリレー オフディレイ（TDR-OFF）',
        bbox: { minX: -25, minY: -18, maxX: 25, maxY: 6 },
        draw(g) {
          line(g,-25,0,-10,0); circleFill(g,-10,0,3); circleFill(g,10,0,3);
          line(g,-10,0,12,-12); line(g,2,-8,14,0); line(g,10,0,25,0);
          arc(g,1,-13,5,0,180,false);
        }
      },
      {
        id: 'thr-a', label: 'サーマルリレー 動作接点（THR-A）',
        bbox: { minX: -25, minY: -18, maxX: 25, maxY: 6 },
        draw(g) {
          line(g,-25,0,-10,0); circleFill(g,-10,0,3); circleFill(g,10,0,3);
          line(g,-10,0,12,-14); line(g,10,0,25,0);
          // 熱動マーク（波線）
          path(g,'M -2 -16 Q 0 -20 2 -16 Q 4 -12 6 -16');
        }
      },
      {
        id: 'ls-a', label: 'リミットスイッチ a接点（LS-A）',
        bbox: { minX: -25, minY: -18, maxX: 25, maxY: 6 },
        draw(g) {
          line(g,-25,0,-10,0); circleFill(g,-10,0,3); circleFill(g,10,0,3);
          line(g,-10,0,12,-14); line(g,10,0,25,0);
          // アクチュエータ（L字）
          line(g,2,-14,2,-18); line(g,-2,-18,6,-18);
        }
      },
      {
        id: 'ls-b', label: 'リミットスイッチ b接点（LS-B）',
        bbox: { minX: -25, minY: -18, maxX: 25, maxY: 6 },
        draw(g) {
          line(g,-25,0,-10,0); circleFill(g,-10,0,3); circleFill(g,10,0,3);
          line(g,-10,0,12,-14); line(g,2,-10,14,0); line(g,10,0,25,0);
          line(g,2,-14,2,-18); line(g,-2,-18,6,-18);
        }
      },
      {
        id: 'pl', label: 'パイロットランプ（PL）',
        bbox: { minX: -16, minY: -16, maxX: 16, maxY: 16 },
        draw(g) {
          circle(g,0,0,12); line(g,0,-16,0,-12); line(g,0,12,0,16);
          circleFill(g,0,0,5);
        }
      },
      {
        id: 'phos', label: '光電スイッチ（PHOS）',
        bbox: { minX: -25, minY: -16, maxX: 25, maxY: 6 },
        draw(g) {
          line(g,-25,0,-10,0); circleFill(g,-10,0,3); circleFill(g,10,0,3);
          line(g,-10,0,12,-14); line(g,10,0,25,0);
          // 光マーク
          line(g,-2,-14,-8,-20); line(g,2,-14,-2,-20); line(g,6,-14,2,-20);
        }
      },
    ]
  },
  {
    id: 'signal',
    label: '表示・警報',
    items: [
      {
        id: 'b', label: 'ベル（B）',
        bbox: { minX: -20, minY: -20, maxX: 20, maxY: 20 },
        draw(g) {
          line(g,0,-20,0,-16);
          path(g,'M -12 0 Q -12 -16 0 -16 Q 12 -16 12 0 Z');
          line(g,-14,0,14,0); line(g,0,0,0,6); circleFill(g,0,8,3);
          line(g,0,12,0,20);
        }
      },
      {
        id: 'bz', label: 'ブザー（BZ）',
        bbox: { minX: -22, minY: -14, maxX: 22, maxY: 14 },
        draw(g) {
          line(g,-22,0,-12,0); rect(g,-12,-12,24,24);
          arc(g,18,0,6,300,60,true); arc(g,18,0,10,300,60,true);
          line(g,12,0,22,0);
        }
      },
      {
        id: 'h', label: 'ホーン（H）',
        bbox: { minX: -22, minY: -12, maxX: 22, maxY: 12 },
        draw(g) {
          line(g,-22,0,-12,0);
          path(g,'M -12 -8 L 4 -8 L 12 -12 L 12 12 L 4 8 L -12 8 Z');
          line(g,12,0,22,0);
        }
      },
      {
        id: 'fan', label: '送風機・換気扇（FAN）',
        bbox: { minX: -25, minY: -16, maxX: 25, maxY: 16 },
        draw(g) {
          line(g,-25,0,-16,0); circle(g,0,0,16);
          arc(g,0,-8,8,270,0,false); arc(g,8,0,8,0,90,false);
          arc(g,0,8,8,90,180,false); arc(g,-8,0,8,180,270,false);
          line(g,16,0,25,0);
        }
      },
      {
        id: 'fl', label: '蛍光灯（FL）',
        bbox: { minX: -30, minY: -10, maxX: 30, maxY: 10 },
        draw(g) {
          line(g,-30,0,-20,0); line(g,20,0,30,0);
          rect(g,-20,-8,40,16); line(g,-16,0,16,0);
        }
      },
      {
        id: 'bl', label: '白熱灯（BL）',
        bbox: { minX: -20, minY: -14, maxX: 20, maxY: 14 },
        draw(g) {
          circle(g,0,0,14); line(g,-20,0,-14,0); line(g,14,0,20,0);
          line(g,-8,-8,8,8); line(g,-8,8,8,-8);
        }
      },
      {
        id: 'eal', label: '非常警報装置（EAL）',
        bbox: { minX: -22, minY: -14, maxX: 22, maxY: 14 },
        draw(g) {
          line(g,-22,0,-12,0); rect(g,-12,-12,24,24);
          text(g,0,3,'EAL',8); line(g,12,0,22,0);
        }
      },
    ]
  },
  {
    id: 'misc',
    label: 'その他',
    items: [
      {
        id: 'junction', label: '接続点（4方向）',
        bbox: { minX: -20, minY: -20, maxX: 20, maxY: 20 },
        draw(g) {
          line(g,-20,0,20,0); line(g,0,-20,0,20); circleFill(g,0,0,4);
        }
      },
      {
        id: 'terminal', label: '端子',
        bbox: { minX: -20, minY: -10, maxX: 20, maxY: 10 },
        draw(g) { line(g,-20,0,-8,0); circle(g,0,0,8); line(g,8,0,20,0); }
      },
      {
        id: 'terminal-block', label: '端子台（TB）',
        bbox: { minX: -24, minY: -12, maxX: 24, maxY: 12 },
        draw(g) {
          rect(g,-24,-10,48,20);
          for (let x=-16; x<=16; x+=8) { line(g,x,-10,x,10); circleFill(g,x,0,2); }
        }
      },
      {
        id: 'busbar', label: 'ブスバー（母線）',
        bbox: { minX: -30, minY: -6, maxX: 30, maxY: 6 },
        draw(g) { rect(g,-30,-4,60,8); }
      },
      {
        id: 'cable-head', label: 'ケーブル終端',
        bbox: { minX: -16, minY: -20, maxX: 16, maxY: 20 },
        draw(g) {
          line(g,0,-20,0,-10);
          path(g,'M -12 -10 L 12 -10 L 0 10 Z');
          line(g,0,10,0,20);
        }
      },
      {
        id: 'distribution-board', label: '分電盤',
        bbox: { minX: -28, minY: -18, maxX: 28, maxY: 18 },
        draw(g) {
          rect(g,-28,-18,56,36); line(g,0,-18,0,18);
          circleFill(g,-14,-6,2); circleFill(g,-6,-6,2); line(g,-14,-6,-4,-12);
          circleFill(g,-14,6,2);  circleFill(g,-6,6,2);  line(g,-14,6,-4,0);
        }
      },
      {
        id: 'fuka', label: '負荷（総称）',
        bbox: { minX: -22, minY: -14, maxX: 22, maxY: 14 },
        draw(g) {
          line(g,-22,0,-12,0); rect(g,-12,-12,24,24);
          text(g,0,3,'負荷',9); line(g,12,0,22,0);
        }
      },
      {
        id: 'label-wire', label: '配線ラベル',
        bbox: { minX: -20, minY: -8, maxX: 20, maxY: 8 },
        draw(g) {
          line(g,-20,0,20,0);
          path(g,'M -10 -6 L 10 -6 L 16 0 L 10 6 L -10 6 Z');
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
function path(g, d) { el(g, 'path', { d }); }
function text(g, x, y, str, size = 11) {
  const t = el(g, 'text', { x, y, 'font-size': size, 'text-anchor': 'middle', 'dominant-baseline': 'middle', class: 'component-label' });
  t.textContent = str;
}
function arc(g, cx, cy, r, startDeg, endDeg, clockwise) {
  const s = startDeg * Math.PI / 180;
  const e = endDeg * Math.PI / 180;
  const x1 = cx + r * Math.cos(s); const y1 = cy + r * Math.sin(s);
  const x2 = cx + r * Math.cos(e); const y2 = cy + r * Math.sin(e);
  path(g, `M ${x1} ${y1} A ${r} ${r} 0 0 ${clockwise ? 1 : 0} ${x2} ${y2}`);
}
function wavePath(g, x1, y, x2) {
  const w = x2 - x1;
  path(g, `M ${x1} ${y} C ${x1+w*.1} ${y-8} ${x1+w*.4} ${y-8} ${x1+w*.5} ${y} S ${x2-w*.1} ${y+8} ${x2} ${y}`);
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
