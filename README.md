# One Time Read Message Website

Dies ist eine One Time Read Message Website, die es Benutzern ermöglicht, einmalig lesbare Nachrichten zu erstellen und zu teilen. Die Nachrichten können optional passwortgeschützt und mit einer Ablaufzeit versehen werden.

## Features

- Einmalig lesbare Nachrichten
- Optionale Passwortschutz für Nachrichten
- Optionale Ablaufzeit für Nachrichten
- Integration mit Vault zur sicheren Speicherung der Nachrichten

## Voraussetzungen

- [Node.js](https://nodejs.org/) (Version 14 oder höher)
- [Vault](https://www.vaultproject.io/)
- Ein Vault-Server, der läuft und zugänglich ist
- Ein Vault-Token mit den erforderlichen Berechtigungen, um Geheimnisse zu erstellen und zu löschen
- Eine Datei `.env` im Stammverzeichnis des Projekts mit den folgenden Umgebungsvariablen:

```
VAULT_ADDR=<URL zu deinem Vault-Server>
VAULT_TOKEN=<Dein Vault-Token>
ENCRYPTION_KEY=<32 Zeichen langer Schlüssel für AES-256>
```

## Installation

1. Klone das Repository:
    ```sh
    git clone https://github.com/dein-benutzername/dein-repository.git
    cd dein-repository
    ```

2. Installiere die Abhängigkeiten:
    ```sh
    npm install
    ```

3. Erstelle die Datei `.env` im Stammverzeichnis des Projekts und füge die erforderlichen Umgebungsvariablen hinzu:
    ```env
    VAULT_ADDR=https://your-vault-server.com
    VAULT_TOKEN=s.yourVaultToken
    ENCRYPTION_KEY=your32characterlongencryptionkey
    ```

4. Starte die Entwicklungsversion der App:
    ```sh
    npm run dev
    ```

5. Öffne deinen Browser und navigiere zu `http://localhost:3000`.

## Verzeichnisstruktur

```
├── app
│   ├── api
│   │   └── messages
│   │       └── route.ts
│   ├── message
│   │   └── [id]
│   │       └── page.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── layout.tsx
├── public
│   └── favicon.ico
├── styles
│   ├── Home.module.css
│   └── MessagePage.module.css
├── .env
├── .gitignore
├── next.config.js
├── package.json
└── README.md
```

## API-Endpunkte

### POST `/api/messages`

Erstellt eine neue Nachricht.

#### Request Body

```json
{
  "content": "Deine Nachricht",
  "password": "optional",
  "expiry": "optional"
}
```

#### Response

```json
{
  "id": "einzigartige-id-der-nachricht"
}
```

### GET `/api/messages?id=<messageId>&password=<optionalPassword>`

Ruft eine Nachricht ab.

#### Query Parameters

- `id` (erforderlich): Die eindeutige ID der Nachricht
- `password` (optional): Das Passwort, falls die Nachricht passwortgeschützt ist

#### Response

```json
{
  "content": "Der entschlüsselte Inhalt der Nachricht"
}
```

## Sicherheit

- Nachrichten werden mit AES-256 verschlüsselt, bevor sie in Vault gespeichert werden.
- Das Passwort (falls angegeben) wird ebenfalls verschlüsselt gespeichert.
- Nachrichten werden nach dem Abrufen aus Vault gelöscht.

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe die [LICENSE](LICENSE) Datei für Details.
```

Diese README-Datei bietet eine umfassende Erklärung des Projekts, einschließlich der Installation, Konfiguration und Nutzung der verschiedenen API-Endpunkte. Es deckt auch die Sicherheitsaspekte ab und enthält grundlegende Informationen zur Verzeichnisstruktur und Lizenzierung.