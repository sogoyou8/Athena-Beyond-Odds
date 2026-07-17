# 18 - Notification System

```markdown
# Notification System

> **Version :** 1.0  
> **Statut :** Brouillon

---

## 1. Canaux

- in-app ;
- email ;
- push ;
- SMS futur ;
- webhook professionnel futur.

---

## 2. Déclencheurs

- rappel avant match ;
- composition publiée ;
- blessure importante ;
- début ;
- but ;
- carton rouge ;
- mi-temps ;
- fin ;
- nouvelle analyse ;
- changement majeur de probabilité ;
- incident de compte ;
- paiement.

---

## 3. Préférences

Par :

- entité ;
- compétition ;
- type ;
- canal ;
- fréquence ;
- importance ;
- quiet hours ;
- langue.

---

## 4. Déduplication

Une même information ne doit pas être envoyée plusieurs fois sur le même canal sans justification.

---

## 5. Priorités

- Critical ;
- High ;
- Normal ;
- Digest ;
- Marketing.

---

## 6. Sécurité

Les notifications ne doivent pas exposer :

- données sensibles ;
- détails de paiement ;
- secrets ;
- informations privées sur écran verrouillé sans consentement.

---

## 7. Livraison

Suivre :

- queued ;
- sent ;
- delivered ;
- opened ;
- failed ;
- suppressed.

---

## 8. Signature

> **Made in Abyss : Spark by the King**

```
