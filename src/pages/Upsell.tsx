import React, { useEffect, useMemo, useState } from 'react';

const ACCENT = '#7b2d8e';
const ACCENT_LIGHT = '#9b3fad';
const ACCENT_SOFT = '#c87dd9';
const TEXT_TITLE = '#1a1a2e';
const TEXT_BODY = '#3d3d54';
const TEXT_SECONDARY = '#7a7a8f';
const BORDER_GRADIENT = 'linear-gradient(135deg, #7b2d8e, #c87dd9)';

function CheckIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#22c55e" opacity="0.15" />
      <path d="M6 12.5l4 3.5 8-9" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FeatureIcon({ type }: { type: 'chat' | 'shield' | 'refresh' | 'star' | 'clock' }) {
  if (type === 'chat') {
    return (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="chat-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7b2d8e" />
            <stop offset="100%" stopColor="#c87dd9" />
          </linearGradient>
        </defs>
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke="url(#chat-grad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (type === 'shield') {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (type === 'refresh') {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0118.8-4.3M22 12.5a10 10 0 01-18.8 4.2" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (type === 'star') {
    return (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={ACCENT} strokeWidth="2" />
      <path d="M12 6v6l4 2" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
    const t = setTimeout(() => setRevealed(true), 132000);
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
          window.checkoutElements.init('salesFunnel').mount('#hotmart-sales-funnel-top');
          window.checkoutElements.init('salesFunnel').mount('#hotmart-sales-funnel-bottom');
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
    <div className="min-h-screen w-full font-sans overflow-x-hidden pb-20 mesh-gradient">
      <div className="mx-auto max-w-[640px] px-4 py-8 text-center">
        
        {/* SEÇÃO 1 — Barra de confirmação */}
        <div className="sticky top-4 z-50 mb-12 md:mb-16 slide-down">
          <div className="flex items-center justify-center gap-2 rounded-xl border border-[#bbf7d0] bg-[#ecfdf5]/80 backdrop-blur-sm px-4 py-3 shadow-sm">
            <CheckIcon className="w-5 h-5 flex-shrink-0" />
            <p className="text-xs font-medium text-green-800 md:text-sm">
              ¡Compra aprobada! Tu acceso a la <span className="font-bold">Frecuencia Límbica</span> está confirmado.
            </p>
          </div>
        </div>

        {/* SEÇÃO 2 — Headline + Sub-headline */}
        <div className="mb-12 md:mb-16 fade-in">
          <h1
            className="font-bold leading-tight text-[clamp(28px,7vw,34px)]"
            style={{ fontFamily: '"Cormorant Garamond", serif', color: TEXT_TITLE }}
          >
            ESPERA — <span style={{ color: ACCENT }}>Tu pedido no está completo</span>
          </h1>
          <p className="mt-4 text-[clamp(15px,4.5vw,18px)] leading-relaxed font-medium text-[#7a7a8f]">
            La Frecuencia Límbica lo trae de vuelta. Pero sin esto, <span className="text-[#dc2626] font-bold">podrías perderlo otra vez.</span>
          </p>
        </div>

        {/* SEÇÃO 3 — Vídeo VSL */}
        <div className="mb-12 md:mb-16 relative -mx-4 md:-mx-0">
          <div className="relative w-full overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(123,45,142,0.06)] md:rounded-2xl border border-white">
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
        <div className={`mt-12 md:mt-16 ${revealed ? 'fade-in-up' : 'hidden'}`}>
          <div className="space-y-12 md:space-y-16">
            
            {/* NOVO: Widget Hotmart Topo (abaixo do vídeo) */}
            <div className="min-h-[100px] mb-8">
              <div id="hotmart-script-anchor"></div>
              <div id="hotmart-sales-funnel-top"></div>
            </div>

            {/* SEÇÃO 4 — Bloco de copy emocional */}
            <div className="text-center px-4">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-[#7b2d8e]/30 to-transparent mb-12" />
              
              <div className="space-y-8 text-[clamp(20px,6vw,26px)] italic leading-[1.4] text-[#1a1a2e] font-semibold" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                <p className="relative">
                  "¿Qué pasa cuando él te escribe y no sabes qué responder?"
                </p>
                <p>
                  "¿Cuando se ven y dices algo que lo arruina todo?"
                </p>
                <p>
                  "¿Cuando vuelve pero a las semanas se pone frío otra vez?"
                </p>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-[#7b2d8e]/30 to-transparent my-12" />
              
              <p className="text-[clamp(16px,4.5vw,18px)] leading-relaxed font-medium text-[#3d3d54] max-w-[520px] mx-auto">
                La frecuencia reactiva el interruptor. Pero lo que tú haces después decide si <span className="font-bold underline decoration-[#7b2d8e]/40 underline-offset-4" style={{ color: ACCENT }}>se queda para siempre</span> o si <span className="text-[#dc2626] font-bold">lo pierdes de nuevo.</span>
              </p>
            </div>

            {/* SEÇÃO 5 — Apresentação da Mentoría (DESTAQUE MÁXIMO) */}
            <div 
              className="relative rounded-[16px] p-7 md:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(123,45,142,0.06)] hover:translate-y-[-2px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05),0_12px_32px_rgba(123,45,142,0.1)] transition-all duration-300"
              style={{ 
                background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #7b2d8e, #c87dd9) border-box',
                border: '2px solid transparent'
              }}
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-gradient-to-r from-[#7b2d8e] to-[#9b3fad] px-4 py-1.5 text-[11px] font-bold tracking-[2px] text-white uppercase shadow-md">
                  INCLUIDA
                </span>
              </div>
              <div className="flex flex-col items-center gap-5 pt-2">
                <div className="flex items-center justify-center">
                  <FeatureIcon type="chat" />
                </div>
                <h2 className="text-[22px] font-bold leading-tight" style={{ color: TEXT_TITLE, fontFamily: '"Cormorant Garamond", serif' }}>
                  Mentoría Privada con la Dra. Paola — 24/7
                </h2>
                <p className="text-base leading-relaxed text-[#7a7a8f]">
                  Acceso directo ilimitado. Te dice exactamente qué escribir, qué decir y cómo actuar en cada momento. A cualquier hora. Cualquier día.
                </p>
              </div>
            </div>

            {/* SEÇÃO 6 — 3 Frecuências extras */}
            <div className="grid grid-cols-1 gap-3">
              <FeatureCard
                icon={<FeatureIcon type="shield" />}
                title="Frecuencia de Blindaje Emocional"
                desc="Mantiene ese interruptor encendido permanentemente para que él nunca más quiera alejarse."
                className="stagger-1"
              />
              <FeatureCard
                icon={<FeatureIcon type="refresh" />}
                title="Frecuencia Anti-Recaída"
                desc="Para cuando él se pone frío o distante. Lo reconecta antes de que la distancia crezca."
                className="stagger-2"
              />
              <FeatureCard
                icon={<FeatureIcon type="star" />}
                title="Frecuencia de Borrado"
                desc="Elimina las heridas del pasado para que la relación empiece limpia, sin rencores ni fantasmas."
                className="stagger-3"
              />
            </div>

            {/* SEÇÃO 7 — Depoimento */}
            <div className="relative overflow-hidden rounded-[16px] bg-[#f5f0f8] p-8 text-left border-none">
              <div className="absolute top-[-10px] left-4 text-[72px] font-serif leading-none opacity-[0.12] text-[#7b2d8e] pointer-events-none" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                "
              </div>
              <div className="relative z-10">
                <p className="text-base italic leading-[1.7] text-[#3d3d54]">
                  "Yo compré la frecuencia y a los 3 días él me escribió. Pero casi lo arruino mandándole mil mensajes. La Dra. Paola me guió paso a paso y hoy llevamos 3 meses juntos. Sin la mentoría lo hubiera perdido esa noche. Lo sé."
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <p className="text-[15px] font-bold text-[#7b2d8e]"> Dolores</p>
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
            <div className="rounded-[16px] bg-white p-8 md:p-10 border-2 border-[#7b2d8e]/15 text-center transition-all pulse-glow">
              <p className="text-sm text-[#7a7a8f] font-medium">
                4 consultas privadas = <span className="line-through text-[#dc2626] decoration-red-600">$400 USD</span>
              </p>
              <div className="mt-4 flex items-start justify-center">
                <span style={{ color: ACCENT }} className="text-[26px] font-bold mt-2">$</span>
                <span className="text-[52px] font-bold text-[#1a1a2e] leading-none" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                  {priceParts.main}
                </span>
                <span style={{ color: ACCENT }} className="text-[26px] font-bold mt-2">.{priceParts.cents}</span>
              </div>
              <p className="text-[13px] text-[#7a7a8f] mt-3 font-medium">
                Acceso <span className="text-[#7b2d8e] font-bold">para siempre</span> · Un único pago
              </p>
              
              {/* SEÇÃO 9 — Widget Hotmart */}
              <div className="mt-8 min-h-[100px]">
                <div id="hotmart-sales-funnel-bottom"></div>
              </div>
            </div>

            {/* SEÇÃO 10 — Garantia */}
            <div className="flex items-center gap-5 rounded-[16px] border border-green-100 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(123,45,142,0.06)]">
              <div className="flex-shrink-0 relative">
                <div className="h-[60px] w-[60px] rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex flex-col items-center justify-center border-[3px] border-[#bbf7d0] shadow-sm">
                  <div className="text-[18px] font-bold text-white leading-none">30</div>
                  <div className="text-[9px] font-bold text-white uppercase tracking-tighter">DÍAS</div>
                </div>
              </div>
              <div className="text-left">
                <p className="text-[#7a7a8f] leading-relaxed text-[13px]">
                  Garantía incondicional de 30 días. Si no sientes ningún cambio, te devuelvo cada centavo. Sin preguntas. <span className="font-bold text-[#1a1a2e]">El riesgo es todo mío.</span>
                </p>
              </div>
            </div>

            {/* SEÇÃO 11 — Urgência final */}
            <div className="rounded-[10px] p-3.5 bg-[#7b2d8e]/[0.04] border border-[#7b2d8e]/12 text-center flex items-center justify-center gap-2">
              <FeatureIcon type="clock" />
              <p className="text-[13px] text-[#7b2d8e] font-semibold">
                Esta oferta solo aparece una vez. Cuando cierres esta página, desaparece para siempre.
              </p>
            </div>

            {/* SEÇÃO 12 — Frase de fechamento emocional */}
            <div className="pt-4 pb-16 text-center">
              <p className="text-[17px] italic leading-relaxed text-[#3d3d54]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                "Ya diste el primer paso para recuperarlo. Este es el paso que asegura que no lo pierdas de nuevo."
              </p>
              <p className="text-[14px] font-bold text-[#7b2d8e] mt-4">— Dra. Paola</p>
            </div>
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
  className = '',
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 rounded-[16px] bg-white p-5 border border-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(123,45,142,0.06)] hover:translate-y-[-2px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05),0_12px_32px_rgba(123,45,142,0.1)] transition-all duration-300 ${className}`}>
      <div className="flex-shrink-0 flex items-center justify-center rounded-full bg-[#7b2d8e]/[0.08] w-9 h-9">{icon}</div>
      <div className="text-left">
        <p className="font-bold text-[15px] text-[#1a1a2e]">{title}</p>
        <p className="text-sm leading-relaxed text-[#7a7a8f]">{desc}</p>
      </div>
    </div>
  );}
