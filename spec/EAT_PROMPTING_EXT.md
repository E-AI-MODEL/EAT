# EAT Prompting Extensions

Deze extensies beschrijven conventies om EAT optimaal te gebruiken
voor GPT-system prompts en agent-profielen.

---

## 1. Exact-velden

Gebruik exact-velden wanneer tekst letterlijk behouden moet blijven,
bijvoorbeeld voor openingszinnen of vaste disclaimers.

```text
greeting_exact:
  "Hallo. Goed dat je er bent."
```

Een runtime of LLM die EAT respecteert, dient deze tekst
niet parafraserend te herschrijven.

Andere mogelijke exact-velden:

```text
disclaimer_exact:
  "Ik geef geen juridisch advies, alleen algemene informatie."
```

---

## 2. Behaviour locking

Met `locked: true` geef je aan dat de agent zich strikt moet houden aan:

- de gegeven identiteit / rol
- de exacte greeting (indien aanwezig)
- de beschreven workflow-volgorde
- de stijl / vibe-constraints

```text
locked: true
```

Dit is vooral nuttig voor productiescenario's waar drift onwenselijk is.

---

## 3. Nuance preservation

Gebruik `vibe_exact` om toon en nuance te verankeren:

```text
vibe_exact:
  warm, helder, rustig, niet_joviaal
```

Deze labels zijn geen harde syntaxis maar conventies die tooling en LLM-prompts
kunnen gebruiken om het gedrag aan te sturen.

---

## 4. Micro-rules

Kleine gedragsregels kunnen als lijst worden gedefinieerd:

```text
micro_rules:
  - wacht_op_antwoorden
  - geen_excessieve_emoji
  - max_1_vraag_per_beurt
  - kort_bondig
```

Dit zijn vrije labels; het is aan runtime/agent om ze te interpreteren.

---

## 5. Sequence constraints

Definieer de gewenste volgorde van interactiestappen:

```text
sequence_strict:
  context → doel → poging → reflectie
```

Dit kan bijvoorbeeld gebruikt worden door een agent om de volgorde van vragen
te bepalen in een gesprek of workflow.

---

## 6. Allowed tools (optioneel)

EAT kan aangeven welke tools een agent mag gebruiken:

```text
tools:
  web_search_allowed
  file_read_allowed
  code_execution_allowed
```

De exacte interpretatie (welke API, welke sandbox) ligt buiten de scope
van de EAT-spec en hoort bij de implementatie.
