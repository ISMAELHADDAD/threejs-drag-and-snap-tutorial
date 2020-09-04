# Part 1 - Introduction

### TL;DR

Setup:

- Install [**Nuxt.js**](https://nuxtjs.org/) web framework.
- Install [**Vuetify**](https://vuetifyjs.com) UI framework.
- Install [**Three.js**](https://threejs.org/) web 3D framework.

## Setup

### Install Nuxt.js

For quickly bootstrapping a new [**Nuxt.js**](https://nuxtjs.org/) project, we can use the following command:

`$yarn create nuxt-app three-js-plug-and-snap-tutorial`

Make sure to select `Vuetify.js` as your UI Framework. With this option, the project is going to bootstrap with a lot of boilerplate code. Get rid of it.

**layout/default.vue**

```vue
<template>
  <div>
    <nuxt />
  </div>
</template>
```

**pages/index.vue**

```vue
<template>
  <v-app> Hello World </v-app>
</template>
```

Also, I don't like the dark theme. In **nuxt.config.js**, change `dark` to _false_.

**nuxt.config.js**

```js
vuetify: {
  theme: {
    dark: false,
  },
},
```

### Install Three.js

Finally, we're going to add [**Three.js**](https://threejs.org/) to the project.

`$yarn add three@0.119.1`

## Conclusion

That's it for the initial setup of the project. Let's continue to [Part 2 - Create basic scene](../part-2).
