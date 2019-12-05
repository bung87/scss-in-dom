import * as cheerio from 'cheerio';
export default function(html: string) {
  const $ = cheerio.load(html.trim(), {
    xmlMode: true,
  });
  const $root = $.root();
  const $rootEle = $root
    .first()
    .children()
    .first();

  const rootClass = $rootEle.attr('class').split(' ')[0] || '';

  const rootAndIndex = rootClass.indexOf('&');
  const rootNamespace =
    rootAndIndex === -1 ? rootClass : rootClass.split('&')[0];

  const scssElems = $root.find("[class*='&']");
  scssElems.each((_, elem) => {
    const $elem = $(elem);
    const $parent = $elem.parent();

    const originClass = $elem.attr('class');

    let className;
    if ($parent.length > 0) {
      const parentClass = $parent.attr('class').split(' ')[0];
      className = $elem.attr('class').split(' ')[0] || '';
      if (className.indexOf('@at-root&') !== -1) {
        $elem.attr('class', originClass.replace('@at-root&', rootNamespace));
      } else {
        className = parentClass;
        $elem.attr('class', originClass.replace(/&/g, className));
      }
    } else {
      className = '';
      $elem.attr('class', originClass.replace(/&/g, className));
    }
  });
  return $.root().html() || '';
}
