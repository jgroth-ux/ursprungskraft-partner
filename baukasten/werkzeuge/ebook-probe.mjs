// Baut die Beispiel-E-Books für die lokale Vorschau (website/p/vorschau/ebook-<fassung>.pdf) mit demselben Code
// wie die Edge Function partner-ebook. Aufruf im Ordner werkzeuge: npm install, dann node ebook-probe.mjs
// Liegen echte Vorlagen unter supabase/ebook-vorlagen/ebook-<fassung>.pdf, nimmt es diese, sonst eine Platzhalter-Vorlage.
import * as PDFLib from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { personalisieren } from '../supabase/functions/partner-ebook/empfohlen.js';

const hier = new URL('.', import.meta.url);
const lies = (p) => readFile(new URL(p, hier)).catch(() => null);
const schriften = {
  jost: await lies('../supabase/ebook-schriften/Jost-Medium.ttf'),
  inter: await lies('../supabase/ebook-schriften/Inter-Regular.ttf'),
  interFett: await lies('../supabase/ebook-schriften/Inter-SemiBold.ttf'),
};
const partner = { vorname: 'Max', nachname: 'Muster', rolle: 'Personal Trainer', satz: 'Ich trainiere seit zwölf Jahren. Seit einem Jahr trinke ich nur noch dieses Wasser.', insta: 'max.muster', telefon: null, email: null };
await mkdir(new URL('../website/p/vorschau/', hier), { recursive: true });
for (const fassung of ['neutral', 'sport', 'gesundheit']) {
  const pdf = await personalisieren({ PDFLib, fontkit, vorlage: await lies(`../supabase/ebook-vorlagen/ebook-${fassung}.pdf`), schriften, foto: null,
    partner, fassung, link: `https://mein.ursprungskraft.net/p/max-muster/${fassung}` });
  await writeFile(new URL(`../website/p/vorschau/ebook-${fassung}.pdf`, hier), pdf);
  console.log('gebaut', fassung, Math.round(pdf.length / 1024), 'KB');
}
