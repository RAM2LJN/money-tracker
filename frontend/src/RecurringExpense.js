export default function RecurringExpense({ value, onChange }) {
  return (
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={value}
        onChange={e => onChange(e.target.checked)}
      />
      <span>Recurring monthly</span>
    </label>
  );
}
