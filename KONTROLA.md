# Kontrola matematické správnosti

Výsledek kontroly: ve zkontrolovaných zadáních, převodech, stupnicích a označování odpovědí nebyla nalezena chyba.

## Úplný průchod základními zadáními

Test `tests/audit.test.js` systematicky prošel **190 380 základních zadání**: všechny čtyři obtížnosti, všechny povolené zdrojové a cílové jednotky, všechny kapacity válce, všechna tři dělení a každou generovatelnou polohu hladiny. Každý případ se ověřuje proti samostatnému etalonu jednotek a nezávislému čtení desetinného čísla, nikoli pouze proti parseru nebo převodním faktorům hry.

Ověřeno:

- Hladina odpovídá přesnému násobku dílku a leží uvnitř stupnice.
- Popisky všech hlavních rysek mají správné hodnoty.
- Vypsané hodnoty ve všech jednotkách zachovávají objem, včetně km³.
- Výběrová úloha má právě jednu správnou odpověď a čtyři odlišné skutečné objemy.
- Označení správné i každé nesprávné možnosti odpovídá nezávislému výpočtu.
- Vysvětlení obsahuje správnou rovnost i správný směr a faktor převodu.
- Sigma přijme přesný výsledek a odmítne i výsledek lišící se pouze o 1 mm³.

Základním zadáním se rozumí obtížnost, jednotky, kapacita, dělení a poloha hladiny. Různá pořadí obrázků a všechny kombinace náhodných chybných nabídek nejsou jednotlivě vyjmenovány. Jejich správnost dále kontroluje test všech povolených chybných násobků ve všech jednotkách a pozicích a původní baterie náhodných úloh.

## Kontrola skutečného rozhraní

V prohlížeči Edge bylo nezávisle zkontrolováno **880 výběrových odpovědí** (každá ze čtyř pozic, všechny povolené směry převodu a tři výběrové obtížnosti) a **200 číselných odpovědí v Sigmě** (správná a chybná odpověď pro všech 100 směrů převodu).

Kontrola prošla skutečnými obsluhami kliknutí a odeslání formuláře. Ověřila zelené a červené označení, zpětnou vazbu, skóre a ochranu před opakovaným započtením. U všech **1 080 zobrazení** byly také ověřeny popisky SVG stupnice, poloha hladiny a její přítomnost ve zvětšeném výřezu. Nebyla zaznamenána chyba JavaScriptu.

## Opakování výpočetních kontrol

```sh
node --test tests/volume.test.js tests/audit.test.js
```

Výsledek: **12 testů prošlo, 0 selhalo**. Součástí je také dosavadní kontrola 320 000 náhodných úloh, pokrytí kombinací a validace vstupu Sigmy. Testy nevyžadují instalaci balíčků. Prohlížečová kontrola byla provedena samostatným místním ověřovacím skriptem, který není součástí webu.
