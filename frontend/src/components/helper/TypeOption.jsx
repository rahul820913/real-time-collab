import React, { useState } from 'react';
import { Search, ChevronDown, Layout, Server, Library, ChevronRight } from 'lucide-react';
const TypeOption = ({ icon: Icon, label, selected, onClick }) => {
    return (
      <button
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-3 border rounded-lg transition-all ${
          selected
            ? 'border-slate-900 ring-1 ring-slate-900 bg-slate-50'
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }`}
      >
        <Icon className={`w-5 h-5 ${selected ? 'text-slate-900' : 'text-gray-500'}`} />
        <span className={`font-medium ${selected ? 'text-slate-900' : 'text-gray-700'}`}>
          {label}
        </span>
      </button>
    );
  };

  export default TypeOption;