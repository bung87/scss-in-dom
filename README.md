# sind  [![npm: version][npm-version]](https://www.npmjs.com/package/sind) ![David: dependencies](https://flat.badgen.net/david/dep/bung87/sind) ![npm: license](https://flat.badgen.net/npm/license/sind)

write scss BEM style in template

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
sid(tpl)
```

turns to 
``` js
"<div class=\"header other-class\">\n  <div class=\"header-menu\">\n    <div class=\"header-menu__item\">1</div>\n    <div class=\"header-menu__item\">2</div>\n    <div class=\"header-menu__item\">3</div>\n    <div class=\"header-menu__item\">4</div>\n  </div>\n</div>";
```
more complex case
``` html
<div class="leaflet&-header other-class">
  <div class="@at-root&-menu">
    <div class="&__item">1</div>
    <div class="&__item">2</div>
    <div class="&__item">3</div>
    <div class="&__item">4</div>
  </div>
</div>
```

## with rollup compile at build time  

[rollup-plugin-sind](https://github.com/bung87/rollup-plugin-sind)

## Acknowledgments

sind was inspired by [scss-dom](https://github.com/aykutkardas/scss-dom)

[npm-version]:https://flat.badgen.net/npm/v/sind