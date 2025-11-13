# EAT SPECIFICATION v1.0

EAT is een compacte Prompt-Structured Notation (PSN)
voor GPT-system prompts, agent-modes, workflows en constraints.

Het is geïnspireerd op TOON:
- platte structuur  
- kolom-arrays  
- token-efficiënt  
- mensvriendelijk  

EAT bepaalt **alleen de vorm**, niet de inhoud.

---

## 1. Basisprincipes

1. Geen domeinlogica (geen vakken, rubrics, modellen, business-regels).
2. Geen verplichte velden: gebruikers kiezen zelf welke blokken ze gebruiken.
3. Alles is plat (geen geneste blokken of ingewikkelde hiërarchie).
4. EAT is leesbaar voor mensen, en voorspelbaar voor LLMs.
5. Locked behaviour & exact-velden beschermen nuance en rolgedrag.

---

## 2. Syntaxis

### 2.1 Blokken

Een blok begint met een bloknaam en optioneel een set keys.

```text
blockname{keys}:
  value1, value2
```

Voorbeeld:

```text
identity{rol, domein}:
  data_analyst_agent, strategy
```

Hierbij is:
- `identity` de bloknaam
- `rol, domein` zijn keys
- de volgende regel bevat de waarden in dezelfde volgorde

### 2.2 Arrays

Arrays worden aangegeven met `[n]` en een header-rij met kolommen:

```text
workflow[4]{fase, actie}:
  1, open_vraag
  2, wacht
  3, hint
  4, reflectie
```

- `workflow` is de naam van de array
- `[4]` kan worden gebruikt als indicatieve lengte (optioneel)
- `{fase, actie}` definieert de kolomnamen

### 2.3 Multi-line text blocks

Voor tekst die exact bewaard moet blijven of langer is dan één regel:

```text
description:
"""
Behoud deze tekst exact.
Geen parafrase.
Gebruik voor langere beschrijvingen.
"""
```

De inhoud tussen de drievoudige quotes `"""` wordt als één geheel gezien.

### 2.4 Exact fields

Sommige velden moeten 1-op-1 gebruikt worden (bijv. openingszinnen).

```text
greeting_exact:
  "Hallo. Goed dat je er bent."
```

Een LLM of agent die EAT respecteert, mag deze tekst niet herschrijven.

### 2.5 Locked behaviour

Met `locked: true` geef je aan dat de rol, greeting, workflow en stijl
strikt gevolgd moeten worden.

```text
locked: true
```

Dit is een signaal aan de runtime / agent-omgeving dat de interpretatie
zo dicht mogelijk bij de gegeven instructies moet blijven.

### 2.6 Sequence constraints

Definieer de gewenste volgorde van vragen of stappen als een string:

```text
sequence_strict:
  context → doel → poging → reflectie
```

Dit is beschrijvend, niet formeel verplichtend in de syntaxis, maar
wel nuttig voor LLM-interpretatie en tooling.

### 2.7 Vibe constraints

Beschrijf toon en nuance in compacte labels:

```text
vibe_exact:
  rustig, helder, professioneel
```

Deze labels sturen interpretatie van stijl, zonder echte tekst voor te schrijven.

---

## 3. Wat EAT NIET is

EAT is bewust beperkt van scope. Het is **geen**:

- rubric
- model
- syllabus
- JSON/YAML vervanger
- analyse-engine
- domeinspec (bijv. onderwijs, recht, finance)

EAT is puur **promptstructuur**: een manier om system-prompts, agent-profielen
en workflows compact en structureel consistent vast te leggen.

---

## 4. Best Practices

- Gebruik korte, consistente sleutelwoorden (bijv. `mission`, `rules`, `style`).
- Houd alles plat; voorkom geneste structuren.
- Gebruik `greeting_exact` voor belangrijke openingszinnen.
- Gebruik `locked: true` wanneer gedrag strikt moet blijven.
- Gebruik `vibe_exact` en `micro_rules` voor nuance zonder lange verhalende tekst.
- Gebruik arrays voor workflows, stappen en lijsten.

---

## 5. Compatibiliteit en tooling

EAT kan eenvoudig naar JSON of andere structuren worden geparsed
en kan door LLMs direct als tekst worden geïnterpreteerd.

Tooling (parsers/validators) kan bovenop deze specificatie worden gebouwd
om consistent gebruik af te dwingen.
