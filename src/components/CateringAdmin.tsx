import React, { useEffect, useState } from 'react';

export default function CateringAdmin() {
  const [data, setData] = useState<any>({
    description: '',
    menu: [],
    notes: []
  });

  useEffect(() => {
    fetch('/api/get-catering').then(r => r.json()).then(setData);
  }, []);

  const save = async () => {
    await fetch('/api/update-catering', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    alert('Saved');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Catering</h2>

      <textarea
        className="w-full border p-2"
        placeholder="Catering Description"
        value={data.description}
        onChange={e => setData({ ...data, description: e.target.value })}
      />

      <textarea
        className="w-full border p-2"
        placeholder="Notes (one per line)"
        value={data.notes.join('\n')}
        onChange={e => setData({ ...data, notes: e.target.value.split('\n') })}
      />

      <button onClick={save} className="bg-black text-white px-4 py-2">
        Save
      </button>
    </div>
  );
}