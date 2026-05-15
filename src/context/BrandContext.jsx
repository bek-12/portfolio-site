import { createContext, useContext, useState, useCallback } from 'react';

const BRAND_KEY = 'bm_brand';

const DEFAULTS = {
  logoImage: null,          // base64 string | null — custom logo image
  companyName: 'BM Software',
  tagline: 'Enterprise Software Solutions',
  accentColor: '#C9A84C',
  fullName: 'Bereket Mebratu',
  email: 'mebratubereket94@gmail.com',
  phone: '+251 944 250 799',
  // NOTE: password is NOT stored here — it lives only in Neon via the API
};

function loadBrand() {
  try {
    const raw = localStorage.getItem(BRAND_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
  } catch {
    return { ...DEFAULTS };
  }
}

function saveBrand(data) {
  localStorage.setItem(BRAND_KEY, JSON.stringify(data));
}

const BrandContext = createContext(null);

export function BrandProvider({ children }) {
  const [brand, setBrand] = useState(loadBrand);

  const updateBrand = useCallback((updates) => {
    setBrand((prev) => {
      const next = { ...prev, ...updates };
      saveBrand(next);
      return next;
    });
  }, []);

  return (
    <BrandContext.Provider value={{ brand, updateBrand }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  return useContext(BrandContext);
}
