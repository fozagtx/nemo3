import React from 'react';

const Sidebar = () => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <button className="w-full bg-yellow-400 text-black font-bold py-2 rounded mb-2 hover:bg-yellow-500 transition">Generate Hook</button>
        <button className="w-full bg-yellow-400 text-black font-bold py-2 rounded mb-2 hover:bg-yellow-500 transition">Generate Voiceover</button>
      </div>
      <div>
        <label className="block text-white mb-2">Upload Image</label>
        <input type="file" accept="image/*" className="block w-full text-white file:bg-yellow-400 file:text-black file:rounded file:px-4 file:py-2" />
      </div>
      <div>
        <div className="text-zinc-400 text-xs mb-2">Stickers/Icons</div>
        <div className="flex gap-2">
          <span className="bg-zinc-800 rounded p-2">🔥</span>
          <span className="bg-zinc-800 rounded p-2">🎉</span>
          <span className="bg-zinc-800 rounded p-2">💡</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
