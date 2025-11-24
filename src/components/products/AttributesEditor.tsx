import React, { useMemo, useState } from 'react';

type Attribute = { key: string; value: string };
type Props = {
  attributes: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
  disabled?: boolean;
  maxRows?: number;
};

export function AttributesEditor({
  attributes,
  onChange,
  disabled = false,
  maxRows,
}: Props) {
  const [currentInputKey, setCurrentInputKey] = useState<string>("");
  const [currentInput, setCurrentInput] = useState<string>("");
  const [currentInputValue, setCurrentInputValue] = useState<string>("");

  const rows: Attribute[] = useMemo(
    () => Object.entries(attributes).map(([key, value]) => ({ key, value })),
    [attributes]
  );

  const setRow = (idx: number, next: Partial<Attribute>) => {
    const updated = rows.map((r, i) => (i === idx ? { ...r, ...next } : r));
    onChange(toRecord(updated));
  };

  const addRow = () => {
    if (maxRows && rows.length >= maxRows) return;
    const base = 'key';
    let i = 1;
    let newKey = `${base}${i}`;
    while (attributes[newKey] !== undefined) {
      i += 1;
      newKey = `${base}${i}`;
    }
    onChange({ ...attributes, [newKey]: '' });
  };

  const deleteRow = (idx: number) => {
    const updated = rows.filter((_, i) => i !== idx);
    onChange(toRecord(updated));
  };

  const toRecord = (arr: Attribute[]) =>
    arr.reduce<Record<string, string>>((acc, { key, value }) => {
      if (key.trim().length) acc[key] = value;
      return acc;
    }, {});

  const isDuplicate = (key: string, idx: number) =>
    key &&
    rows.findIndex(r => r.key === key) !== -1 &&
    rows.findIndex(r => r.key === key) !== idx;

  return (
    <div className="rounded border border-gray-200">
      <div className="flex items-center justify-between border-b p-2">
        <div className="text-md font-medium text-gray-700">
            <label className='text-md font-bold float-left w-full'>
                Attributes:
            </label>
        </div>
        <button
          type="button"
          onClick={addRow}
          disabled={disabled || (maxRows ? rows.length >= maxRows : false)}
          className=" bg-green-500 z-[10] rounded border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          + Add row
        </button>
      </div>

      <div className="grid grid-cols-12 gap-2 p-2 text-sm">
        <div className="col-span-5 font-semibold text-gray-600">Key</div>
        <div className="col-span-6 font-semibold text-gray-600">Value</div>
        <div className="col-span-1" />

        {rows.length === 0 && (
          <div className="col-span-12 text-gray-500">No attributes yet.</div>
        )}

        {rows.map((row, idx) => (
          <React.Fragment key={`${row.key}-${idx}`}>
            <div className="col-span-5">
              <input
                type="text"
                value={currentInputKey === row.key && currentInput ? currentInput : row.key}
                disabled={disabled}
                onFocus={() => setCurrentInputKey(row.key)}
                onChange={e => {
                  if(currentInputKey === row.key)
                    setCurrentInput(e.target.value)
                }}
                onBlur={() => {
                  setRow(idx, { key: currentInput });
                  setCurrentInput('');
                }}
                placeholder="attribute_key"
                className={`w-full rounded border px-2 py-1 focus:outline-none focus:ring-2
                  ${
                    isDuplicate(row.key, idx)
                      ? 'border-red-500 focus:ring-red-400'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
              />
              {isDuplicate(row.key, idx) && (
                <div className="mt-1 text-xs text-red-600">Duplicate key</div>
              )}
            </div>

            <div className="col-span-6">
              <input
                type="text"
                value={currentInputKey === row.key && currentInputValue ? currentInputValue : row.value}
                disabled={disabled}
                onFocus={() => setCurrentInputKey(row.key)}
                onChange={e => {
                  if(currentInputKey === row.key)
                    setCurrentInputValue(e.target.value)
                }}
                onBlur={() => {
                  setRow(idx, { value: currentInputValue });
                  setCurrentInputValue('');
                }}
                placeholder="value"
                className="w-full rounded border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-1 flex items-center justify-end">
              <button
                type="button"
                onClick={() => deleteRow(idx)}
                disabled={disabled}
                className="rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                aria-label={`Delete row ${idx + 1}`}
              >
                ✕
              </button>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}