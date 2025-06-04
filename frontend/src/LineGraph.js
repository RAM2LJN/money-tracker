import { Line } from 'react-chartjs-2';

export default function LineGraph({ transactions, view }) {
  const now = new Date();
  const filtered = transactions.filter(t => {
    if (view === 'week') {
      const d = new Date(t.timestamp);
      return (now - d) / 86400000 <= 7;
    }
    if (view === 'month') {
      const d = new Date(t.timestamp);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }
    return true;
  });
  const sorted = [...filtered].sort((a, b) => a.timestamp - b.timestamp);
  let running = 0;
  const labels = sorted.map(t => {
    const d = new Date(t.timestamp);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  });
  const dataPoints = sorted.map(t => {
    running += t.type === 'income' ? t.amount : -t.amount;
    return running;
  });
  const data = {
    labels,
    datasets: [
      {
        label: 'Balance',
        data: dataPoints,
        borderColor: '#3b82f6',
        fill: false
      }
    ]
  };
  return <Line data={data} />;
}
