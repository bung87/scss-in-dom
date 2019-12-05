import expect from 'expect.js';
import { JSDOM } from 'jsdom';
import { it } from 'mocha';
import now from 'performance-now';
import scssDom from 'scss-dom';
import scssindom from '../src/index';

function scssdom(s: string) {
  const dom = new JSDOM(s);
  const document = dom.window.document;
  scssDom(document);
  const r = document.body.innerHTML;
  return r;
}
// .parent {
//   ...
//   @at-root .child { ... }
// }
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

const html = `
<div class="header other-class">
  <div class="header-menu">
    <div class="header-menu__item">1</div>
    <div class="header-menu__item">2</div>
    <div class="header-menu__item">3</div>
    <div class="header-menu__item">4</div>
  </div>
</div>
`;
const tpl2 = `
<div class="leaflet&-header other-class">
  <div class="@at-root&-menu">
    <div class="&__item">1</div>
    <div class="&__item">2</div>
    <div class="&__item">3</div>
    <div class="&__item">4</div>
  </div>
</div>
`;
const html2 = `
<div class="leaflet-header other-class">
  <div class="leaflet-menu">
    <div class="leaflet-menu__item">1</div>
    <div class="leaflet-menu__item">2</div>
    <div class="leaflet-menu__item">3</div>
    <div class="leaflet-menu__item">4</div>
  </div>
</div>
`;

it('can process simple BEM case template', () => {
  expect(scssindom(tpl).trim()).to.equal(html.trim());
});

it('can process complex scss template', () => {
  expect(scssindom(tpl2).trim()).to.equal(html2.trim());
});

it('time cost less than scssDom', () => {
  const t0 = now();
  scssindom(tpl);
  const t1 = now();
  const t2 = now();
  scssdom(tpl);
  const t3 = now();
  expect(t1 - t0).to.be.lessThan(t3 - t2);
});
