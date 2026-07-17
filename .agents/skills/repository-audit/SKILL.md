---
name: repository-audit
description: Audit structurel du dépôt, conformité Git, détection de fuite de secrets et production de rapport de conformité.
---

# Skill: Repository Audit

Cette skill audite de manière non destructive la propreté et la conformité générale du dépôt.

## Responsabilités
1. **Audit de Structure :** Vérifier que seuls les répertoires et fichiers autorisés par la phase courante sont présents.
2. **Conformité Git :** S'assurer de la présence et du bon paramétrage des fichiers `.gitignore`, `.gitattributes`, `.editorconfig` et de la configuration de CODEOWNERS.
3. **Détection de Secrets :** Scanner de manière proactive les fichiers textuels pour s'assurer qu'aucun mot de passe, token ou clé d'API n'a été inséré par erreur.
4. **Rapport Non Destructif :** Émettre un rapport clair répertoriant les fichiers créés, importés, renommés, ignorés et bloqués sans modifier l'état du dépôt.
