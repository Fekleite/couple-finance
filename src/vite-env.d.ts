/// <reference types="vite/client" />

declare module "*.sql?raw" {
  const source: string;
  export default source;
}
