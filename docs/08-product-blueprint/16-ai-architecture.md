# 16 - AI Architecture

```markdown
# AI Architecture

> **Version :** 1.0  
> **Statut :** Brouillon

---

## 1. Principe

Le LLM explique.

Il ne remplace pas les moteurs statistiques.

---

## 2. Couches

```text
Structured Data
→ Feature Store
→ Statistical Models
→ Calibrated Outputs
→ Evidence Pack
→ LLM Explanation
→ Validation
→ User Interface
```

---

## 3. Composants

- Context Builder ;
- Evidence Retriever ;
- Explanation Generator ;
- Citation Verifier ;
- Safety Layer ;
- Response Validator ;
- Feedback Collector ;
- Prompt Registry ;
- Evaluation Suite.

---

## 4. Agents envisagés

- Match Analyst ;
- Statistician ;
- Risk Analyst ;
- Market Analyst ;
- Data Quality Analyst ;
- Explanation Agent ;
- Orchestrator.

Aucun agent ne publie seul une conclusion sensible.

---

## 5. Evidence Pack

Doit contenir :

- faits structurés ;
- résultats modèles ;
- sources ;
- fraîcheur ;
- données manquantes ;
- contradictions ;
- limites ;
- langue ;
- audience.

---

## 6. RAG

Le RAG peut utiliser :

- documentation Athena ;
- définitions ;
- méthodologies ;
- historique ;
- sources autorisées.

Il ne doit pas ingérer automatiquement des contenus non fiables.

---

## 7. Garde-fous

- réponses fondées ;
- citations ;
- refus si données insuffisantes ;
- pas de probabilité inventée ;
- pas de promesse ;
- pas de conseil financier personnalisé ;
- limites affichées.

---

## 8. Évaluation

- factualité ;
- citation ;
- cohérence ;
- utilité ;
- prudence ;
- latence ;
- coût ;
- stabilité.

---

## 9. Versionnement

Chaque réponse conserve :

- modèle ;
- prompt ;
- outils ;
- sources ;
- date ;
- paramètres ;
- validateur.

---

## 10. Signature

> **Made in Abyss : Spark by the King**

```
