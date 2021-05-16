# Roving UX React

<div>
  <img src="https://img.shields.io/npm/dt/roving-ux-react.svg" alt="Total Downloads">
  <img src="https://img.shields.io/npm/v/roving-ux-react.svg" alt="Latest Release">
  <img src="https://img.shields.io/npm/l/roving-ux-react.svg" alt="License">
</div>

<br />

> Turns tedious tab UX into a controlled and stateful experience

<br />

**Inspired by** [roving-ux by Adam Argyle](https://github.com/argyleink/roving-ux)  
**Learn more** in [this article by Rob Dodson on web.dev](https://web.dev/control-focus-with-tabindex/)  
**Try it** at this [GUI Challenge](https://gui-challenges.web.app/media-scroller/dist/) (use `tab` then `left || right` arrows)

<br />

###### Features & Why

1️⃣ User's shouldn't need to tab through each item in a list to see the next list  
2️⃣ Providing keyboard list UX should be easy  
3️⃣ Maintaining the last focused element should be easy

<br />

###### Getting Started

### Installation

```bash
npm i roving-ux-react
```

<br />

### Importing

```js
// import from NPM
import { useRovingIndex } from 'roving-ux-react'
```

<br />

###### Syntax

### Quick API Overview

```js
const {
  activeIndex, // index of the currently focused target
  roverProps, // props to assign to the rover
  getTargetProps, // getter function for each targets props, initialize with index
} = useRovingIndex()

const {
  tabIndex, // tabIndex for rover element, should always be -1
  onFocus, // focus handler to listen for nested elements receiving focus
  onKeyDown, // key event handler to listen for arrow key navigation
} = roverProps
```

### Example Usage

```js
import { useRovingIndex } from 'roving-ux-react'

// just one roving ux container
// roving-ux-react will use each child initialized with `getTargetProps` as target

function Carousel() {
  const { roverProps, getTargetProps } = useRovingIndex()

  return (
    <ul {...roverProps}>
      <li {...getTargetProps(0)}>Item #1</li>
      <li {...getTargetProps(1)}>Item #2</li>
      <li {...getTargetProps(2)}>Item #3</li>
    </ul>
  )
}
```
