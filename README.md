# Převody jednotek · Silozpyt

Česká výuková hra pro 2. stupeň ZŠ. Žák si vybírá jednu nebo více veličin a procvičuje přesné převody. Čtyři obtížnosti, okamžité vysvětlení, skóre, série správných odpovědí, opakování chyb a volitelný tahák. Ovládání myší, dotykem i klávesnicí (Tab, Enter nebo mezerník).

## Výběr veličin

Kartičky a prostředí hry sdílejí barvu veličiny: objem fialovou, délka červenou, hmotnost zelenou, hustota tyrkysovou, čas modrou, rychlost oranžovou a tlak růžovou. Ve smíšeném tréninku se styl mění podle aktuální úlohy. Barvy vyhodnocení odpovědí zůstávají zelené pro správnou a červené pro chybnou odpověď.

Na úvodu jsou zaškrtávací karty s názvem, ikonou a přehledem jednotek. Alespoň jedna musí zůstat vybraná. Ve smíšené hře se vybrané veličiny střídají v náhodně promíchaných blocích: v každém bloku přijde každá právě jednou. Pokud je série kratší než počet zvolených veličin, vejde se do ní jen část z nich.

| Veličina | Jednotky |
| --- | --- |
| Objem | ml, cl, dl, l, hl, mm³, cm³, dm³, m³, občas km³ |
| Délka | mm, cm, dm, m, km |
| Hmotnost | mg, g, dag, kg, q, t |
| Hustota | kg/m³, g/cm³ |
| Čas | s, min, h, den |
| Rychlost | m/s, km/h |
| Tlak | mPa, kPa, MPa, GPa |
| Obsah | mm², cm², dm², m², km² |
| Elektrický proud | mA, A, kA, MA, GA |
| Elektrické napětí | mV, V, kV, MV, GV |
| Elektrický odpor | mΩ, Ω, kΩ, MΩ, GΩ |
| Energie | mJ, J, kJ, MJ, GJ |
| Výkon | mW, W, kW, MW, GW |

Obsah má olivový styl, proud indigový, napětí zlatý, odpor hnědý, energie korálový a výkon šedomodrý. Všechny nové veličiny podporují čtyři obtížnosti, všechny herní módy, smíšený výběr, tahák, skóre, vysvětlení i opakování chyb. Obsah, energie a výkon mají ve všech obtížnostech číselné zadání. U elektrických veličin Expert a Sigma používají digitální multimetr s přiblížením displeje. Je označený jako výukový model: procvičuje i rozsahy mimo možnosti běžných multimetrů. Odečítá se hodnota i předpona jednotky.

U objemu zůstává grafický válec. V Rozjezdu a Výzvě mají ostatní veličiny číselné zadání s odpovídající ikonou. V Expertovi a Sigmě žák odečítá délku z pravítka, hmotnost z analogové váhy, čas z digitálních stopek, rychlost z tachometru a tlak z tlakoměru. Hustota má vždy číselné zadání. Tahák během hry ukazuje vztahy právě řešené veličiny. U tlaku se rozlišuje **mPa** (milipascal) a **MPa** (megapascal), nejde o tutéž jednotku. Den znamená přesně 24 hodin.

## Spuštění

Otevřete `index.html` v aktuálním prohlížeči. Hra funguje i přímo ze souboru a bez internetu. Není potřeba nic instalovat, sestavovat ani se registrovat. Používá jen HTML, CSS, JavaScript a vlastní SVG. Žádné fonty, analytika ani jiné síťové požadavky na externí služby.

## GitHub Pages zdarma

1. Na GitHubu vytvořte **veřejný repozitář** (např. `prevody-objemu`).
2. Nahrajte obsah této složky do kořene repozitáře, včetně `index.html`, `styles.css`, `themes.css`, `volume.js`, `quantities.js`, `instruments.js`, `app.js`, `logo.svg`, `favicon.svg` a prázdného `.nojekyll`. `index.html` nesmí být ve vnořené složce.
3. V repozitáři otevřete **Settings → Pages**.
4. V části **Build and deployment** nastavte **Source: Deploy from a branch**.
5. Zvolte větev **main** a složku **/ (root)**. Klikněte na **Save**.
6. Po dokončení nasazení se v Pages objeví veřejný odkaz, obvykle `https://VASE-JMENO.github.io/prevody-objemu/`.

Další změny souborů ve zvolené větvi se automaticky projeví na webu. Nepotřebujete vlastní doménu, placený hosting ani vlastní workflow. Relativní cesty podporují projektové i hlavní uživatelské GitHub Pages. Samotné vytvoření místních souborů web na internet nezveřejňuje; je nutné provést kroky výše ve vlastním účtu.

## Obtížnosti a pravidla

Pravítko, váha, tachometr a tlakoměr také umožňují přiblížení stupnice kolem ukazatele; stopky zvětšují displej. Detail se zapíná najetím myší, ťuknutím nebo klávesou Enter či mezerníkem na tlačítku přístroje. Odjetí myší, druhé ťuknutí, Escape, kliknutí mimo přístroj nebo nová úloha zvětšení zruší. Zvětšuje se původní SVG bez změny hodnot a rysek.

Najetí myší na válec zobrazí dvojnásobně zvětšený detail hladiny a stupnice. Po odjetí myší se vrátí celý válec. Na mobilu se detail přepíná ťuknutím; klávesnicí pomocí Tab a Enter nebo mezerníku. Escape, klepnutí mimo válec i nová úloha zvětšení zruší. Detail zachovává původní rysky a hodnoty, neprozrazuje výsledek v Expertovi ani Sigmě.

U objemu má ve všech obtížnostech stupnice 10 velkých dílků. Pro každou novou úlohu se rovnoměrně náhodně zvolí dělení každého velkého dílku na 2, 5 nebo 10 menších (celkem 20, 50 nebo 100). Hladina vždy leží přesně na rysce. Ručičková měřidla hmotnosti, rychlosti a tlaku rovněž náhodně střídají dělení na 2, 5 nebo 10 menších dílků. Pravítko má každý velký dílek vždy rozdělený na 10 menších. Měřená hodnota vždy odpovídá rysce. Digitální stopky zobrazují zvlášť dny, hodiny, minuty a sekundy, které je třeba převést do požadované jednotky.

- **Rozjezd:** jednodušší hodnoty, odpovědi ve stejné cílové jednotce.
- **Výzva:** desetinné hodnoty, odpovědi mohou mít různé jednotky dané veličiny.
- **Expert:** náročnější desetinné hodnoty. U objemu se číselný údaj ani velikost dílku pod válcem nezobrazují; žák objem odečítá ze stupnice. Pro čtečky obrazovky je popsaná kapacita, počet dílků a poloha hladiny, nikoli hotový výsledek. U délky, hmotnosti, času, rychlosti a tlaku se hodnota odečítá z příslušného přístroje; hustota, obsah, energie a výkon zůstávají číselné. Proud, napětí a odpor se odečítají z displeje multimetru.
- **Sigma:** obtížnost jako Expert, ale bez možností na výběr. Žák zapisuje výsledek do pole s pevnou cílovou jednotkou. Přijímá se čárka i tečka a mezery mezi tisíci. Enter nebo tlačítko odpověď potvrdí. Neplatný zápis se nezapočítá; platné, ale chybné číslo ano. Výsledek se kontroluje přesným porovnáním zlomků pomocí BigInt, bez zaokrouhlení.

Pro objem Rozjezd zachovává stupnici v ml nebo l a všech 20 kombinací s cílovými jednotkami. Výzva, Expert a Sigma umožňují všech 100 kombinací objemových jednotek včetně převodu na stejnou jednotku. Km³ mají při každém náhodném výběru zdrojové nebo cílové jednotky pravděpodobnost 1 %, ostatních devět jednotek si rovnoměrně dělí zbývajících 99 %. V Rozjezdu jsou km³ pouze cílovou jednotkou. Chybné nabídky používají běžné jednotky bez km³. Dlouhá desetinná čísla jsou vždy uvedena přesně. U nových veličin se cílová jednotka přirozeně liší od zdrojové.

Objemové nabídky mají šest vlastních SVG motivů: lahev, akvárium, bazén, sud, baňku a konev. V každé výběrové úloze objemu jsou čtyři různé motivy. Ostatní veličiny používají příslušnou ikonu. Obrázky jsou symbolické a nejsou v měřítku; rozhodující je uvedené číslo.

### Herní módy

Výsledková stránka zobrazuje kruhový ukazatel úspěšnosti, počet správných odpovědí, počet chyb a nejdelší sérii. Tlačítko „Zkusit chybné příklady znovu“ spustí novou sérii pouze z nezvládnutých zadání. Zachovává stejné jednotky, hladinu, stupnici, nabídky i obtížnost; skóre opakování se počítá od nuly. Opakování lze opakovat, dokud nezbývají chyby. Po bezchybné sérii se tlačítko nenabízí. Také nekonečné procvičování lze po první odpovědi vyhodnotit příslušným tlačítkem; nezodpovězená úloha se do výsledku nepočítá.

Úvodní stránka nabízí **10 příkladů**, **vlastní kladný celý počet** a **nekonečné procvičování**. Konečná série vyžaduje zvolený počet odpovědí a končí přehledem správných odpovědí, procentuální úspěšností a nejdelší sérií. Po poslední odpovědi zůstává vysvětlení viditelné až do kliknutí na „Zobrazit výsledek“. Nekonečný režim umožňuje přeskakovat úlohy.

Odpověď se započítá jen jednou. Správná odpověď zvýší sérii, chyba ji vynuluje. Obtížnost se vybírá na úvodní stránce a po celou hru je pevná. Pro změnu je nutné vrátit se na výběr a zahájit novou hru. Nová hra vynuluje skóre, zachová zvolenou obtížnost. Návrat na výběr hry rozehraný trénink opustí. Data se nikam neposílají ani trvale neukládají. U odpovědi je vždy uveden celý objem nádoby; ilustrace nejsou v měřítku.

## Přesnost a struktura

- `volume.js`: čistá matematická logika, generování úloh, přesné české formátování a vysvětlení.
- `quantities.js`: katalog veličin, generování nových převodů, přesná desetinná aritmetika a promíchávání výběru. Objem deleguje na `volume.js`.
- `instruments.js`: SVG pravítka, váhy, stopek, tachometru, tlakoměru a digitálního multimetru podle přesných údajů z výpočetní logiky.
- `app.js`: rozhraní, objemové SVG ilustrace a stav hry.
- `styles.css`, `themes.css`, `index.html`, `logo.svg`, `favicon.svg`: vzhled a přístupná struktura.
- `tests/volume.test.js`, `tests/audit.test.js`, `tests/quantities.test.js`: automatické testy bez knihoven třetích stran.

Všechny objemy jsou uloženy jako celá mm³ pomocí `BigInt`. Jednotky mají celočíselné faktory: 1 ml = 1 000 mm³, 1 l = 1 000 000 mm³, 1 m³ = 1 000 000 000 mm³. Převody a texty nepoužívají desetinnou aritmetiku typu `Number`. Parser odmítne hodnoty, které by vyžadovaly zaokrouhlení na mm³. Generátor vybírá přesné násobky dílku a zajišťuje čtyři různé skutečné objemy, z nichž právě jeden odpovídá zadání. Nesprávné možnosti vznikají pouze posunem desetinné čárky o jeden až tři řády v přesném objemu a případným vyjádřením v jiné jednotce. Zachovávají tak stejné významové číslice jako zadání (např. 0,6 → 6 → 600), nikdy nepřidávají náhodné jiné číslo. Dělení se použije jen při přesném celočíselném výsledku v mm³. Pouze pozice ve vykresleném SVG používají běžná obrazová desetinná čísla.

## Automatické testy

Nové veličiny také používají celočíselné faktory a `BigInt`. Čas a rychlost se převádějí přes přesné poměry, například 60, 24 a 3,6, nikoli posunem čárky. Generátor vybírá hodnoty s konečným desetinným výsledkem. To platí i pro vysvětlení u nesprávných nabídek. Žák nikdy nemusí hádat požadované zaokrouhlení.

Pokud máte Node.js 18 nebo novější, spusťte z této složky:

```sh
node --test tests/volume.test.js tests/audit.test.js tests/quantities.test.js
```

Žádná instalace balíčků není potřeba. Node je jen pro testy; pro hru a GitHub Pages není nutný. Šestnáct testů zahrnuje úplný průchod 190 380 základními objemovými zadáními, 320 000 náhodných objemových úloh a 301 200 úloh ostatních veličin proti nezávislému etalonu v SI. Kontroluje také všech 8 191 neprázdných výběrů třinácti veličin, číselné odpovědi i přesnost vysvětlení. Podrobný rozsah a výsledky včetně kontroly rozhraní jsou v [KONTROLA.md](KONTROLA.md).

Pro ruční kontrolu otevřete stránku na mobilu i počítači, projděte všechny obtížnosti, správnou a chybnou odpověď, opakovaný klik, novou úlohu a tahák. Vyzkoušejte všechny tři módy, konec série (také vlastní počet 1), odmítnutí neplatného počtu a skrytí objemu v Expertovi. Zkontrolujte také ovládání klávesnicí a zvětšení stránky.
