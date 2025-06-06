# Money Tracker

A desktop app for tracking income and expenses. The backend uses Node.js, Express and MongoDB, while the frontend is built with React and TailwindCSS and packaged with Electron.

## Features
- Pie and line charts powered by Chart.js
- Recurring transactions
- Per‑category and global budget limits
- Secure user authentication
- Data persisted in MongoDB and synced on launch

## Requirements
- Node.js 18+
- MongoDB database

## Setup

### Backend
```bash
cd money-tracker/backend
npm install
cp .env.example .env # edit values
npm run dev
```

### Frontend
```bash
cd money-tracker/frontend
npm install
npm run build
```

### Electron
```bash
npm run electron
```

## Job Application Bot

A lightweight Python utility for scanning job boards and applying automatically.

### Usage
```bash
cd money-tracker/job_bot
python -m job_bot.main config.example.yaml
```
Edit `config.example.yaml` with your own search filters and application details.
