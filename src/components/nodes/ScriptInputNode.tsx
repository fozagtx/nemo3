import { useState, useCallback } from "react";
import { Handle, Position } from "reactflow";
import { FileText, Mic2, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ScriptInputNodeData {
  onTranscribe: (text: string) => void;
}

interface ScriptInputNodeProps {
  data: ScriptInputNodeData;
}

export function ScriptInputNode({ data }: ScriptInputNodeProps) {
  const [scriptText, setScriptText] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);

  const handleTranscribe = useCallback(async () => {
    if (!scriptText.trim()) {
      toast.error("Please enter script text");
      return;
    }
    if (scriptText.trim().length < 10) {
      toast.error("Text must be at least 10 characters long");
      return;
    }

    setIsTranscribing(true);
    try {
      await data.onTranscribe(scriptText.trim());
      toast.success("Script sent for voice-over generation!");
    } catch (error) {
      console.error("Transcription failed:", error);
      toast.error("Failed to process script");
    } finally {
      setIsTranscribing(false);
    }
  }, [scriptText, data]);

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setScriptText(text);
        toast.success("Text pasted successfully!");
      }
    } catch {
      toast.error("Clipboard unavailable. Please paste manually.");
    }
  }, []);

  const handleClear = useCallback(() => {
    setScriptText("");
    toast.info("Script cleared");
  }, []);

  const characterCount = scriptText.length;
  const wordCount = scriptText.trim()
    ? scriptText.trim().split(/\s+/).length
    : 0;

  return (
    <div className="bg-card border-2 border-border rounded-xl p-3 sm:p-4 shadow-lg w-full max-w-sm sm:min-w-[320px] sm:max-w-[400px]">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-primary border-2 border-white"
      />

      {/* Header */}
      <div className="flex items-center space-x-2 mb-3 sm:mb-4">
        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <FileText className="w-4 h-4 text-primary" />
        </div>
        <h3 className="font-semibold text-foreground text-sm">
          Script Input
        </h3>
      </div>

      {/* Text Input */}
      <div className="relative mb-2 sm:mb-3">
        <Textarea
          value={scriptText}
          onChange={(e) => setScriptText(e.target.value)}
          placeholder="Paste or type your script here..."
          className="min-h-[100px] sm:min-h-[120px] bg-background text-foreground border-border focus:border-primary focus:ring-primary text-xs sm:text-sm resize-none"
          disabled={isTranscribing}
        />
        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-card/80 px-1.5 py-0.5 rounded">
          {characterCount} chars · {wordCount} words
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mb-2 sm:mb-3">
        <Button
          onClick={handlePaste}
          size="sm"
          variant="outline"
          className="flex-1 text-xs sm:text-sm"
          disabled={isTranscribing}
        >
          <Copy className="w-3 h-3 mr-1" /> Paste
        </Button>
        <Button
          onClick={handleClear}
          size="sm"
          variant="destructive"
          className="text-xs sm:text-sm"
          disabled={isTranscribing || !scriptText}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>

      {/* Transcribe */}
      <Button
        onClick={handleTranscribe}
        disabled={
          isTranscribing || !scriptText.trim() || scriptText.trim().length < 10
        }
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs sm:text-sm"
      >
        {isTranscribing ? (
          <>
            <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
            Processing...
          </>
        ) : (
          <>
            <Mic2 className="w-4 h-4 mr-2" /> Generate Voice-Over
          </>
        )}
      </Button>

      {/* Tips */}
      <div className="text-xs text-muted-foreground bg-card p-2 rounded border border-border mt-3">
        <strong>Tips:</strong> Write in a conversational tone, include hooks,
        and keep scripts between 50–200 words for best results.
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-primary border-2 border-white"
      />
    </div>
  );
}
