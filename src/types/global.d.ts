import type * as React from 'react';
declare global {
  interface Window {
    checkoutElements?: {
      init: (mode: string, options?: Record<string, unknown>) => {
        mount: (selector: string) => void
      }
    }
  }
  namespace JSX {
    interface IntrinsicElements {
      'vturb-smartplayer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
    }
  }
}

export {};
