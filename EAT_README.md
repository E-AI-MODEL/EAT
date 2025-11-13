# EAT  
**Explicit Agent Text – A Prompt-Structured Notation (PSN) for LLM System Prompts**  
*Conceptually inspired by TOON*

![EAT Logo](A_logo_graphic_design_features_the_acronym_"EAT"_i.png)

**EAT staat voor *Explicit Agent Text*.**  
Het is een compacte, token-efficiënte en model-stabiele notatiestijl om het gedrag van LLM-agenten expliciet vast te leggen: rollen, workflows, regels, beperkingen, tools en toon.

EAT lost een terugkerend probleem op:  
system prompts worden te lang, inconsistent, moeilijk te onderhouden en te duur in tokens.

EAT maakt prompts:

- **korter**
- **duidelijker**
- **voorspelbaarder**
- **minder drift-gevoelig**
- **nuance-vast** (met exact-velden)
- **token-efficiënt** (lagere kosten, compactere context)
- **herhaalbaar en consistent** tussen modellen en sessies
- **leesbaar voor mensen én LLMs**

Waar TOON bedoeld is voor **gestructureerde data**, is EAT ontworpen voor **gestructureerde prompting**:  
een kleine vormtaal om te definiëren *wat een agent is, doet, mag en niet mag*.

---

## 🚫 Wat EAT NIET is

EAT is bewust géén:

- didactisch model  
- rubric  
- syllabus  
- JSON/YAML-vervanger  
- kennisschema of metadata-model  
- domeinspecifieke taal  
- AI-model, framework of runtime  

EAT is **alleen** een compacte vormtaal om system prompts en agentprofielen te structureren.

---

## 🔧 Voorbeeld: minimale agentdefinitie in EAT-stijl

```text
identity{rol, domein}:
  data_analyst_agent, strategy

mission:
  analyseer_informatie
  structureer_output

style:
  duidelijk, rustig, nl

greeting_exact:
  "Hallo. Ik ben je analytische assistent. Wat wil je onderzoeken?"

workflow[4]{stap, actie}:
  1, vraag_context
  2, verzamel_punten
  3, groepeer_inzichten
  4, lever_samenvatting

rules:
  geen_hallucinaties
  brontransparantie

locked: true
```

---

## 📚 Documentatie

- **Spec**  
  `/spec/EAT_SPEC.md`

- **Prompting Extensions**  
  `/spec/EAT_PROMPTING_EXT.md`

- **Voorbeelden**  
  `/examples/`  
  (8 uitgewerkte agentprofielen)

- **Validator**  
  `/validator/eat_validator.ts`

---

## 🤝 Credits

EAT bouwt voort op de eenvoud en leesbaarheid van TOON,  
maar is volledig opnieuw ontworpen voor **LLM-prompting, agent-gedrag en token-efficiëntie**.

---

## 💡 Bijdragen

Open gerust een Issue of Pull Request.  
Het doel is om EAT uit te bouwen tot een kleine, open standaard voor compacte, duidelijke en voorspelbare system prompts.
