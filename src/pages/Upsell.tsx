import React, { useEffect, useMemo, useState } from 'react';

const ACCENT = '#7b2d8e';
const ACCENT_LIGHT = '#9b3fad';
const ACCENT_SOFT = '#c87dd9';
const BG = '#faf8fc';
const BG_CARD = '#ffffff';
const BG_SOFT = '#f5f0f8';
const TEXT_TITLE = '#1a1a2e';
const TEXT_BODY = '#3d3d54';
const TEXT_SECONDARY = '#7a7a8f';
const BORDER_COLOR = 'rgba(123, 45, 142, 0.12)';

function CheckIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#22c55e" opacity="0.15" />
      <path d="M6 12.5l4 3.5 8-9" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FeatureIcon({ type }: { type: 'chat' | 'shield' | 'refresh' | 'star' }) {
  if (type === 'chat') {
    return (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (type === 'shield') {
    return (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (type === 'refresh') {
    return (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0118.8-4.3M22 12.5a10 10 0 01-18.8 4.2" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HourglassIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 3h12M6 21h12" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 3c0 5 10 5 10 10s-10 5-10 10" stroke={ACCENT} strokeWidth="1.8" />
      <path d="M17 3c0 5-10 5-10 10s10 5 10 10" stroke={ACCENT} strokeWidth="1.8" />
    </svg>
  );
}

export default function Upsell() {
  const [revealed, setRevealed] = useState(false);
  const [mountedWidget, setMountedWidget] = useState(false);

  const priceParts = useMemo(() => ({ main: '19', cents: '90' }), []);

  const NO_DELAY =
    (typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('fast')) ||
    import.meta.env.VITE_UPSELL_NO_DELAY === 'true';

  useEffect(() => {
    if (NO_DELAY) {
      setRevealed(true);
      return;
    }
    const t = setTimeout(() => setRevealed(true), 60000);
    return () => clearTimeout(t);
  }, [NO_DELAY]);

  useEffect(() => {
    if (!revealed || mountedWidget) return;
    const ensureHotmartScript = () =>
      new Promise<void>((resolve, reject) => {
        if (window.checkoutElements && typeof window.checkoutElements.init === 'function') {
          resolve();
          return;
        }
        const existing = document.getElementById('hotmart-checkout-script') as HTMLScriptElement | null;
        if (existing) {
          existing.addEventListener('load', () => resolve(), { once: true });
          existing.addEventListener('error', () => reject(new Error('Hotmart script load error')), { once: true });
          return;
        }
        const s = document.createElement('script');
        s.id = 'hotmart-checkout-script';
        s.src = 'https://checkout.hotmart.com/lib/hotmart-checkout-elements.js';
        s.async = true;
        s.addEventListener('load', () => resolve(), { once: true });
        s.addEventListener('error', () => reject(new Error('Hotmart script load error')), { once: true });
        const anchor = document.getElementById('hotmart-script-anchor');
        if (anchor) anchor.appendChild(s);
        else document.head.appendChild(s);
      });

    ensureHotmartScript()
      .then(() => {
        if (window.checkoutElements && typeof window.checkoutElements.init === 'function') {
          window.checkoutElements.init('salesFunnel').mount('#hotmart-sales-funnel');
          setMountedWidget(true);
        }
      })
      .catch(console.error);
  }, [revealed, mountedWidget]);

  useEffect(() => {
    const existing = document.getElementById('vturb-player-script');
    if (existing) return;
    const s = document.createElement('script');
    s.id = 'vturb-player-script';
    s.src = 'https://scripts.converteai.net/eace989b-db46-41fb-9133-2b70e27ad3d6/players/69cdcb15181cf04198569c93/v4/player.js';
    s.async = true;
    document.head.appendChild(s);
  }, []);

  return (
    <div style={{ background: BG, color: TEXT_BODY }} className="min-h-screen w-full font-sans overflow-x-hidden pb-20">
      <div className="mx-auto max-w-[640px] px-4 py-5 text-center">
        
        {/* SEÇÃO 1 — Barra de confirmação */}
        <div className="sticky top-0 z-50 mb-6 slide-down">
          <div className="flex items-center justify-center gap-2 rounded-xl border border-[#bbf7d0] bg-[#ecfdf5] px-4 py-3 shadow-sm">
            <CheckIcon className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium text-green-800">
              ¡Compra aprobada! Tu acceso a la <span className="font-bold">Frecuencia Límbica</span> está confirmado.
            </p>
          </div>
        </div>

        {/* SEÇÃO 2 — Headline + Sub-headline */}
        <div className="mt-8 mb-6 fade-in">
          <h1
            className="font-extrabold leading-tight text-[clamp(24px,7vw,38px)]"
            style={{ fontFamily: '"Playfair Display", serif', color: TEXT_TITLE }}
          >
            ESPERA — <span style={{ color: ACCENT }}>Tu pedido no está completo</span>
          </h1>
          <p className="mt-4 text-[clamp(15px,4.5vw,19px)] leading-relaxed font-medium">
            La Frecuencia Límbica lo trae de vuelta. Pero sin esto, <span className="text-[#dc2626] font-bold">podrías perderlo otra vez.</span>
          </p>
        </div>

        {/* SEÇÃO 3 — Vídeo VSL */}
        <div className="mt-6 relative -mx-4 md:-mx-0">
          <div className="relative w-full overflow-hidden shadow-[0_0_30px_rgba(123,45,142,0.15)] transition-shadow duration-500 hover:shadow-[0_0_40px_rgba(123,45,142,0.25)] md:rounded-2xl md:border" style={{ borderColor: 'rgba(123, 45, 142, 0.2)' }}>
            <div className="relative w-full" style={{ paddingBottom: '177.78%' }}>
              <div className="absolute inset-0 flex items-center justify-center bg-white">
                <vturb-smartplayer
                  id="vid-69cdcb15181cf04198569c93"
                  style={{ display: 'block', margin: '0 auto', width: '100%', height: '100%' }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* CONTEÚDO COM DELAY */}
        <div className={`mt-12 ${revealed ? 'fade-in' : 'hidden'}`}>
          <div className="space-y-12">
            
            {/* SEÇÃO 4 — Bloco de copy emocional */}
            <div className="rounded-2xl bg-white p-8 border border-[rgba(123,45,142,0.1)] shadow-sm text-center transition-all hover:shadow-md">
              <div className="space-y-4 text-[clamp(16px,4.5vw,19px)] italic leading-relaxed text-neutral-700">
                <p>"¿Qué pasa cuando él te escribe y no sabes qué responder?"</p>
                <p>"¿Cuando se ven y dices algo que lo arruina todo?"</p>
                <p>"¿Cuando vuelve pero a las semanas se pone frío otra vez?"</p>
              </div>
              <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-[rgba(123,45,142,0.2)] to-transparent" />
              <p className="text-[clamp(17px,4.8vw,20px)] leading-relaxed font-medium">
                La frecuencia reactiva el interruptor. Pero lo que tú haces después decide si <span className="font-bold" style={{ color: ACCENT }}>se queda para siempre</span> o si <span className="text-[#dc2626] font-bold">lo pierdes de nuevo.</span>
              </p>
            </div>

            {/* SEÇÃO 5 — Apresentação da Mentoría */}
            <div className="relative rounded-2xl bg-white p-8 border-2 shadow-[0_15px_45px_rgba(123,45,142,0.15)] transition-all hover:scale-[1.01]" style={{ borderColor: ACCENT }}>
              <div className="absolute -top-3 right-4">
                <span className="rounded-full bg-[#7b2d8e] px-4 py-1 text-[11px] font-bold tracking-wider text-white uppercase shadow-sm">
                  INCLUIDA
                </span>
              </div>
              <div className="flex flex-col items-center gap-5">
                <div className="rounded-full p-4 bg-purple-50 border border-purple-100">
                  <FeatureIcon type="chat" />
                </div>
                <h2 className="text-2xl font-bold leading-tight" style={{ color: TEXT_TITLE, fontFamily: '"Playfair Display", serif' }}>
                  Mentoría Privada con la Dra. Paola — 24/7
                </h2>
                <p className="text-lg leading-relaxed text-neutral-600">
                  Acceso directo ilimitado. Te dice exactamente qué escribir, qué decir y cómo actuar en cada momento. A cualquier hora. Cualquier día.
                </p>
              </div>
            </div>

            {/* SEÇÃO 6 — 3 Frecuências extras */}
            <div className="grid grid-cols-1 gap-4">
              <FeatureCard
                icon={<FeatureIcon type="shield" />}
                title="Frecuencia de Blindaje Emocional"
                desc="Mantiene ese interruptor encendido permanentemente para que él nunca más quiera alejarse."
              />
              <FeatureCard
                icon={<FeatureIcon type="refresh" />}
                title="Frecuencia Anti-Recaída"
                desc="Para cuando él se pone frío o distante. Lo reconecta antes de que la distancia crezca."
              />
              <FeatureCard
                icon={<FeatureIcon type="star" />}
                title="Frecuencia de Borrado"
                desc="Elimina las heridas del pasado para que la relación empiece limpia, sin rencores ni fantasmas."
              />
            </div>

            {/* SEÇÃO 7 — Depoimento */}
            <div className="relative overflow-hidden rounded-2xl bg-[#f5f0f8] p-8 border-l-[5px] text-left" style={{ borderColor: ACCENT }}>
              <div className="absolute top-2 right-4 opacity-10 pointer-events-none">
                <svg width="80" height="80" viewBox="0 0 24 24" fill={ACCENT}>
                  <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C20.1216 16 21.017 16.8954 21.017 18V21C21.017 22.1046 20.1216 23 19.017 23H16.017C14.9124 23 14.017 22.1046 14.017 21ZM14.017 21V10C14.017 6.13401 17.151 3 21.017 3V5C18.2556 5 16.017 7.23858 16.017 10H21.017V16H16.017C14.9124 16 14.017 16.8954 14.017 18V21ZM3 21L3 18C3 16.8954 3.89543 16 5 16H8C9.10457 16 10 16.8954 10 18V21C10 22.1046 9.10457 23 8 23H5C3.89543 23 3 22.1046 3 21ZM3 21V10C3 6.13401 6.13401 3 10 3V5C7.23858 5 5 7.23858 5 10H10V16H5C3.89543 16 3 16.8954 3 18V21Z" />
                </svg>
              </div>
              <div className="relative z-10">
                <p className="text-[17px] italic leading-relaxed text-neutral-700">
                  "Yo compré la frecuencia y a los 3 días él me escribió. Pero casi lo arruino mandándole mil mensajes. La Dra. Paola me guió paso a passo y hoy llevamos 3 meses juntos. Sin la mentoría lo hubiera perdido esa noche. Lo sé."
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-purple-100 pt-4">
                  <p className="font-bold text-neutral-900">— Dolores</p>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg key={i} className="w-4 h-4 fill-[#7b2d8e]" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* SEÇÃO 8 — Ancoragem + Preço */}
            <div className="rounded-3xl bg-white p-10 border-2 shadow-[0_20px_60px_rgba(123,45,142,0.18)] text-center transition-all pulse-glow" style={{ borderColor: ACCENT }}>
              <p className="text-lg text-neutral-500 font-medium">
                4 consultas privadas = <span className="line-through text-[#dc2626]">$400 USD</span>
              </p>
              <div className="mt-4 flex items-baseline justify-center gap-2">
                <span style={{ color: ACCENT }} className="text-3xl font-bold">$</span>
                <span className="text-7xl font-extrabold text-neutral-900 tracking-tighter" style={{ fontFamily: '"Playfair Display", serif' }}>
                  {priceParts.main}
                </span>
                <span style={{ color: ACCENT }} className="text-3xl font-bold">.{priceParts.cents}</span>
              </div>
              <p className="text-base text-neutral-500 mt-3 font-medium tracking-wide">Acceso para siempre · Un único pago</p>
            </div>

            {/* SEÇÃO 9 — Widget Hotmart */}
            <div className="mt-2 min-h-[100px]">
              <div id="hotmart-script-anchor"></div>
              <div id="hotmart-sales-funnel"></div>
            </div>

            {/* SEÇÃO 10 — Garantia */}
            <div className="flex flex-col md:flex-row items-center gap-6 rounded-2xl border bg-white p-8 shadow-sm transition-all hover:shadow-md" style={{ borderColor: 'rgba(34, 197, 94, 0.2)' }}>
              <div className="flex-shrink-0 relative">
                <div className="h-20 w-20 rounded-full bg-green-50 flex items-center justify-center border-2 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.15)]">
                  <div className="text-center leading-none">
                    <div className="text-xl font-black text-green-600">30</div>
                    <div className="text-[10px] font-black text-green-600 uppercase tracking-tighter">DÍAS</div>
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5 text-white shadow-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 4.925-3.467 9.435-9.255 10.544a.75.75 0 01-.29 0c-5.788-1.109-9.255-5.619-9.255-10.544 0-.68.056-1.35.166-2.001zM13 8a1 1 0 00-2 0v2H9V8a1 1 0 10-2 0v2H5a1 1 0 100 2h2v2a1 1 0 102 0v-2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="text-center md:text-left">
                <p className="text-neutral-700 leading-relaxed text-[15px]">
                  Garantía incondicional de 30 días. Si no sientes ningún cambio, te devuelvo cada centavo. Sin preguntas. <span className="font-bold text-neutral-900">El riesgo es todo mío.</span>
                </p>
              </div>
            </div>

            {/* SEÇÃO 11 — Urgência final */}
            <div className="rounded-2xl p-6 bg-purple-50 border border-purple-100 text-center shadow-inner">
              <p className="text-[#7b2d8e] font-semibold leading-relaxed">
                ⏳ Esta oferta solo aparece una vez. Cuando cierres esta página, desaparece para siempre.
              </p>
            </div>

            {/* SEÇÃO 12 — Frase de fechamento emocional */}
            <div className="pt-8 pb-16 text-center space-y-4">
              <p className="text-xl italic leading-relaxed text-neutral-700" style={{ fontFamily: '"Playfair Display", serif' }}>
                "Ya diste el primer paso para recuperarlo. Este es el paso que asegura que no lo pierdas de nuevo."
              </p>
              <div className="flex flex-col items-center gap-3 pt-2">
                <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-purple-200">
                  <img src="https://i.imgur.com/C4JGtMM.jpg" alt="Dra. Paola" className="h-full w-full object-cover" />
                </div>
                <p className="font-bold text-lg" style={{ color: ACCENT }}>— Dra. Paola</p>
              </div>
            </div>

            {/* Para pruebas sem delay: descomente a linha abaixo no useEffect correspondente */}
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-3 rounded-2xl bg-white p-6 border border-[rgba(123,45,142,0.08)] shadow-sm transition-all hover:shadow-md hover:border-[rgba(123,45,142,0.2)]">
      <div className="flex items-center justify-center rounded-xl bg-purple-50 p-3">{icon}</div>
      <div className="space-y-2">
        <p className="font-bold text-[17px]" style={{ color: TEXT_TITLE }}>{title}</p>
        <p className="text-[15px] leading-relaxed text-neutral-500">{desc}</p>
      </div>
    </div>
  );
}
