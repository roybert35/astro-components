  

<img src="https://mdgzcgkcwpqlkyorzjqf.supabase.co/storage/v1/object/public/bucket-packages/347shots_so.png?t=2024-01-29T20%3A27%3A15.754Z" />

  
## Descripción:

El CLI astro-cli-components es una herramienta de línea de comandos diseñada para simplificar y acelerar la creación de componentes en proyectos basados en Astro, un framework web ultrarrápido.


### Características Principales:

#### Generación Rápida de Componentes:


Permite a los desarrolladores crear nuevos componentes rápidamente con una sola línea de comando.

  

#### Estructura y Archivos Predefinidos:

  

Genera automáticamente la estructura de archivos estándar para un componente en Astro, incluyendo archivos HTML, CSS y JS.

  

## Instalation

******

```bash

 npm i -D astro-components-cli

```

or

******

```bash

 bun i -D astro-components-cli

```

or

******

```bash

 pnpm i -D astro-components-cli

```

  

## Global instalation

  

```bash

npm i -g astro-components-cli

```

or

```bash

bun install -g astro-components-cli

```

or

```bash

pnpm install -g astro-components-cli

```

  
  

## Usage

************

```bash

npx acc [NameComponent]

```

  

### Parameters

  

[NameComponent] Name of the component to be created

  

If you pass a name after the command it wil create a component with this name.

  

**Note:** if you pass an absolute path like src/components/layout/Header2 with the name of the

component. The CLI will understand that you want to create the component on this path and it will create the component on src/components/layout. This will be more explained with an image.

  

## Examples

******

### Normal create component

  

```bash

npx acc Header

```

  

It will prompt you to create your component and create the file additional information

  

### Create component with absolute path

  

```bash

npx acc src/components/layout/Header2

```

  

Then it will create you the component like so:

  

<img src="https://mdgzcgkcwpqlkyorzjqf.supabase.co/storage/v1/object/public/bucket-packages/file_explorer.png" />

  
  

```

> [!CAUTION]

> This CLI won't work on a workspace that isn't from Astro framework  

```

## Other configurations

You can create a config file named <b>astro-components.json</b> to define configs of the CLI.

| Parameter 	| Type 	| Description 	| Default 	|
|---	|---	|---	|---	|
| questionMe* 	| boolean 	| parameter to ask you if you want to create the component. 	| true 	|
| reactJsxTemplate 	| string 	| parameter to define your custom React with JavaScript template. 	| templateDefaultForReactJsx 	|
| reactTsx 	| string 	| parameter to define custom React With TypeScript template. 	| templateDefaultForReactTsx 	|
| vueJSTemplate 	| string 	| parameter to define your custom VueJS template. 	| templateDefaultForVueJs 	|
| vueTSTemplate 	| string 	| parameter to define your custom Vue with TypeScript template. 	| templateDefaultForVueTs 	|
| svelteJSTemplate 	| string 	| parameter to define your custom Svelte JavaScript template. 	| templateDefaultForSvelteJS 	|
| svelteTSTemplate 	| string 	| parameter to define your custom Svelte TypeScript template. 	| templateDefaultForSvelteTS 	|

*Parameters requireds