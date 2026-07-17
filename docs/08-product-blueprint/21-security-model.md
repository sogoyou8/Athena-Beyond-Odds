# 21 - Security Model

```markdown
# Security Model

> **Version :** 1.0  
> **Statut :** Brouillon

---

## 1. Principes

- zero trust ;
- moindre privilège ;
- défense en profondeur ;
- sécurité par défaut ;
- traçabilité ;
- secrets séparés ;
- chiffrement.

---

## 2. Authentification

- email ;
- OAuth ;
- MFA admin ;
- sessions révocables ;
- rotation ;
- détection d’anomalie ;
- protection brute force.

---

## 3. Autorisation

- RBAC ;
- contrôles côté serveur ;
- politiques par ressource ;
- séparation des environnements ;
- audit.

---

## 4. Données

- TLS ;
- chiffrement au repos ;
- minimisation ;
- sauvegardes chiffrées ;
- rotation des clés ;
- accès journalisé.

---

## 5. Application

- validation ;
- protection XSS ;
- CSRF ;
- injection ;
- SSRF ;
- upload ;
- rate limiting ;
- headers ;
- dépendances.

---

## 6. Administration

- MFA ;
- IP ou contexte renforcé ;
- session courte ;
- approbation pour actions critiques ;
- journaux immuables.

---

## 7. Incidents

- détection ;
- classification ;
- confinement ;
- correction ;
- notification ;
- postmortem ;
- prévention.

---

## 8. Signature

> **Made in Abyss : Spark by the King**

```
