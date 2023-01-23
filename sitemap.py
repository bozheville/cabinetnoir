from datetime import datetime, timezone

paths = [
  'base64',
  'atbash',
  'vigenere',
  'rot13',
  'morse',
  'affine',
  'caesar',
  'enigma',
  'playfair',
]

actions = ['direct', 'reverse']
locales = ['', '/en', '/fr', '/ua']

def prepareLinksList():
  urlList = ['https://cabinetnoir.eu']

  for path in paths:
    for action in actions:
      for locale in locales:
        urlList.append('https://cabinetnoir.eu' + locale + '/encoder/' + path + '/' + action)

  return urlList


def linksToXML(links):
  xml = """
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">"""

  for link in links:
    xml = xml + "\n  <sitemap>\n    <loc>" + link + "</loc>\n    <lastmod>" + datetime.now(timezone.utc).astimezone().isoformat() + "</lastmod>\n  </sitemap>"

  xml = xml + "\n</sitemapindex>\n"

  return xml

file = open('./public/sitemap/sitemap.xml', 'w');
file.write(linksToXML(prepareLinksList()))
file.close()
