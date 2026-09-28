/* ============================================================
   art.js — 全站配图（纯 SVG 抽象图形，无外部图片）
   所有图形统一画布底色 #EFECE3，与 .frame 背景一致，
   因此在任何尺寸下都不会出现接缝。
   想替换成真实照片时，把 HTML 里的 <svg class="art"> 换成 <img> 即可。
   ============================================================ */

(function () {
  var BG = "#EFECE3";
  var PAPER = "#F7F5F0";
  var SAND = "#DAD3C6";
  var SAND2 = "#D3CCC0";
  var INK = "#1A1814";
  var ACCENT = "#C4553A";

  var defs = [];

  function sym(id, w, h, inner) {
    defs.push(
      '<symbol id="art-' + id + '" viewBox="0 0 ' + w + ' ' + h +
        '" preserveAspectRatio="xMidYMid meet">' + inner + "</symbol>"
    );
  }

  function line(x1, y1, x2, y2, o, w) {
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 +
      '" stroke="' + INK + '" stroke-width="' + (w || 0.5) + '" opacity="' + (o || 0.3) + '"/>';
  }

  /* ---------- 首页主视觉：一棵树（你自己说喜欢的元素） ---------- */
  sym("tree", 640, 800,
    '<rect width="640" height="800" fill="' + BG + '"/>' +
    '<rect y="604" width="640" height="196" fill="#E7E3DA"/>' +
    '<rect y="712" width="640" height="88" fill="#E1DCD1"/>' +
    /* 树冠：几块低饱和的形叠出来，不加细节 */
    '<circle cx="320" cy="288" r="150" fill="' + SAND2 + '"/>' +
    '<circle cx="214" cy="342" r="102" fill="' + SAND + '"/>' +
    '<circle cx="430" cy="332" r="110" fill="#E4DFD4"/>' +
    '<circle cx="322" cy="206" r="92" fill="' + PAPER + '"/>' +
    '<circle cx="374" cy="252" r="66" fill="' + SAND + '" opacity="0.65"/>' +
    /* 树干与枝 */
    '<path d="M304 610 C298 512 298 448 312 372 L332 372 C344 448 342 512 338 610 Z" fill="' + INK + '"/>' +
    '<path d="M316 512 C286 490 262 470 244 444" fill="none" stroke="' + INK + '" stroke-width="5"/>' +
    '<path d="M326 462 C356 442 382 424 400 402" fill="none" stroke="' + INK + '" stroke-width="4"/>' +
    /* 地面上的一点影子与落叶 */
    '<ellipse cx="321" cy="612" rx="118" ry="10" fill="' + INK + '" opacity="0.1"/>' +
    '<circle cx="470" cy="470" r="6" fill="' + SAND2 + '"/>' +
    '<circle cx="486" cy="530" r="4" fill="' + SAND + '"/>' +
    '<circle cx="176" cy="512" r="5" fill="' + SAND2 + '"/>' +
    /* 一个很小的重色块，挂在树冠边上，和全站呼应 */
    '<rect x="446" y="228" width="22" height="22" fill="' + ACCENT + '"/>' +
    line(88, 604, 552, 604, 0.3, 0.75)
  );

  sym("portrait", 640, 800,
    '<rect width="640" height="800" fill="' + BG + '"/>' +
    line(60, 424, 580, 424, 0.22) +
    line(96, 120, 96, 680, 0.22) +
    '<circle cx="320" cy="336" r="88" fill="' + INK + '"/>' +
    '<path d="M172 660 C172 520 240 424 320 424 C400 424 468 520 468 660 Z" fill="' + INK + '"/>' +
    '<rect x="512" y="140" width="26" height="26" fill="' + ACCENT + '"/>'
  );

  /* 关于页配图：摊开的本子、一支笔、一杯水、一段胶带 */
  sym("desk", 640, 800,
    '<rect width="640" height="800" fill="' + BG + '"/>' +
    '<rect y="524" width="640" height="276" fill="#E7E3DA"/>' +
    line(0, 524, 640, 524, 0.3, 0.75) +
    '<ellipse cx="320" cy="534" rx="230" ry="10" fill="' + INK + '" opacity="0.09"/>' +
    /* 本子 */
    '<rect x="126" y="234" width="368" height="296" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="0.5"/>' +
    '<rect x="126" y="234" width="26" height="296" fill="' + SAND + '"/>' +
    /* 本子上没画完的形体 */
    '<path d="M212 386 L306 356 L406 394 L312 428 Z" fill="none" stroke="' + INK + '" stroke-width="0.75" opacity="0.5"/>' +
    '<path d="M406 394 L406 452 L312 486 L312 428" fill="none" stroke="' + INK + '" stroke-width="0.75" opacity="0.35"/>' +
    '<circle cx="228" cy="470" r="34" fill="none" stroke="' + INK + '" stroke-width="0.75" opacity="0.45"/>' +
    '<circle cx="382" cy="470" r="20" fill="' + ACCENT + '" opacity="0.85"/>' +
    /* 铅笔 */
    '<g transform="rotate(-24 470 520)">' +
    '<rect x="398" y="504" width="176" height="13" fill="' + INK + '"/>' +
    '<path d="M398 504 L374 510.5 L398 517 Z" fill="' + INK + '"/>' +
    '<rect x="512" y="504" width="18" height="13" fill="' + SAND2 + '"/>' +
    '</g>' +
    /* 杯子 */
    '<rect x="92" y="556" width="86" height="98" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="0.5"/>' +
    '<path d="M178 584 C206 584 206 620 178 620" fill="none" stroke="' + INK + '" stroke-width="0.75" opacity="0.5"/>' +
    '<rect x="92" y="602" width="86" height="52" fill="' + SAND + '" opacity="0.6"/>' +
    /* 一段胶带 */
    '<g transform="rotate(-7 520 268)">' +
    '<rect x="452" y="252" width="136" height="30" fill="' + SAND2 + '" opacity="0.62"/>' +
    '</g>' +
    /* 一片叶子 */
    '<path d="M540 640 C566 606 604 604 610 640 C604 676 566 674 540 640 Z" fill="' + ACCENT + '" opacity="0.8"/>'
  );

  /* ---------- 设计作品 ---------- */
  sym("w1", 800, 600,
    '<rect width="800" height="600" fill="' + BG + '"/>' +
    '<circle cx="400" cy="250" r="186" fill="none" stroke="' + INK + '" stroke-width="0.75" opacity="0.22"/>' +
    '<path d="M262 250 A138 138 0 0 1 538 250 Z" fill="' + ACCENT + '"/>' +
    '<rect x="250" y="250" width="300" height="14" fill="' + INK + '"/>' +
    '<rect x="394" y="264" width="12" height="112" fill="' + INK + '"/>' +
    '<ellipse cx="400" cy="392" rx="104" ry="20" fill="' + SAND + '"/>'
  );

  sym("w2", 800, 600,
    '<rect width="800" height="600" fill="' + BG + '"/>' +
    line(120, 426, 680, 426, 0.22) +
    '<rect x="150" y="196" width="500" height="18" fill="' + INK + '"/>' +
    '<rect x="200" y="214" width="14" height="212" fill="' + INK + '"/>' +
    '<rect x="586" y="214" width="14" height="212" fill="' + ACCENT + '"/>' +
    '<rect x="200" y="306" width="400" height="10" fill="' + SAND + '"/>'
  );

  sym("w3", 800, 600,
    '<rect width="800" height="600" fill="' + BG + '"/>' +
    '<rect x="200" y="150" width="110" height="290" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="0.5"/>' +
    '<rect x="340" y="150" width="110" height="290" fill="' + ACCENT + '"/>' +
    '<rect x="480" y="150" width="110" height="290" fill="' + INK + '"/>' +
    '<rect x="340" y="220" width="110" height="40" fill="' + PAPER + '" opacity="0.9"/>' +
    '<rect x="190" y="440" width="410" height="4" fill="' + INK + '" opacity="0.85"/>'
  );

  sym("w4", 800, 600,
    '<rect width="800" height="600" fill="' + BG + '"/>' +
    '<rect x="300" y="120" width="200" height="380" rx="24" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="0.5"/>' +
    '<rect x="378" y="134" width="44" height="6" rx="3" fill="' + INK + '" opacity="0.28"/>' +
    '<rect x="322" y="172" width="156" height="84" rx="6" fill="' + SAND + '"/>' +
    '<rect x="322" y="272" width="72" height="72" rx="6" fill="' + ACCENT + '"/>' +
    '<rect x="406" y="272" width="72" height="72" rx="6" fill="' + SAND + '"/>' +
    '<rect x="322" y="364" width="156" height="10" rx="5" fill="#C9C4B8"/>' +
    '<rect x="322" y="386" width="104" height="10" rx="5" fill="#C9C4B8"/>' +
    '<rect x="322" y="428" width="156" height="34" rx="6" fill="' + INK + '"/>'
  );

  var para = '<rect width="800" height="600" fill="' + BG + '"/>';
  for (var i = 0; i < 9; i++) {
    para += '<g transform="rotate(' + i * 10 + ' 400 300)">' +
      '<rect x="290" y="190" width="220" height="220" fill="none" stroke="' + INK +
      '" stroke-width="0.75" opacity="0.3"/></g>';
  }
  para += '<rect x="350" y="250" width="100" height="100" fill="' + ACCENT + '"/>';
  sym("w5", 800, 600, para);

  sym("w6", 800, 600,
    '<rect width="800" height="600" fill="' + BG + '"/>' +
    line(150, 520, 650, 520, 0.22) +
    '<circle cx="250" cy="430" r="72" fill="none" stroke="' + INK + '" stroke-width="0.75" opacity="0.4"/>' +
    '<rect x="230" y="160" width="170" height="170" fill="' + INK + '" opacity="0.08"/>' +
    '<rect x="310" y="230" width="170" height="170" fill="' + ACCENT + '" opacity="0.34"/>' +
    '<rect x="390" y="300" width="170" height="170" fill="' + INK + '" opacity="0.14"/>'
  );

  /* ---------- 生活照片 ---------- */
  sym("p1", 800, 600,
    '<rect width="800" height="600" fill="' + BG + '"/>' +
    '<rect y="300" width="800" height="300" fill="#CFD6D4"/>' +
    line(0, 300, 800, 300, 0.35, 0.75) +
    '<circle cx="546" cy="212" r="62" fill="' + ACCENT + '" opacity="0.9"/>' +
    '<line x1="120" y1="352" x2="360" y2="352" stroke="' + PAPER + '" stroke-width="1.5" opacity="0.8"/>' +
    '<line x1="420" y1="396" x2="700" y2="396" stroke="' + PAPER + '" stroke-width="1.5" opacity="0.7"/>' +
    '<line x1="80" y1="452" x2="290" y2="452" stroke="' + PAPER + '" stroke-width="1.5" opacity="0.6"/>' +
    '<line x1="500" y1="486" x2="740" y2="486" stroke="' + PAPER + '" stroke-width="1.5" opacity="0.5"/>'
  );

  sym("p2", 800, 600,
    '<rect width="800" height="600" fill="' + BG + '"/>' +
    '<path d="M90 470 L300 190 L510 470 Z" fill="' + SAND2 + '"/>' +
    '<path d="M330 470 L520 240 L710 470 Z" fill="' + ACCENT + '" opacity="0.72"/>' +
    '<rect y="470" width="800" height="130" fill="#E4DFD4"/>' +
    line(0, 470, 800, 470, 0.3, 0.75)
  );

  sym("p3", 800, 600,
    '<rect width="800" height="600" fill="' + BG + '"/>' +
    '<rect x="120" y="300" width="78" height="220" fill="' + SAND + '"/>' +
    '<rect x="212" y="228" width="92" height="292" fill="' + INK + '" opacity="0.82"/>' +
    '<rect x="318" y="336" width="70" height="184" fill="' + SAND + '"/>' +
    '<rect x="402" y="266" width="96" height="254" fill="' + ACCENT + '" opacity="0.82"/>' +
    '<rect x="512" y="352" width="80" height="168" fill="' + INK + '" opacity="0.72"/>' +
    '<rect x="606" y="308" width="74" height="212" fill="' + SAND2 + '"/>' +
    line(60, 520, 740, 520, 0.35, 0.75)
  );

  sym("p4", 800, 600,
    '<rect width="800" height="600" fill="' + BG + '"/>' +
    '<path d="M420 120 L740 120 L620 470 L300 470 Z" fill="#F3EEE4"/>' +
    '<rect y="470" width="800" height="130" fill="' + SAND + '"/>' +
    '<rect x="200" y="120" width="400" height="350" fill="none" stroke="' + INK + '" stroke-width="0.75" opacity="0.45"/>' +
    line(400, 120, 400, 470, 0.32) +
    line(200, 295, 600, 295, 0.32)
  );

  sym("p5", 800, 600,
    '<rect width="800" height="600" fill="' + BG + '"/>' +
    line(60, 524, 740, 524, 0.22) +
    '<ellipse cx="230" cy="420" rx="180" ry="76" fill="' + PAPER + '"/>' +
    '<ellipse cx="400" cy="368" rx="210" ry="86" fill="#E4DFD4"/>' +
    '<ellipse cx="560" cy="428" rx="160" ry="68" fill="' + ACCENT + '" opacity="0.22"/>'
  );

  sym("p6", 800, 600,
    '<rect width="800" height="600" fill="' + BG + '"/>' +
    line(0, 236, 800, 236, 0.22) +
    '<path d="M0 600 L340 236 L460 236 L800 600 Z" fill="' + SAND + '"/>' +
    line(0, 0, 340, 236, 0.28) +
    line(800, 0, 460, 236, 0.28) +
    '<g fill="' + PAPER + '">' +
    '<rect x="350" y="560" width="100" height="10"/>' +
    '<rect x="365" y="470" width="70" height="8"/>' +
    '<rect x="376" y="400" width="48" height="7"/>' +
    '<rect x="384" y="348" width="32" height="6"/>' +
    '<rect x="389" y="306" width="22" height="5"/>' +
    '</g>'
  );

  sym("p7", 800, 600,
    '<rect width="800" height="600" fill="' + BG + '"/>' +
    '<rect y="470" width="800" height="130" fill="#E7E3DA"/>' +
    line(0, 470, 800, 470, 0.3, 0.75) +
    '<ellipse cx="400" cy="474" rx="86" ry="14" fill="' + INK + '" opacity="0.12"/>' +
    '<path d="M388 470 L392 330 L408 330 L412 470 Z" fill="' + INK + '"/>' +
    '<circle cx="400" cy="248" r="118" fill="' + SAND2 + '"/>' +
    '<circle cx="316" cy="308" r="86" fill="' + SAND + '"/>' +
    '<circle cx="486" cy="300" r="78" fill="#E4DFD4"/>'
  );

  sym("p8", 800, 600,
    '<rect width="800" height="600" fill="' + BG + '"/>' +
    line(140, 510, 660, 510, 0.22) +
    '<circle cx="290" cy="270" r="96" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="0.5"/>' +
    '<circle cx="290" cy="270" r="64" fill="' + SAND + '"/>' +
    '<rect x="430" y="216" width="200" height="150" fill="' + INK + '" opacity="0.86" transform="rotate(-8 530 291)"/>' +
    '<circle cx="470" cy="428" r="42" fill="' + ACCENT + '"/>'
  );

  /* ---------- 注入 sprite ---------- */
  var sprite = '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" ' +
    'width="0" height="0" style="position:absolute;overflow:hidden">' +
    defs.join("") + "</svg>";

  var host = document.currentScript;
  if (host && host.parentNode) {
    host.insertAdjacentHTML("beforebegin", sprite);
  } else {
    document.body.insertAdjacentHTML("afterbegin", sprite);
  }
})();
