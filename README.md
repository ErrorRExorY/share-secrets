# One Time Read Message Website

Dies ist eine One Time Read Message Website, die es Benutzern ermöglicht, einmalig lesbare Nachrichten zu erstellen und zu teilen. Die Nachrichten können optional passwortgeschützt und mit einer Ablaufzeit versehen werden.

## Features

- Einmalig lesbare Nachrichten
- Optionale Passwortschutz für Nachrichten
- Optionale Ablaufzeit für Nachrichten
- Integration mit Vault zur sicheren Speicherung der Nachrichten

## Tech Stack

- [Next.js 14.2](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## Voraussetzungen

- [Node.js](https://nodejs.org/) (Version 14 oder höher)
- [Vault](https://www.vaultproject.io/)
- Ein Vault-Server, der läuft und zugänglich ist
- Ein Vault-Token mit den erforderlichen Berechtigungen, um Geheimnisse zu erstellen und zu löschen
- Eine Datei `.env` im Stammverzeichnis des Projekts mit den folgenden Umgebungsvariablen:

```env
VAULT_ADDR="<URL zu deinem Vault-Server>"
VAULT_TOKEN="<Dein Vault-Token>"
ENCRYPTION_KEY="<32 Zeichen langer Schlüssel für AES-256>"
```

## Installation

1. Klone das Repository:
    ```sh
    git clone https://github.com/ErrorRExorY/share-secrets.git
    cd share-secrets
    ```

2. Installiere die Abhängigkeiten:
    ```sh
    npm install
    ```

3. Erstelle die Datei `.env` im Stammverzeichnis des Projekts und füge die erforderlichen Umgebungsvariablen hinzu:
    ```env
    VAULT_ADDR='http://127.0.0.1:8200'
    VAULT_TOKEN='myroot'
    ENCRYPTION_KEY='6f2b8c9d4a5b7e8c9f1e2d3b4a5c6e7f'
    EMAIL_USER='something@gmail.com'
    EMAIL_PASS='https://myaccount.google.com/apppasswords'
    EMAIL_RECEIVER='whereyouwanttherequest@togo.com'
    CSRF_SECRET='SOmeSecret'
    NEXT_PUBLIC_BASE_URL='http://127.0.0.1'
    NEXT_PUBLIC_DOMAIN='http://127.0.0.1'
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
│   ├── privacy
│   │   └── not-found.tsx
│   │   └── page.tsx
│   ├── terms
│   │   └── not-found.tsx
│   │   └── page.tsx
│   ├── contact
│   │   └── not-found.tsx
│   │   └── page.tsx
│   ├── dashboard
│   │   └── Dashboard.module.css
│   │   └── page.tsx
│   ├── page.tsx
│   ├── not-found.tsx
│   ├── globals.css
│   └── layout.tsx
├── components
│   ├── Header.tsx
│   ├── Header.module.css
│   ├── Footer.tsx
│   └── Footer.module.css
├── lib
│   ├── auth.ts
│   └── mysql.ts
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

## Entwicklung

Dieses Projekt wurde mit [npx create-next-app@latest](https://nextjs.org/docs/api-reference/create-next-app) erstellt und verwendet Next.js, TypeScript und Tailwind CSS.

### Weitere Informationen

- [Next.js-Dokumentation](https://nextjs.org/docs)
- [TypeScript-Dokumentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS-Dokumentation](https://tailwindcss.com/docs)

### Skripte

- `npm run dev` - Startet die Entwicklungsumgebung
- `npm run build` - Baut das Projekt für die Produktion
- `npm start` - Startet die Produktionsversion der App

### Anpassen von Tailwind CSS

Um Tailwind CSS anzupassen, bearbeite die Datei `tailwind.config.js` im Stammverzeichnis des Projekts. Weitere Informationen zur Konfiguration von Tailwind CSS findest du in der [Tailwind CSS-Dokumentation](https://tailwindcss.com/docs/configuration).
