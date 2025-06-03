import { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

const categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Other'];

function App() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ amount: '', category: 'Food', type: 'expense' });

  const addTransaction = () => {
    if (!form.amount || isNaN(form.amount)) return;
    setTransactions([...transactions, { ...form, amount: parseFloat(form.amount) }]);
    setForm({ amount: '', category: 'Food', type: 'expense' });
  };

  const data = {
    labels: categories,
    datasets: [
      {
        data: categories.map(cat =>
            transactions
                .filter(t => t.category === cat && t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0)
        ),
        backgroundColor: ['#f87171', '#60a5fa', '#facc15', '#34d399', '#a78bfa'],
      },
    ],
  };

  return (
      <div className="min-h-screen p-6 bg-gray-100 font-sans">
        <h1 className="text-2xl font-bold mb-4">💸 Money Tracker</h1>
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
          <button
              onClick={addTransaction}
              className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Add Transaction
          </button>
        </div>

        <div className="mt-10 max-w-md">
          <h2 className="text-xl font-semibold mb-2">📊 Expenses Chart</h2>
          <Pie data={data} />
        </div>

        <div className="mt-10 max-w-md">
          <h2 className="text-xl font-semibold mb-2">📋 History</h2>
          <ul className="bg-white p-4 rounded shadow">
            {transactions.map((t, i) => (
                <li key={i} className="border-b py-1 last:border-none">
                  {t.type === 'income' ? '+' : '-'}€{t.amount} • {t.category} ({t.type})
                </li>
            ))}
          </ul>
        </div>
      </div>
  );
}

export default App;
