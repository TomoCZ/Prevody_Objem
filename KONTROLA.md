# Kontrola matematické správnosti

Výsledek kontroly: ve zkontrolovaných zadáních, převodech, stupnicích a označování odpovědí nebyla nalezena chyba.

## Úplný průchod základními zadáními objemu

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

## Rozšíření o šest dalších veličin

Test `tests/quantities.test.js` prověřuje **121 200 zadání** délky, hmotnosti, hustoty, času, rychlosti a tlaku: všech 101 dvojic jednotek (včetně stejné zdrojové a cílové jednotky při přímém testování), čtyři obtížnosti a 300 variant pro každou dvojici a obtížnost. Samostatný etalon používá racionální faktory v metrech, kilogramech, kg/m³, sekundách, m/s a pascalech. Neopírá se o faktory výpočetního modulu hry.

Ověřuje správnost převodů, jedinou správnou odpověď, skutečnou odlišnost chybných možností, rovnosti ve vysvětleních a odpovědi v Sigmě. Samostatně kontroluje zásadní vztahy včetně 1 m/s = 3,6 km/h, 1 den = 86 400 s a rozdílu mezi mPa a MPa. Generátor i chybné nabídky vybírají jednotky tak, aby správné vysvětlení nevyžadovalo periodické číslo ani zaokrouhlení.

Míchání bylo ověřeno pro **všech 127 neprázdných kombinací sedmi veličin**. Každý úplný blok obsahuje právě všechny zvolené veličiny, žádnou cizí.

V prohlížeči bylo ověřeno dalších **1 414 odpovědí** nových veličin: všechny uvedené dvojice jednotek, každá pozice nabídky v prvních třech obtížnostech a správná i chybná odpověď v Sigmě. Kontrola zahrnovala zelené a červené označení, skóre, vysvětlení, prázdný výběr, smíšenou hru všech sedmi veličin a opakování přesně chybných zadání v Expertovi i Sigmě. Zobrazení bylo zkontrolováno na šířkách 320, 390 a 1121 px. Původní kontrola všech herních módů, Sigmy, zvětšení a objemových úloh po rozšíření také prošla.

## Měřicí přístroje a společné rozložení

Po přidání přístrojů byla kontrola 1 414 odpovědí zopakována. V Expertovi a Sigmě se ověřovalo skrytí číselného zadání (kromě hustoty), počet rysek, všech 11 číselných popisků stupnice a poloha ukazatele proti hodnotě úlohy. U stopek se nezávisle skládaly dny, hodiny, minuty a sekundy zpět na měřený čas. Opakování chybných zadání zachovalo i totožné měřidlo.

Výpočetní testy navíc kontrolují přesnou rovnost hodnoty a polohy na stupnici, kapacity a součtu dílků, náhodné dělení na 2, 5 nebo 10 u hmotnosti, rychlosti a tlaku, pevné dělení na 10 u délky a přesné složení času na stopkách. U každého ručičkového měřidla v Expertovi i Sigmě test ověřuje také výskyt všech tří dělení. Kontrola všech 121 200 zadání zahrnuje tyto nové podmínky.

Před úpravou byl pořízen referenční snímek objemové hry. Pro všech sedm veličin v Expertovi i Sigmě byly následně pořízeny snímky na šířkách 320, 390 a 1121 px. Automatická kontrola ověřila pravé zarovnání tlačítka další úlohy a nepřítomnost vodorovného přetečení. Vybrané snímky byly také vizuálně prohlédnuty. Nejde o vyčerpávající výčet všech možných náhodných měřidel, ale o systematickou kontrolu všech směrů převodu doplněnou mnoha generovanými variantami.

## Opakování výpočetních kontrol

### Rozšíření na třináct veličin

Aktuální test `quantities.test.js` prověřuje **301 200 zadání** všech dvanácti veličin mimo objem: **251 dvojic jednotek**, čtyři obtížnosti a 300 variant. Nezávislý etalon byl rozšířen o m², ampéry, volty, ohmy, jouly a watty. Ověřuje také, že proud, napětí a odpor mají v Expertovi a Sigmě multimetr, zatímco obsah, energie a výkon zůstávají bez přístroje. Test míchání prošel **všemi 8 191 neprázdnými kombinacemi třinácti veličin**.

Prohlížečová kontrola nového rozšíření prošla **2 100 odpověďmi**: všech 150 dvojic nových jednotek, každá pozice nabídky ve třech obtížnostech a správná i chybná odpověď v Sigmě. Ověřila údaje na displeji multimetru včetně předpon, číselná zadání ostatních veličin, tahák, označení odpovědí, skóre, vysvětlení, odmítnutí neplatného vstupu a ochranu před opakovaným započtením. Smíšená hra všech 13 veličin a opakování chybných úloh prošly v Expertovi i Sigmě. Nové hry byly kontrolovány na šířkách 320, 390 a 1121 px včetně pravého zarovnání další úlohy, barev a zoomu multimetru. Bez chyb JavaScriptu.

Zvětšení všech pěti nových přístrojů bylo ověřeno v prohlížeči v Expertovi i Sigmě na počítači a mobilu: najetí a odjetí myší, opakované ťuknutí, Enter, mezerník, Escape a reset při nové úloze. Kontrola potvrzuje, že se mění pouze výřez SVG, nikoli rysky, popisky ani ukazatel, a nevzniká vodorovné přetečení stránky.

```sh
node --test tests/volume.test.js tests/audit.test.js tests/quantities.test.js
```

Výsledek: **16 testů prošlo, 0 selhalo**. Testy nevyžadují instalaci balíčků. Prohlížečové kontroly byly provedeny samostatnými místními ověřovacími skripty, které nejsou součástí webu.
