import React, { useEffect, useMemo, useState } from 'react';

type CheckoutInitOptions = Record<string, unknown>;
type CheckoutElementsAPI = {
  init: (kind: 'salesFunnel' | string, options?: CheckoutInitOptions) => {
    mount: (selector: string) => void
  };
};

const ACCENT = '#7b2d8e';
const BG = '#faf8fc';

function CheckIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#22c55e" opacity="0.15" />
      <path d="M6 12.5l4 3.5 8-9" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FeatureIcon({ type }: { type: 'private' | 'shield' | 'anti' | 'erase' }) {
  if (type === 'private') {
    return (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3l7 3v5c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-3z" stroke={ACCENT} strokeWidth="1.8" fill="none" />
        <path d="M9.5 12a2.5 2.5 0 015 0v1.5h-5V12z" stroke={ACCENT} strokeWidth="1.8" />
      </svg>
    );
  }
  if (type === 'shield') {
    return (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3l7 3v5c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-3z" stroke={ACCENT} strokeWidth="1.8" />
        <path d="M8.5 12.5l2.5 2.5 4.5-5" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (type === 'anti') {
    return (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 12a8 8 0 1016 0" stroke={ACCENT} strokeWidth="1.8" />
        <path d="M12 4v8l4 2" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="14" width="12" height="6" rx="2" stroke={ACCENT} strokeWidth="1.8" />
      <rect x="13" y="10" width="8" height="6" rx="2" stroke={ACCENT} strokeWidth="1.8" />
      <path d="M5 17l3 3" stroke={ACCENT} strokeWidth="1.8" />
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

  const priceParts = useMemo(() => {
    const main = '19';
    const cents = '90';
    return { main, cents };
  }, []);

  const NO_DELAY = import.meta.env.DEV === true
    || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('fast'))
    || import.meta.env.VITE_UPSELL_NO_DELAY === 'true';

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
    if (import.meta.env.DEV) return;
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
        document.head.appendChild(s);
      });

    ensureHotmartScript()
      .then(() => {
        if (window.checkoutElements && typeof window.checkoutElements.init === 'function') {
          window.checkoutElements.init('salesFunnel').mount('#hotmart-sales-funnel');
          setMountedWidget(true);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }, [revealed, mountedWidget]);

  useEffect(() => {
    const existing = document.getElementById('vturb-player-script');
    if (existing) return;
    const s = document.createElement('script');
    s.id = 'vturb-player-script';
    s.src = 'https://scripts.converteai.net/26b395b5-c65f-4a7a-b43b-982b855ae935/players/69c5e2455493e88bf0fe0a18/v4/player.js';
    s.async = true;
    document.head.appendChild(s);
  }, []);

  return (
    <div style={{ background: BG }} className="min-h-screen w-full">
      <div className="mx-auto max-w-[640px] px-4 py-5 text-center">
        <div className="sticky top-0 z-20">
          <div className="flex items-center gap-2 rounded-md border border-green-500/50 bg-green-50 px-3 py-2 shadow-sm">
            <CheckIcon />
            <p className="text-sm text-green-700">
              ¡Compra aprobada! Tu acceso a la <span className="font-semibold">Frecuencia Límbica</span> está confirmado.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <div className="mx-auto max-w-[640px] px-1">
            <h1
              className="font-extrabold leading-tight text-neutral-900 text-[clamp(22px,6vw,36px)]"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Pero{' '}
              <span className="inline-block rounded-md px-2 py-0.5 bg-red-50 text-[#dc2626] tracking-wide">
                NO CIERRES ESTA PÁGINA
              </span>
            </h1>
            <p className="mt-2 text-neutral-700 text-[clamp(14px,4.2vw,18px)] leading-snug">
              La Dra tiene una <span style={{ color: ACCENT }} className="font-semibold">advertencia</span> para ti que puede cambiar
              todo tu resultado.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="relative w-full rounded-xl border overflow-hidden" style={{ borderColor: `${ACCENT}33` }}>
            <div className="relative w-full" style={{ paddingBottom: '177.78%' }}>
              <div className="absolute inset-0 flex items-center justify-center bg-white">
                <vturb-smartplayer
                  id="vid-69c5e2455493e88bf0fe0a18"
                  style={{ display: 'block', margin: '0 auto', width: '100%', maxWidth: '640px', height: '100%' }}
                />
              </div>
            </div>
          </div>
          <div className="mt-4 rounded-lg border px-3 py-2 flex items-center justify-center gap-2" style={{ borderColor: `${ACCENT}66`, background: `${ACCENT}0F` }}>
            <HourglassIcon className="w-4 h-4" />
            <p className="text-sm" style={{ color: ACCENT }}>
              Esta oferta exclusiva expira cuando cierres esta página
            </p>
          </div>
          <div className="mt-4 rounded-xl border shadow-sm p-4 text-center" style={{ borderColor: `${ACCENT}66` }}>
            <p className="text-sm text-neutral-600">
              4 consultas privadas = <span className="line-through text-[#dc2626] font-medium">$400 USD</span>
            </p>
            <div className="mt-2 flex items-baseline justify-center gap-2">
              <span style={{ color: ACCENT }} className="text-2xl font-bold">$</span>
              <span className="text-5xl font-extrabold text-neutral-900" style={{ fontFamily: '"Playfair Display", serif' }}>
                {priceParts.main}
              </span>
              <span style={{ color: ACCENT }} className="text-2xl font-bold">.{priceParts.cents}</span>
            </div>
            <p className="text-sm text-neutral-600 mt-1">Acceso para siempre · Un único pago</p>
          </div>
          <div className="mt-4">
            <div id="hotmart-sales-funnel"></div>
          </div>
        </div>
        
        <div className={`mt-6 ${revealed ? 'fade-in' : 'hidden'}`}>
          <div className="space-y-6">
            <div className="relative mx-auto max-w-[640px] rounded-2xl border p-6 text-center" style={{ borderColor: '#16a34a66', background: '#dff7ea' }}>
              <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                <div className="h-12 w-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center shadow-sm">
                  <div className="leading-tight text-center">
                    <div className="text-base font-extrabold">30</div>
                    <div className="text-[10px] font-extrabold">DÍAS</div>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-neutral-700">
                Garantía incondicional de 30 días. Si no sientes ningún cambio, te devuelvo cada centavo. Sin preguntas. El riesgo es todo mío.
              </p>
            </div>
            <div className="text-center">
              <p
                className="text-2xl md:text-3xl text-neutral-900"
                style={{ fontFamily: '"Playfair Display", serif' }}
              >
                La Frecuencia Límbica lo trae de vuelta.
              </p>
              <p
                className="text-2xl md:text-3xl font-semibold"
                style={{ color: ACCENT, fontFamily: '"Playfair Display", serif' }}
              >
                Esto hace que se quede para siempre.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <FeatureCard
                icon={<FeatureIcon type="private" />}
                title="Mentoría Privada con la Dra. Paola — 24/7"
                desc="Acceso directo ilimitado. Te guía en tiempo real qué decir, qué hacer y cómo actuar en cada momento."
              />
              <FeatureCard
                icon={<FeatureIcon type="shield" />}
                title="Frecuencia de Blindaje Emocional"
                desc="Mantiene ese interruptor encendido permanentemente para que él nunca más quiera alejarse."
              />
              <FeatureCard
                icon={<FeatureIcon type="anti" />}
                title="Frecuencia Anti-Recaída"
                desc="Para cuando él se pone frío o distante. Lo reconecta antes de que la distancia crezca."
              />
              <FeatureCard
                icon={<FeatureIcon type="erase" />}
                title="Frecuencia de Borrado"
                desc="Elimina las heridas del pasado para que la relación empiece limpia, sin rencores ni fantasmas."
              />
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full mx-auto overflow-hidden" style={{ background: `${ACCENT}15` }}>
                <img
                  src="https://i.imgur.com/C4JGtMM.jpg"
                  alt="Dra. Paola"
                  className="h-12 w-12 rounded-full object-cover"
                  style={{ border: `2px solid ${ACCENT}33` }}
                />
              </div>
              <div className="text-center">
                <p className="font-semibold text-neutral-900">Dra. Paola</p>
                <p className="text-xs text-neutral-600">Neuropsicóloga — Especialista en Reconexión Emocional</p>
              </div>
            </div>
            <p className="text-neutral-700">
              Todo mi conocimiento clínico y experiencia con cientos de pacientes, disponible para ti las 24 horas.
            </p>

            

            

            {/* Para pruebas sin delay: descomente la línea abajo */}
            {/* setTimeout(() => { setRevealed(true); }, 0); */}
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
    <div className="flex flex-col items-center text-center gap-2 rounded-xl bg-white p-4 shadow-sm" style={{ border: `1px solid ${ACCENT}33` }}>
      <div className="flex items-center justify-center">{icon}</div>
      <div>
        <p className="font-semibold text-neutral-900">{title}</p>
        <p className="text-sm text-neutral-600">{desc}</p>
      </div>
    </div>
  );
}
