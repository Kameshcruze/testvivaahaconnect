/// <reference types="vite/client" />

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.PNG' {
  const content: string;
  export default content;
}
