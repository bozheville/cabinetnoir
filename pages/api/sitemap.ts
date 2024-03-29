const baseURL = 'http://cabinetnoir.eu';

const paths = [
  'base64',
  'atbash',
  'vigenere',
  'rot13',
  'morse',
  'affine',
  'caesar',
  'enigma',
  'playfair',
];


const actions = ['direct', 'reverse'];
const locales = ['', '/en', '/fr', '/ua'];

const prepareLinksList = () => {
  const urlList = [baseURL];

  for (const path of paths) {
    for (const action of actions) {
      for (const locale of locales) {
        urlList.push(baseURL + locale + '/encoder/' + path + '/' + action);
      }
    }
  }

  return urlList;
};

const linksToXML = (links: string[]) => {
  const date = new Date(parseInt(process.env.NEXT_PUBLIC_RELEASE_DATE, 10));
  const formattedDate = `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}-${`${date.getDate()}`.padStart(2, '0')}`;

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  for (const link of links) {
    xml = xml + `\n  <url>\n    <loc>${link}</loc>\n    <lastmod>${formattedDate}</lastmod>\n  </url>`
  }

  xml = xml + "\n</urlset>\n";
  return xml
};


export default function handler(req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-control', 'stale-while-revalidate, s-maxage=3600');

  res.end(
    linksToXML(
      prepareLinksList()
    )
  );
};
