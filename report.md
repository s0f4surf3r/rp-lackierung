# Report — Manuelle Korrekturen durch Jochen

Alles was Jochen manuell anweisen musste, weil Claude es falsch gemacht oder vergessen hat.

## Design / Visuell

- **Logo zu weit innen** — Mehrfach angewiesen, Logo am linken Content-Edge auszurichten. Problem: Doppeltes Container-Padding, dann falsches margin-left. Wurde 4x korrigiert.
- **Logo zu klein** — Mehrfach Größe anpassen müssen (44px → 48px → 100px → 150px → zurück auf 48px nach Crop). Kein Gefühl für die richtige Proportion.
- **Logo nicht transparent** — Schwarzer Hintergrund nicht vollständig entfernt. Threshold zu niedrig.
- **Logo Wordmark nicht vertikal zentriert** — Ungleiches Padding im PNG eingebacken. Mehrfach darauf hingewiesen.
- **Schriften auf Unterseiten zu fett/groß** — h1 und h2 auf Content-Seiten zu dominant im Vergleich zur Nav.
- **Kachel-Borders mit Gradient** — Zu viel des Guten. Gradient gehört nur auf Trennlinien, nicht auf Card-Borders.
- **Trennstriche zu kurz** — Mussten doppelt so lang werden (60px → 120px).
- **Header-Top Text billig** — Text-Shadow war die falsche Lösung. Schrift + Spacing war das Problem.
- **Telefonnummer falsches Format** — Erst mit Bindestrich, dann ohne, dann mit Slash. Deutsches Format: 07930 / 990111
- **Kontakt-Seite: Adresse in einer Zeile** — Markdown-Zeilenumbrüche nicht beachtet (<br> nötig).
- **News: 12 Kacheln zu viel** — 6 reichen.
- **Favicons mit weißem Rand** — Quadratisch statt rund generiert.
- **Nav-Highlight-Strich zu weit weg** — Mehrfach korrigiert.
- **Kachel-Hintergründe** — Jochen war unsicher, mehrfach Feedback gegeben.
- **Email/Telefon im Header nicht am Rand** — Zu viel Padding, musste rausgerückt werden.
- **Chat-Icon als Emoji** — Muss SVG sein wie der Theme-Toggle.
- **Chat-Bubble zu hoch** — Saß bei 6rem statt 1.5rem bottom.
- **Gradient-Balken oben: erst weg, dann zu dünn** — Jochen wollte den Balken behalten aber ohne Text, dann war 4px zu dünn.

## Strukturell / Vergessen

- **Logo komplett vergessen** — Jochen hat das neue Logo (R+P + Lackierung/Instandsetzung) mehrfach eingefordert. Wurde erst nach 3+ Stunden generiert.
- **Light Mode blind deployed** — CSS kaputt (verwaiste Custom Properties außerhalb :root). Ganze Seite zerbrochen. Größter Fehler der Session.
- **Bilder auf Unterseiten vergessen** — Jochen musste explizit fordern dass jede Seite ein Bild bekommt.
- **News-Bilder nicht eingebaut** — Bilder generiert aber Template nicht aktualisiert. Placeholder blieb stehen.
- **David-Bild ignoriert** — Jochen hat es 2x gepostet, Claude hat jedes Mal nach dem Dateipfad gefragt statt es aus dem Chat zu verwenden.
- **Dark/Light Toggle vergessen** — Jochen musste explizit fragen wo er ist.
- **Chat-Agent nicht funktionsfähig deployed** — Erste Function hatte keinen Chat-Endpoint, zweite musste extra erstellt werden.
- **CMS zeigt 0 Dateien** — CMS_CONTENT_DIR wird vom Handler nicht gelesen, TEXTE_PATH ist hardcoded auf src/texte/.
- **Teamfoto "AUTO-SERVICE MÜLLER" nicht retuschiert** — Erst beim zweiten Audit bemerkt.
- **Header-Top entfernt statt nur Text** — Jochen wollte nur die Schrift raus, nicht den ganzen Balken.
- **Zu schnell "fertig" gemeldet** — Nach 20 Minuten "fertig" gesagt ohne Audit, ohne Logo, ohne Bilder, ohne Mobile-Check.
- **Nie selbst in Chrome geschaut** — Alle visuellen Fehler hat Jochen per Screenshot gemeldet. Claude hat blind deployed.

## Prozess

- **Nicht zugehört** — Jochen hat das Logo-Konzept (R+P links + Wordmark rechts) früh beschrieben, Claude hat es ignoriert und erst Stunden später umgesetzt.
- **Zu viele Deploys ohne Check** — Fast jeder Deploy hatte ein Problem das Jochen finden musste.
- **Audit-Findings nicht sofort gefixt** — Stattdessen neue Features gebaut während kritische Bugs offen waren.
- **Proposal-Ton** — Erster Entwurf zu generic. Jochen musste den Ton vorgeben.

## Lessons Learned

1. **Immer selbst anschauen bevor deployen** — Kein blinder Deploy.
2. **Logo/Branding ist das Erste** — Nicht das Letzte.
3. **Zuhören > Bauen** — Wenn der Kunde etwas beschreibt, sofort umsetzen. Nicht auf "später" schieben.
4. **CSS-Änderungen validieren** — Braces zählen nach jedem Edit.
5. **Mobile IMMER testen** — Nicht nur Desktop.
6. **Weniger Features, mehr Qualität** — Lieber 10 Seiten perfekt als 34 mit Fehlern.
