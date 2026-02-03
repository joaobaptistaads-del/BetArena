import { useEffect, useMemo, useState } from 'react';

type GeoState = {
  country: string | null;
  currency: string;
  locale: string;
  paymentHint: string;
};

type GeoResponse = {
  country?: string;
  currency?: string;
  locale?: string;
};

const getLocale = () => {
  if (typeof navigator === 'undefined') {
    return 'pt-BR';
  }
  return navigator.language || 'pt-BR';
};

const getDefaults = (locale: string): GeoState => {
  const isBrazil = locale.toLowerCase().startsWith('pt-br');
  return {
    country: isBrazil ? 'BR' : null,
    currency: isBrazil ? 'BRL' : 'USD',
    locale,
    paymentHint: isBrazil ? 'Pix / Mercado Pago' : 'PayPal / Cartão',
  };
};

export default function useGeoLocation() {
  const locale = useMemo(() => getLocale(), []);
  const [state, setState] = useState<GeoState>(() => getDefaults(locale));

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const response = await fetch('/api/geo', { cache: 'no-store' });
        if (!response.ok) {
          return;
        }
        const data = (await response.json()) as GeoResponse;
        if (!isMounted) {
          return;
        }

        const resolvedLocale = data.locale ?? locale;
        const isBrazil = (data.country ?? '').toUpperCase() === 'BR' ||
          resolvedLocale.toLowerCase().startsWith('pt-br');

        setState({
          country: data.country ?? (isBrazil ? 'BR' : null),
          currency: data.currency ?? (isBrazil ? 'BRL' : 'USD'),
          locale: resolvedLocale,
          paymentHint: isBrazil ? 'Pix / Mercado Pago' : 'PayPal / Cartão',
        });
      } catch {
        // fallback mantido
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [locale]);

  return state;
}
