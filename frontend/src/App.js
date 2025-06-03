import { useEffect, useState } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Other'];

function applyRecurring(list) {
  const now = new Date();
  const updated = [...list];
  const groups = {};
  list.forEach(t => {
    if (t.recurringId) {
      if (!groups[t.recurringId]) groups[t.recurringId] = [];
      groups[t.recurringId].push(t);
    }
  });
  Object.values(groups).forEach(items => {
    const last = items.sort((a, b) => b.timestamp - a.timestamp)[0];
    const lastDate = new Date(last.timestamp);
    if (lastDate.getMonth() !== now.getMonth() || lastDate.getFullYear() !== now.getFullYear()) {
      const newTime = new Date(now.getFullYear(), now.getMonth(), lastDate.getDate()).getTime();
      updated.push({ ...last, timestamp: newTime, id: newTime + Math.random() });
    }
  });
  return updated;
}

function App() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ amount: '', category: 'Food', type: 'expense', recurring: false });
  const [filter, setFilter] = useState('all');
  const [limits, setLimits] = useState({});

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('transactions') || '[]');
    const storedLimits = JSON.parse(localStorage.getItem('limits') || '{}');
    setTransactions(applyRecurring(stored));
    setLimits(storedLimits);
  }, []);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('limits', JSON.stringify(limits));
  }, [limits]);

  const addTransaction = () => {
    if (!form.amount || isNaN(form.amount)) return;
    const now = Date.now();
    const entry = {
      ...form,
      amount: parseFloat(form.amount),
      id: now,
      timestamp: now,
      recurringId: form.recurring ? now : undefined
    };
    setTransactions([...transactions, entry]);
    setForm({ amount: '', category: 'Food', type: 'expense', recurring: false });
  };

  const clearAll = () => {
    setTransactions([]);
    localStorage.removeItem('transactions');
  };

  const totals = {
    income: transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
    expenses: transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  };
  const balance = totals.income - totals.expenses;
  const overspent = totals.expenses > totals.income;

  const expenseByCategory = categories.map(cat =>
    transactions.filter(t => t.category === cat && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const limitAlerts = categories.reduce((acc, cat, idx) => {
    const limit = limits[cat];
    if (limit && expenseByCategory[idx] > limit) acc.push(cat);
    return acc;
  }, []);

  const pieData = {
    labels: [...categories, 'Remaining'],
    datasets: [
      {
        data: [...expenseByCategory, Math.max(balance, 0)],
        backgroundColor: ['#f87171', '#60a5fa', '#facc15', '#34d399', '#a78bfa', '#cbd5e1'],
      }
    ]
  };

  const sorted = [...transactions].sort((a,b) => a.timestamp - b.timestamp);
  let running = 0;
  const lineLabels = sorted.map(t => {
    const d = new Date(t.timestamp);
    return `${d.getMonth()+1}/${d.getDate()}`;
  });
  const lineDataPoints = sorted.map(t => {
    running += t.type === 'income' ? t.amount : -t.amount;
    return running;
  });
  const lineData = {
    labels: lineLabels,
    datasets: [
      {
        label: 'Balance',
        data: lineDataPoints,
        borderColor: '#3b82f6',
        fill: false
      }
    ]
  };

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'month') {
      const d = new Date(t.timestamp);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }
    return true;
  });

  return (
      <div className="min-h-screen p-6 bg-gray-100 font-sans">
        <h1 className="text-2xl font-bold mb-4">💸 Money Tracker</h1>

        <div className="flex gap-4 mb-4 bg-white p-4 rounded shadow max-w-md">
          <div>Income: €{totals.income.toFixed(2)}</div>
          <div>Expenses: €{totals.expenses.toFixed(2)}</div>
          <div>Balance: €{balance.toFixed(2)}</div>
        </div>
        {overspent && (
          <div className="text-red-600 font-semibold mb-2">Warning: expenses exceed income!</div>
        )}

        <div className="flex flex-col gap-4 max-w-md">
          <input
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="p-2 rounded border"
          />
          <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="p-2 rounded border"
          >
            {categories.map(cat => <option key={cat}>{cat}</option>)}
          </select>
          <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="p-2 rounded border"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.recurring} onChange={e => setForm({...form, recurring: e.target.checked})} />
            <span>Recurring monthly</span>
          </label>
          <button
              onClick={addTransaction}
              className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Add Transaction
          </button>
          <button onClick={clearAll} className="bg-red-500 text-white p-2 rounded hover:bg-red-600">
            Clear All
          </button>
        </div>

        <div className="mt-4 max-w-md">
          <h2 className="text-lg font-semibold">Category Limits</h2>
          {categories.map(cat => (
            <div key={cat} className="flex items-center gap-2 mb-1">
              <span className="w-24">{cat}</span>
              <input
                type="number"
                value={limits[cat] || ''}
                onChange={e => setLimits({ ...limits, [cat]: parseFloat(e.target.value) || 0 })}
                className="border p-1 rounded w-24"
              />
              {limits[cat] && (
                <span className={expenseByCategory[categories.indexOf(cat)] > limits[cat] ? 'text-red-600' : 'text-green-600'}>
                  {expenseByCategory[categories.indexOf(cat)]}/{limits[cat]}
                </span>
              )}
            </div>
          ))}
          {limitAlerts.length > 0 && (
            <div className="text-red-600 text-sm">Limit exceeded: {limitAlerts.join(', ')}</div>
          )}
        </div>

        <div className="mt-10 max-w-md">
          <h2 className="text-xl font-semibold mb-2">📊 Expenses Chart</h2>
          <Pie data={pieData} width={200} height={200} />
        </div>

        <div className="mt-10 max-w-md">
          <h2 className="text-xl font-semibold mb-2">📈 Balance Over Time</h2>
          <Line data={lineData} />
        </div>

        <div className="mt-10 max-w-md">
          <h2 className="text-xl font-semibold mb-2">📋 History</h2>
          <div className="mb-2">
            <select value={filter} onChange={e => setFilter(e.target.value)} className="border p-1 rounded">
              <option value="all">All Transactions</option>
              <option value="month">This Month</option>
            </select>
          </div>
          <ul className="bg-white p-4 rounded shadow">
            {filteredTransactions.map((t, i) => (
                <li key={i} className="border-b py-1 last:border-none">
                  {t.type === 'income' ? '+' : '-'}€{t.amount} • {t.category} ({t.type}) - {new Date(t.timestamp).toLocaleDateString()}
                </li>
            ))}
          </ul>
        </div>
      </div>
  );
}

export default App;
