"use client";

import { useState } from "react";

export default function SearchBar({
  placeholder = "Search articles, topics, or tags...",
  onSearch,
}) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!onSearch) return;
    onSearch(query.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
        />

        <button
          type="submit"
          className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Search
        </button>
      </div>
    </form>
  );
}