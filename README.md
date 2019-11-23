# sind  

scss in dom

## usage  

``` js
const sid = require('sind');
const tpl = `
<div class="header other-class">
  <div class="&-menu">
    <div class="&__item">1</div>
    <div class="&__item">2</div>
    <div class="&__item">3</div>
    <div class="&__item">4</div>
  </div>
</div>
`;
const s = sid(tpl)
```

turns to 
``` js
const s = "<div class=\"header other-class\">\n  <div class=\"header-menu\">\n    <div class=\"header-menu__item\">1</div>\n    <div class=\"header-menu__item\">2</div>\n    <div class=\"header-menu__item\">3</div>\n    <div class=\"header-menu__item\">4</div>\n  </div>\n</div>";
```