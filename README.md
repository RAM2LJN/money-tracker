HEAD
# Money Tracker

A simple full-stack app for tracking income and expenses. The backend is built with Node.js, Express and MongoDB while the frontend uses React and TailwindCSS.

HEAD

## Features
- Pie and line charts powered by Chart.js
- Transactions persisted to `localStorage`
- Summary bar showing income, expenses and balance
- Filters for viewing recent transactions
- Optional recurring transactions and per-category limits

81b0cc613551f66d12b583a5cb0c60c504507d10
## Requirements
- Node.js 18+
- MongoDB database

## Setup

### Backend
```bash
cd money-tracker/backend
npm install
cp .env.example .env # then edit values
npm run dev
```
The API will start on `http://localhost:5000`.

### Frontend
```bash
cd money-tracker/frontend
npm install
cp .env.example .env # set VITE_API_URL if backend deployed elsewhere
npm run dev
```
This starts the React development server.

## Deployment
The app is ready for deployment on providers like Vercel (frontend) and Render (backend). Create environment variables based on the `.env.example` files.

# money-tracker
1999e40ac701e8a79deb0002b4e055cd9004cee6
