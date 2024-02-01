
<img src="https://mdgzcgkcwpqlkyorzjqf.supabase.co/storage/v1/object/public/bucket-packages/347shots_so.png?t=2024-01-29T20%3A27%3A15.754Z" />

## Instalation
******

```bash
npm i -D astro-components-cli
```

or global instalation

```bash
npm i -g astro-components-cli
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

