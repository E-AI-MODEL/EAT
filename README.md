# EAT  
*A Prompt-Structured Notation (PSN) for LLM System Prompts*  
**Forked conceptually from TOON**

EAT is een compacte schrijfstijl voor het definiëren van GPT-agentgedrag, workflows, tools, stijlregels en guardrails.

Waar TOON is ontworpen voor **gestructureerde data**, is EAT ontworpen voor **gestructureerde prompting**.

EAT is:
- ultra-lichtgewicht  
- domeinvrij  
- nuance-bewarend (via exact fields & locked behaviour)  
- token-efficiënt  
- mensleesbaar én modelstabiel  

EAT is GEEN:
- didactisch model  
- rubric  
- syllabus  
- JSON/YAML vervanger  
- analyse-engine  

Het is **alleen een vormtaal voor prompts**.

---

## 🔧 Voorbeeld

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
- SPEC: `/spec/EAT_SPEC.md`  
- Prompting Extensions: `/spec/EAT_PROMPTING_EXT.md`  
- Examples: `/examples/`  
- Validator: `/validator/eat_validator.ts`
