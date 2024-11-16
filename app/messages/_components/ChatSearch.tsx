import React from "react";
import { FiSearch } from "react-icons/fi";

const ChatSearch = () => {
  return (
    <div className="mx-1">
      <label className="input flex items-center gap-3 rounded-2xl shadow-md shadow-violet-200 border border-slate-100">
        <FiSearch size={22} color="#7C7C7C" />
        <input type="text" className="grow" placeholder="Search" />
      </label>
    </div>
  );
};

export default ChatSearch;
