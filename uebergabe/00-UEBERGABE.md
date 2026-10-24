# Übergabe an den Claude mit Zugriff auf Server und Datenbank

Stand 24.10.2026. Gebaut in einer Cloud-Sitzung mit Jasmin, ohne Zugriff auf euer System. Das ist **alles**, was in
dieser Sitzung entstanden ist. Nichts davon ist schon live. Bitte in dieser Reihenfolge lesen.

## Was im Paket ist

| Ordner / Datei | Was es ist | Was du damit tust |
|---|---|---|
| `bestellseite/` | Neue Fassung eurer Bestellseite `website/bestellen/` plus neue Ordner `impressum/`, `datenschutz/`, `recht/`, `schriften/`, `bilder/` | `bestellseite/EINBAU.md` lesen und Punkt für Punkt umsetzen. Supabase-Schlüssel (steht als `XXX` drin) und WhatsApp-Kanal-Link (`KANAL`, auch `XXX`) eintragen. |
| `partner-setup-entwurf/` | Partner-Setup: Landingpage-Vorlage, Partner-Portal, Vertragsentwurf, Druckpreise, Anleitung, offene Fragen, Entscheidungen | Erst `LIESMICH.md`, dann `g-entscheidungen.md`. **Noch nicht live stellen**: Marke, Domain, Anbieter, Preise und Anwaltsprüfung fehlen. |
| `fragen-an-daniel.md` | Alle offenen Fragen D1 bis D30 | An Jasmin bzw. Daniel geben, Antworten später einarbeiten. Die mit **(Start)** zuerst. |

## Bestellseite: was sich geändert hat (Kurzfassung, Details in EINBAU.md)

1. **Land zuerst:** Seite startet mit „Wo wohnst du?“ und Flaggen. Bei `?von=daniel` Schweiz, Deutschland, Österreich, sonst Deutschland zuerst. Plus „Anderes Land“. Erst danach erscheint der Rest.
2. **Produkte:** drei wählbare Kacheln mit Bildern, Reihenfolge K8, emGuarde Go (Mitte, Band „Unsere Empfehlung“), ANESPA DX. Klick aufs Bild öffnet ein Infofenster (Highlights, technische Daten, Fragen).
3. **K8 abwählbar:** vorausgewählt, aber man kann auch nur emGuarde oder ANESPA bestellen. In `daten` steht `k8: "ja"` oder `"nein"`. **Bei „nein“ kein K8-Formular für Enagic.** Haken der Ergänzungen: `zusatz_emguarde`, `zusatz_anespa`.
4. **Preise netto** mit „zzgl. MwSt.“ (K8 DE 4.612 €). Gesamtbetrag nur klein im Block Bezahlung. Rechtlich offen (D25).
5. **Kaufart:** „Als Kunde kaufen“ oder „Kaufen und Vertriebspartner werden“ (Werte weiter `Verbraucher` / `Distributor`).
6. **Optik:** heller Kopf, alle Texte auf einer Kante, eigene Auswahlkreise und Haken (leer = weiß, gewählt = Oliv).
7. **Haken unten:** ein Pflicht-Haken AGB (Link auf `agb-enagic.pdf`, Datei fehlt, D28), freiwilliger Newsletter-Haken `newsletter` → **Double-Opt-in-Mail bauen**. Weitergabe an Enagic steht als Satz unter dem Knopf.
8. **Danke-Seite:** großer Kasten WhatsApp-Kanal „Dein Begleiter für ein gesünderes Leben“ mit Knopf. Vorschau: `bestellen/#danke`.
9. **Impressum und Datenschutz** als Entwürfe mit gelben Lücken (D26, D29). Fußzeile verlinkt darauf.
10. **Schriften selbst gehostet** (`schriften/`), nichts mehr von Google. Am besten auch für Fragebogen und Dashboard.
11. **Telegram-Meldung** um Ergänzungen und „OHNE K8“ erweitern (SQL in EINBAU.md).

## Wichtige Regeln, die Jasmin festgelegt hat

- Keine Heilversprechen, keine Krankheiten, keine Aussagen zu Regeneration, Antioxidation oder Strahlenschutz. Allgemeine Tipps für ein gesünderes Leben sind in Ordnung.
- „Kangen“ und „Kangen Water“ sind eingetragene Marken von Enagic (DPMA geprüft): im Text ja, **nicht in der Domain**.
- Partnerseiten: rechtlicher Hinweis mit Markenvermerk und HMG-Satz steht im Fuß der Vorlage, nicht entfernen.
- Zusatzprodukte (emGuarde, ANESPA) gehen nie automatisch an Enagic, Daniel klärt sie mit dem Kunden.
- Produktbilder sind KI-Bilder mit Enagic-Logo, Genehmigung klären (D7).
- Texte für Kunden positiv und knapp. Keine Selbstverständlichkeiten und keine abwehrenden Hinweise wie „jederzeit abbestellbar“, „deine Nummer sieht niemand“, „kein Gruppenchat“. Was rechtlich nötig ist, gehört in die Datenschutzerklärung.
- Nirgends erwähnen, dass Preise je Land verschieden sind.
- emGuarde soll besonders beworben werden.
- Ziel nach jeder Bestellung: Kunde folgt dem WhatsApp-Kanal (Danke-Seite, Bestätigungsmail).
- Mit Jasmin immer auf Deutsch und kurz antworten.

## Was nicht dabei ist

- Der Dashboard-Umbau (hast du selbst gemacht).
- Echte Schlüssel, Passwörter, Kundendaten.
- Das Wissenspaket (`wissenspaket/`) kam von euch und ist unverändert.
