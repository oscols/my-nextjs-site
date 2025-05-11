"use client";

import { useState } from "react";

interface Entry {
  account: string;
  balance: number;
  date: string;
}

export default function Home() {
  // Initialize date state to today in ISO format (YYYY-MM-DD)
  const todayISO = new Date().toISOString().split('T')[0];
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");
  const [date, setDate] = useState<string>(todayISO);
  const [entries, setEntries] = useState<Entry[]>([]);

  // Editing state
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editAccount, setEditAccount] = useState("");
  const [editBalance, setEditBalance] = useState("");
  const [editDate, setEditDate] = useState<string>(todayISO);

  // Adjust date by given days delta
  const adjustDate = (delta: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + delta);
    setDate(d.toISOString().split('T')[0]);
  };

  const handleAdd = () => {
    if (!account || !balance || !date) return;
    const newEntry: Entry = { account, balance: parseFloat(balance), date };
    const updated = [...entries, newEntry].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setEntries(updated);
    setAccount("");
    setBalance("");
    setDate(todayISO);
  };

  const startEdit = (index: number) => {
    const e = entries[index];
    setEditingIndex(index);
    setEditAccount(e.account);
    setEditBalance(e.balance.toString());
    setEditDate(e.date);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    const updated = entries.map((e, i) =>
      i === editingIndex
        ? { account: editAccount, balance: parseFloat(editBalance), date: editDate }
        : e
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setEntries(updated);
    setEditingIndex(null);
  };

  const handleDelete = (index: number) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      setEntries(entries.filter((_, i) => i !== index));
      setEditingIndex(null);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 space-y-6 font-[family-name:var(--font-geist-mono)]">
      <h1 className="text-2xl font-bold">My Finance Tracker</h1>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Bank account name"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        />
        <input
          type="number"
          placeholder="Balance"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          className="border rounded px-3 py-2 w-32"
        />
        <div className="flex items-center gap-1">
          <button onClick={() => adjustDate(-1)} className="px-2 py-1 border rounded">←</button>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <button onClick={() => adjustDate(1)} className="px-2 py-1 border rounded">→</button>
        </div>
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white rounded px-4 py-2"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {entries.map((e, i) => (
          <li key={i} className="border rounded p-4">
            {editingIndex === i ? (
              <div className="space-y-2">
                <input
                  type="text" value={editAccount}
                  onChange={(e) => setEditAccount(e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                />
                <input
                  type="number" value={editBalance}
                  onChange={(e) => setEditBalance(e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                />
                <input
                  type="date" value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                />
                <div className="flex gap-2 pt-2">
                  <button onClick={saveEdit} className="bg-green-500 text-white rounded px-4 py-2">Save</button>
                  <button onClick={cancelEdit} className="bg-gray-300 rounded px-4 py-2">Cancel</button>
                  <button onClick={() => handleDelete(i)} className="text-red-500 rounded px-4 py-2">Delete</button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <strong>{e.account}</strong><br />
                  ${e.balance.toFixed(2)}<br />
                  <span className="text-sm text-gray-500">{e.date}</span>
                </div>
                <button onClick={() => startEdit(i)} className="text-blue-500 hover:text-blue-700">Edit</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
