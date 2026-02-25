/// <reference types="astro/client" />

declare module '*.yaml' {
  const value: unknown;
  export default value;
}

interface Window {
  __FAVICONS__?: Record<string, string>;
  __TITLES__?: Record<string, string>;
  __INITIAL_MODE__?: import('@/types').Mode;
}
