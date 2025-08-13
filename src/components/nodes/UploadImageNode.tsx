import { useState } from "react";

export function UploadImageNode() {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const readFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }
    setError(null);
    setLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const onFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    readFile(file);
  };

  const onDrop: React.DragEventHandler<HTMLLabelElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    readFile(file);
  };

  const clear = () => {
    setPreview(null);
    setError(null);
  };

  return (
    <div className="relative w-72 select-none">
      <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-yellow-500/20 to-amber-500/20 blur-sm" />
      <div className="relative px-4 py-3 bg-zinc-900/95 backdrop-blur border border-zinc-800 rounded-xl shadow text-white">
        <div className="flex items-center justify-between">
          <div className="font-semibold">Upload Image</div>
          {preview && (
            <button onClick={clear} className="text-xs text-zinc-300 hover:text-white">Reset</button>
          )}
        </div>
        <div className="text-xs text-zinc-400 mb-2">Drag & drop or click to select</div>

        <label
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={
            `group flex flex-col items-center justify-center gap-2 w-full h-28 rounded-lg border-2 border-dashed transition-colors ` +
            `${dragOver ? "border-yellow-400 bg-zinc-800/60" : "border-zinc-700 hover:border-zinc-600 bg-zinc-900/40"}`
          }
        >
          <svg className="w-6 h-6 text-zinc-400 group-hover:text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span className="text-xs text-zinc-400">Drop image here or click</span>
          <input type="file" accept="image/*" onChange={onFile} className="hidden" />
        </label>

        {loading && (
          <div className="mt-2 text-xs text-yellow-400 animate-pulse">Loading preview...</div>
        )}

        {error && (
          <div className="mt-2 text-xs text-red-400">{error}</div>
        )}

        {preview && (
          <div className="mt-3 overflow-hidden rounded-md border border-zinc-700">
            <img src={preview} alt="preview" className="w-full h-40 object-cover transition-transform duration-300 hover:scale-[1.02]" />
          </div>
        )}
      </div>
    </div>
  );
}
