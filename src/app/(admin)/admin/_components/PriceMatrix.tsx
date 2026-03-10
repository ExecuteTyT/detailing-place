"use client";

import { useState, useEffect } from "react";

interface PriceMatrixProps {
  carClasses: Array<{ id: number; label: string; example: string }>;
  prices: Array<{ carClassId: number | null; priceText: string | null }>;
  onChange: (
    prices: Array<{ carClassId: number | null; priceText: string | null }>,
  ) => void;
}

export default function PriceMatrix({
  carClasses,
  prices,
  onChange,
}: PriceMatrixProps) {
  const hasFlatPrice = prices.length === 1 && prices[0]?.carClassId === null;
  const [isFlat, setIsFlat] = useState(hasFlatPrice);

  useEffect(() => {
    const flat = prices.length === 1 && prices[0]?.carClassId === null;
    setIsFlat(flat);
  }, [prices]);

  function handleToggle(checked: boolean) {
    setIsFlat(checked);
    if (checked) {
      onChange([{ carClassId: null, priceText: null }]);
    } else {
      onChange(
        carClasses.map((cc) => ({
          carClassId: cc.id,
          priceText: null,
        })),
      );
    }
  }

  function handleFlatChange(value: string) {
    onChange([{ carClassId: null, priceText: value || null }]);
  }

  function handleClassChange(carClassId: number, value: string) {
    const updated = prices.map((p) =>
      p.carClassId === carClassId
        ? { ...p, priceText: value || null }
        : p,
    );
    onChange(updated);
  }

  function getPriceForClass(carClassId: number): string {
    const entry = prices.find((p) => p.carClassId === carClassId);
    return entry?.priceText ?? "";
  }

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={isFlat}
          onChange={(e) => handleToggle(e.target.checked)}
          className="w-4 h-4 rounded border-[#333333] bg-[#252525] accent-[#00F0FF]"
        />
        <span className="text-sm text-[#A0A0A0]">Единая цена</span>
      </label>

      {isFlat ? (
        <div>
          <input
            type="text"
            value={prices[0]?.priceText ?? ""}
            onChange={(e) => handleFlatChange(e.target.value)}
            placeholder="Дог."
            className="w-full bg-[#252525] border border-[#333333] rounded-lg px-4 py-2.5 text-[#F5F5F5] text-sm focus:outline-none focus:border-[#00F0FF] transition-colors placeholder:text-[#A0A0A0]/50"
          />
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {carClasses.map((cc) => (
            <div key={cc.id} className="space-y-1">
              <label className="block text-xs text-[#A0A0A0]">
                {cc.label}{" "}
                <span className="text-[#A0A0A0]/60">({cc.example})</span>
              </label>
              <input
                type="text"
                value={getPriceForClass(cc.id)}
                onChange={(e) => handleClassChange(cc.id, e.target.value)}
                placeholder="Дог."
                className="w-full bg-[#252525] border border-[#333333] rounded-lg px-4 py-2.5 text-[#F5F5F5] text-sm focus:outline-none focus:border-[#00F0FF] transition-colors placeholder:text-[#A0A0A0]/50"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
