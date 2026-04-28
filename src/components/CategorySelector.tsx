import React from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { cn } from '@/src/lib/utils';
import { Plus, X } from 'lucide-react';

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
  type: "artwork" | "post";
  token?: string;
}

export function CategorySelector({ value, onChange, type, token }: CategorySelectorProps) {
  const categories = useQuery(api.categories.get, { type });
  const addCategory = useMutation(api.categories.add);
  
  const [isOpen, setIsOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  
  const filtered = (categories || []).filter(c => 
    c.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleCreate = async () => {
    if (!inputValue.trim()) return;
    const id = await addCategory({ name: inputValue.trim(), type, token });
    onChange(inputValue.trim());
    setInputValue('');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input 
            className="w-full bg-black/40 border border-white/10 p-4 text-sm text-white focus:outline-none focus:border-brand-gold transition-all placeholder:text-white/40"
            value={value || inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (value) onChange(''); // Clear value if typing
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Sélectionner ou créer une catégorie..."
          />
          {value && (
            <button 
              type="button"
              onClick={() => { onChange(''); setInputValue(''); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute z-50 mt-2 w-full bg-neutral-900 border border-white/10 shadow-2xl max-h-60 overflow-y-auto">
            {filtered.map((cat) => (
              <button
                key={cat._id}
                type="button"
                onClick={() => {
                  onChange(cat.name);
                  setInputValue('');
                  setIsOpen(false);
                }}
                className="w-full text-left px-6 py-4 text-sm text-gray-200 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
              >
                {cat.name}
              </button>
            ))}
            {inputValue.trim() && !filtered.find(c => c.name.toLowerCase() === inputValue.trim().toLowerCase()) && (
              <button
                type="button"
                onClick={handleCreate}
                className="w-full text-left px-6 py-4 text-sm bg-brand-gold/10 text-brand-gold hover:bg-brand-gold/20 transition-colors flex items-center justify-between"
              >
                <span>Créer "{inputValue}"</span>
                <Plus size={14} />
              </button>
            )}
            {inputValue === '' && filtered.length === 0 && (
              <div className="px-6 py-4 text-xs text-white/40 uppercase tracking-widest italic text-center">
                Aucune catégorie
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
