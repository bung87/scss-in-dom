import * as cheerio from 'cheerio';
export default function(html: string) {
  const $ = cheerio.load(html.trim(), {
    xmlMode: true,
  });
  const scssElems = $.root().find("[class*='&']");
  scssElems.each((_, elem) => {
    const className =
      $(elem.parentNode)
        .attr('class')
        .split(' ')[0] || '';
    const $elem = $(elem);
    const originClass = $elem.attr('class');
    $elem.attr('class', originClass.replace(/&/g, className));
  });
  return $.root().html() || '';
}
