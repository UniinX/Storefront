/**
 * UNIINX "ink weave" logo animation.
 *
 * Sequence: Telugu → Hindi → Tamil → Kannada → Bengali → Marathi →
 * Gujarati → Punjabi → Odia → Urdu → Latin "UNIINX" (final hold).
 * Each step is the SAME word — a transliteration of "Uniinx" itself,
 * not the language's own name — so the loop reads as one brand mark
 * traveling through scripts, landing on the wordmark.
 *
 * Motion: a single clip-path wipe animates text + underline thread
 * together (same reference box), so the thread reads as an ink line
 * the letters are drawn from. Reveal → hold → retract-right, so each
 * word visually "pulls" itself off to the right as the next begins —
 * that's the continuous weave, done with sequential cuts instead of
 * true glyph morphing (real script-to-script letterform morphing isn't
 * feasible — the shapes don't share topology).
 *
 * BRAND COLORS — this is deliberately monochrome so it's easy to
 * restyle. Change INK / PAPER below (or swap in CSS vars) once real
 * brand colors are picked; nothing else in the animation needs to change.
 */

const INK = "#141110";
const PAPER = "#faf8f4";

const STEPS = [
  { text: "యూనింక్స్", font: '"Noto Serif Telugu", serif' },
  { text: "यूनिंक्स", font: '"Noto Serif Devanagari", serif' },
  { text: "யூனிங்க்ஸ்", font: '"Noto Serif Tamil", serif' },
  { text: "ಯೂನಿಂಕ್ಸ್", font: '"Noto Serif Kannada", serif' },
  { text: "ইউনিংক্স", font: '"Noto Serif Bengali", serif' },
  { text: "युनिंक्स", font: '"Noto Serif Devanagari", serif' },
  { text: "યુનિંક્સ", font: '"Noto Serif Gujarati", serif' },
  { text: "ਯੂਨਿੰਕਸ", font: '"Noto Serif Gurmukhi", serif' },
  { text: "ଉନିଙ୍କ୍ସ", font: '"Noto Serif Oriya", serif' },
  { text: "یونینکس", font: '"Noto Nastaliq Urdu", serif', rtl: true },
  { text: "UNIINX", font: '"Anton", sans-serif', final: true },
];

const STEP_DUR = 0.62;
const FINAL_HOLD = 2.0;

function stepTiming(i) {
  const start = i * STEP_DUR;
  const isFinal = i === STEPS.length - 1;
  const end = start + (isFinal ? STEP_DUR + FINAL_HOLD : STEP_DUR);
  return { start, end };
}

const TOTAL_DURATION = stepTiming(STEPS.length - 1).end + 0.3;

function WordWeave({ text, font, rtl, isFinal }) {
  const { progress } = window.useSprite();

  const revealEnd = isFinal ? 0.55 : 0.42;
  const retractStart = isFinal ? 1 : 0.78;

  const revealFrac = window.clamp(progress / revealEnd, 0, 1);
  const retractFrac = isFinal
    ? 0
    : window.clamp((progress - retractStart) / (1 - retractStart), 0, 1);

  const revealEase = window.Easing.easeOutCubic ? window.Easing.easeOutCubic(revealFrac) : revealFrac;
  const retractEase = window.Easing.easeInCubic ? window.Easing.easeInCubic(retractFrac) : retractFrac;

  const openInset = (1 - revealEase) * 100; // shrinks 100 -> 0 as word draws in
  const closeInset = retractEase * 100; // grows 0 -> 100 as word pulls away

  const clipPath = rtl
    ? `inset(0 ${closeInset}% 0 ${openInset}%)`
    : `inset(0 ${openInset}% 0 ${closeInset}%)`;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ position: "relative", display: "inline-block", clipPath }}>
        <div
          dir={rtl ? "rtl" : "ltr"}
          style={{
            fontFamily: font,
            fontSize: isFinal ? 130 : 108,
            letterSpacing: isFinal ? "0.02em" : "normal",
            color: INK,
            whiteSpace: "nowrap",
            lineHeight: 1,
            padding: "0 4px",
          }}
        >
          {text}
        </div>
        <div
          style={{
            position: "absolute",
            left: 4,
            right: 4,
            bottom: -22,
            height: 4,
            borderRadius: 2,
            background: INK,
          }}
        />
      </div>
    </div>
  );
}

function LogoAnimationScene() {
  const { Stage, Sprite } = window;
  return (
    <Stage width={1080} height={1080} duration={TOTAL_DURATION} background={PAPER} loop={false}>
      <div
        style={{
          position: "absolute",
          top: 64,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: '"Stack Sans Text", sans-serif',
          fontSize: 15,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: INK,
          opacity: 0.55,
        }}
      >
        Clothes in your Language
      </div>

      {STEPS.map((step, i) => {
        const { start, end } = stepTiming(i);
        return (
          <Sprite key={i} start={start} end={end}>
            <WordWeave text={step.text} font={step.font} rtl={step.rtl} isFinal={step.final} />
          </Sprite>
        );
      })}
    </Stage>
  );
}

window.LogoAnimationScene = LogoAnimationScene;
