export type SupportedIntegrations = "react" | "vuejs" | "svelte";

export type ValidExtensions = ".tsx" | ".astro" | ".svelte" | ".vue" | ".jsx";

export type AllIntegrations = SupportedIntegrations | "astro";

export type Config = {
  /**
   * Indica si se debe realizar una pregunta.
   *
   * @description Este parámetro controla si se realizará preguntas al realizar determinadas acciones.
   * @default true
   */
  questionMe: boolean;

  /**
   * Plantilla para archivos React JSX.
   *
   * @description Esta propiedad permite especificar una plantilla para archivos React JSX.
   */
  reactJsxTemplate?: string;

  /**
   * Plantilla para archivos React TSX.
   *
   * @description Esta propiedad permite especificar una plantilla para archivos React TSX.
   */
  reactTsx?: string;

  /**
   * Plantilla para archivos Vue.js JS.
   *
   * @description Esta propiedad permite especificar una plantilla para archivos Vue.js JS.
   */
  vueJSTemplate?: string;

  /**
   * Plantilla para archivos Vue.js TS.
   *
   * @description Esta propiedad permite especificar una plantilla para archivos Vue.js TS.
   */
  vueTSTemplate?: string;

  /**
   * Plantilla para archivos Svelte JS.
   *
   * @description Esta propiedad permite especificar una plantilla para archivos Svelte JS.
   */
  svelteJSTemplate?: string;

  /**
   * Plantilla para archivos Svelte TS.
   *
   * @description Esta propiedad permite especificar una plantilla para archivos Svelte TS.
   */
  svelteTSTemplate?: string;
};
