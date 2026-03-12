# Task 2 -- DevTools CSS Investigation

## Chosen Element

I investigated the clickable color box element with id **`colorBox`**.

This element has **non‑trivial styling** because its final appearance
results from multiple sources:

-   Base CSS rules: `.color-box`
-   Conditional rules: `:hover` and `:active`
-   A dynamic class added after clicking: `.active-box`
-   An **inline `background-color`** set dynamically by JavaScript

Because these rules interact with each other, the final computed style
shown in DevTools is the result of **multiple layers of CSS and runtime
changes**.

------------------------------------------------------------------------

## Property Analysis

### 1. `background-color`

**Computed value (DevTools):**\
Shown as the RGB equivalent of the generated hex color (for example
`rgb(171, 100, 202)`).

**Styles panel:**\
The base rule

``` css
.color-box {
  background: #000000;
}
```

is overridden by the inline style applied by JavaScript:

``` javascript
colorBox.style.backgroundColor = newColor;
```

**Generated CSS location:**\
`dist/assets/index-XXXXX.css`

**Original source:**\
- Base rule → `src/style.css`\
- Final value → `src/main.js`

**Conclusion:**\
The final value does not come from authored CSS alone. Instead,
JavaScript dynamically overrides the stylesheet rule.

------------------------------------------------------------------------

### 2. `border-color`

**Computed value:**\
`rgb(37, 99, 235)`

**Styles panel:**

-   Base rule:

``` css
.color-box {
  border: 2px solid #e5e7eb;
}
```

-   Clicked state:

``` css
.active-box {
  border-color: #2563eb;
}
```

**Generated CSS location:**\
`dist/assets/index-XXXXX.css`

**Original source:**\
`src/style.css`

**Conclusion:**\
The base border from `.color-box` is overridden by `.active-box` after
the element is clicked.

------------------------------------------------------------------------

### 3. `box-shadow`

**Computed value:**\
`0 0 0 4px rgba(37, 99, 235, 0.16)`

**Styles panel:**

Two rules compete:

``` css
.color-box:hover {
  box-shadow: 0 6px 14px rgba(0,0,0,0.12);
}
```

``` css
.active-box {
  box-shadow: 0 0 0 4px rgba(37,99,235,0.16);
}
```

**Generated CSS location:**\
`dist/assets/index-XXXXX.css`

**Original source:**\
`src/style.css`

**Conclusion:**\
Both rules apply, but `.active-box` overrides the hover shadow.

------------------------------------------------------------------------

### 4. `transform`

**Computed value:**\
Displayed in DevTools as a `matrix(...)` value.

**Styles panel:**

``` css
.color-box:hover {
  transform: scale(1.01);
}
```

``` css
.color-box:active {
  transform: scale(0.99);
}
```

**Generated CSS location:**\
`dist/assets/index-XXXXX.css`

**Original source:**\
`src/style.css`

**Conclusion:**\
The computed transform depends on the interaction state. DevTools
converts the `scale()` value into a matrix representation internally.

------------------------------------------------------------------------

### 5. `cursor`

**Computed value:**\
`pointer`

**Styles panel:**

``` css
.color-box {
  cursor: pointer;
}
```

**Generated CSS location:**\
`dist/assets/index-XXXXX.css`

**Original source:**\
`src/style.css`

**Conclusion:**\
This property maps cleanly from the computed value to the authored CSS
rule.

------------------------------------------------------------------------

## Cases Where Mapping Becomes Ambiguous

### 1. Inline Styles from JavaScript

JavaScript sets `background-color` directly on the element. Because
inline styles override stylesheet rules, the final value cannot always
be traced back to the authored CSS file.

### 2. State‑Dependent Rules

Pseudo‑classes such as `:hover` and `:active` change styles depending on
user interaction. The computed value therefore depends on the **current
UI state**, making the mapping less stable.

### 3. Computed Value Transformations

DevTools sometimes shows values in a different format than they were
written. For example:

-   Hex colors become `rgb(...)`
-   `transform: scale()` becomes `matrix(...)`

This means the computed value does not always look identical to the
authored CSS.

------------------------------------------------------------------------

## Summary

This investigation shows that the final computed styles of the color box
result from **multiple interacting sources**:

-   Base CSS rules
-   Pseudo‑class rules (`:hover`, `:active`)
-   Dynamically added classes (`.active-box`)
-   Inline styles set by JavaScript

Because of these layers, tracing a computed value back to the original
authored source can sometimes be straightforward, but in other cases it
becomes indirect or ambiguous.
