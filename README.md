# Převody objemu

Česká výuková hra pro 2. stupeň ZŠ. Žák čte množství vody ve válci a vybírá jednu ze čtyř nádob se shodným objemem, nebo v Sigmě zadává výsledek číslem. Čtyři obtížnosti, okamžité vysvětlení, skóre, série správných odpovědí a volitelný tahák. Ovládání myší, dotykem i klávesnicí (Tab, Enter nebo mezerník).

## Spuštění

Otevřete `index.html` v aktuálním prohlížeči. Hra funguje i přímo ze souboru a bez internetu. Není potřeba nic instalovat, sestavovat ani se registrovat. Používá jen HTML, CSS, JavaScript a vlastní SVG. Žádné fonty, analytika ani jiné síťové požadavky na externí služby.

## GitHub Pages zdarma

1. Na GitHubu vytvořte **veřejný repozitář** (např. `prevody-objemu`).
2. Nahrajte obsah této složky do kořene repozitáře, včetně `index.html`, `styles.css`, `volume.js`, `app.js`, `favicon.svg` a prázdného `.nojekyll`. `index.html` nesmí být ve vnořené složce.
3. V repozitáři otevřete **Settings → Pages**.
4. V části **Build and deployment** nastavte **Source: Deploy from a branch**.
5. Zvolte větev **main** a složku **/ (root)**. Klikněte na **Save**.
6. Po dokončení nasazení se v Pages objeví veřejný odkaz, obvykle `https://VASE-JMENO.github.io/prevody-objemu/`.

Další změny souborů ve zvolené větvi se automaticky projeví na webu. Nepotřebujete vlastní doménu, placený hosting ani vlastní workflow. Relativní cesty podporují projektové i hlavní uživatelské GitHub Pages. Samotné vytvoření místních souborů web na internet nezveřejňuje; je nutné provést kroky výše ve vlastním účtu.

## Obtížnosti a pravidla

Najetí myší na válec zobrazí dvojnásobně zvětšený detail hladiny a stupnice. Po odjetí myší se vrátí celý válec. Na mobilu se detail přepíná ťuknutím; klávesnicí pomocí Tab a Enter nebo mezerníku. Escape, klepnutí mimo válec i nová úloha zvětšení zruší. Detail zachovává původní rysky a hodnoty, neprozrazuje výsledek v Expertovi ani Sigmě.

Ve všech obtížnostech má stupnice 10 velkých dílků. Pro každou novou úlohu se rovnoměrně náhodně zvolí dělení každého velkého dílku na 2, 5 nebo 10 menších (celkem 20, 50 nebo 100). Hladina vždy leží přesně na rysce.

- **Rozjezd:** odpovědi ve stejné cílové jednotce.
- **Výzva:** desetinné hodnoty, zadání i odpovědi ve všech deseti jednotkách.
- **Expert:** všech deset jednotek také na válci. Číselný údaj o objemu ani velikost dílku se pod válcem nezobrazují; žák objem odečítá ze stupnice. Pro čtečky obrazovky je popsaná kapacita, počet dílků a poloha hladiny, nikoli hotový výsledek.
- **Sigma:** odečtení jako v Expertovi, ale bez možností na výběr. Žák zapisuje výsledek do pole s pevnou cílovou jednotkou. Přijímá se čárka i tečka a mezery mezi tisíci. Enter nebo tlačítko odpověď potvrdí. Neplatný zápis se nezapočítá; platné, ale chybné číslo ano. Výsledek se kontroluje přesným porovnáním zlomků pomocí BigInt, bez zaokrouhlení.

Rozjezd zachovává stupnici v ml nebo l a všech 20 kombinací s cílovými jednotkami. Výzva, Expert a Sigma umožňují všech 100 kombinací jednotek ml, cl, dl, l, hl, mm³, cm³, dm³, m³ a km³ včetně převodu na stejnou jednotku. Km³ mají při každém náhodném výběru zdrojové nebo cílové jednotky pravděpodobnost 1 %, ostatních devět jednotek si rovnoměrně dělí zbývajících 99 %. V Rozjezdu jsou km³ pouze cílovou jednotkou. Chybné nabídky používají běžné jednotky bez km³. Dlouhá desetinná čísla jsou vždy uvedena přesně.

Nabídky mají šest vlastních SVG motivů: lahev, akvárium, bazén, sud, baňku a konev. V každé výběrové úloze jsou čtyři různé motivy. Obrázky jsou symbolické a nejsou v měřítku; rozhodující je uvedené číslo.

### Herní módy

Výsledková stránka zobrazuje kruhový ukazatel úspěšnosti, počet správných odpovědí, počet chyb a nejdelší sérii. Tlačítko „Zkusit chybné příklady znovu“ spustí novou sérii pouze z nezvládnutých zadání. Zachovává stejné jednotky, hladinu, stupnici, nabídky i obtížnost; skóre opakování se počítá od nuly. Opakování lze opakovat, dokud nezbývají chyby. Po bezchybné sérii se tlačítko nenabízí. Také nekonečné procvičování lze po první odpovědi vyhodnotit příslušným tlačítkem; nezodpovězená úloha se do výsledku nepočítá.

Úvodní stránka nabízí **10 příkladů**, **vlastní kladný celý počet** a **nekonečné procvičování**. Konečná série vyžaduje zvolený počet odpovědí a končí přehledem správných odpovědí, procentuální úspěšností a nejdelší sérií. Po poslední odpovědi zůstává vysvětlení viditelné až do kliknutí na „Zobrazit výsledek“. Nekonečný režim umožňuje přeskakovat úlohy.

Odpověď se započítá jen jednou. Správná odpověď zvýší sérii, chyba ji vynuluje. Obtížnost se vybírá na úvodní stránce a po celou hru je pevná. Pro změnu je nutné vrátit se na výběr a zahájit novou hru. Nová hra vynuluje skóre, zachová zvolenou obtížnost. Návrat na výběr hry rozehraný trénink opustí. Data se nikam neposílají ani trvale neukládají. U odpovědi je vždy uveden celý objem nádoby; ilustrace nejsou v měřítku.

## Přesnost a struktura

- `volume.js`: čistá matematická logika, generování úloh, přesné české formátování a vysvětlení.
- `app.js`: rozhraní, SVG ilustrace a stav hry.
- `styles.css`, `index.html`, `favicon.svg`: vzhled a přístupná struktura.
- `tests/volume.test.js`: automatické testy bez knihoven třetích stran.

Všechny objemy jsou uloženy jako celá mm³ pomocí `BigInt`. Jednotky mají celočíselné faktory: 1 ml = 1 000 mm³, 1 l = 1 000 000 mm³, 1 m³ = 1 000 000 000 mm³. Převody a texty nepoužívají desetinnou aritmetiku typu `Number`. Parser odmítne hodnoty, které by vyžadovaly zaokrouhlení na mm³. Generátor vybírá přesné násobky dílku a zajišťuje čtyři různé skutečné objemy, z nichž právě jeden odpovídá zadání. Nesprávné možnosti vznikají pouze posunem desetinné čárky o jeden až tři řády v přesném objemu a případným vyjádřením v jiné jednotce. Zachovávají tak stejné významové číslice jako zadání (např. 0,6 → 6 → 600), nikdy nepřidávají náhodné jiné číslo. Dělení se použije jen při přesném celočíselném výsledku v mm³. Pouze pozice ve vykresleném SVG používají běžná obrazová desetinná čísla.

## Automatické testy

Pokud máte Node.js 18 nebo novější, spusťte z této složky:

```sh
node --test tests/volume.test.js tests/audit.test.js
```

Žádná instalace balíčků není potřeba. Node je jen pro testy; pro hru a GitHub Pages není nutný. Dvanáct testů zahrnuje úplný průchod 190 380 základními zadáními proti nezávislému etalonu a původní kontroly: všech 100 směrů převodu, zachování přesnosti, odmítnutí chybných vstupů, 320 000 náhodných úloh, pokrytí kombinací, zachování číslic ve všech nabídkách, vysvětlení odpovědí, zápisy v Sigmě a nižší četnost km³. Podrobný rozsah a výsledky včetně kontroly rozhraní jsou v [KONTROLA.md](KONTROLA.md).

Pro ruční kontrolu otevřete stránku na mobilu i počítači, projděte všechny obtížnosti, správnou a chybnou odpověď, opakovaný klik, novou úlohu a tahák. Vyzkoušejte všechny tři módy, konec série (také vlastní počet 1), odmítnutí neplatného počtu a skrytí objemu v Expertovi. Zkontrolujte také ovládání klávesnicí a zvětšení stránky.
