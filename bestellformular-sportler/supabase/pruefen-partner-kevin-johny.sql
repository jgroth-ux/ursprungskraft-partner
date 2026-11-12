-- Prüfung 12.11.2026 (nur lesen, ändert nichts): Ordnet uk_bestellung Bestellungen von Kevin und Johny richtig zu?
-- uk_bestellung sucht den Partner mit: select id from uk_partner where kurz = lower(p->>'von') and aktiv
-- Die Bestellseiten schicken von = 'kevin' bzw. 'johny'. Erwartet: je genau eine Zeile, kurz klein geschrieben, aktiv = true.

select kurz, aktiv, vorname, nachname
  from uk_partner
 where lower(kurz) in ('kevin', 'johny');

-- Ist uk_bestellung noch die Fassung aus umbau-2026-10-20 (Partner nur bei neuen Kunden)? Dann steht hier "partner_id" nur im insert.
select position('partner_id = coalesce' in prosrc) > 0 as partner_auch_bei_bestehenden_kunden
  from pg_proc where proname = 'uk_bestellung';

-- Nach der ersten echten Bestellung: landet sie bei Kevin bzw. Johny?
-- select b.nummer, b.von, k.vorname, k.nachname, p.kurz as partner
--   from uk_bestellungen b left join uk_kunden k on k.id = b.kunde_id left join uk_partner p on p.id = k.partner_id
--  where b.von in ('kevin', 'johny') order by b.erstellt desc;
