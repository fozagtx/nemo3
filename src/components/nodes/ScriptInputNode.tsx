import { useState, useCallback } from "react";
import { Handle, Position } from "reactflow";
import { FileText, Mic2, Copy, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
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
      toast.error("Please enter some script text to transcribe");
      return;
    }

    if (scriptText.trim().length < 10) {
      toast.error("Script text must be at least 10 characters long");
      return;
    }

    setIsTranscribing(true);

    try {
      await data.onTranscribe(scriptText.trim());
      toast.success("Script sent for voice-over generation!");
    } catch (error) {
      console.error("Transcription failed:", error);
      toast.error("Failed to process script. Please try again.");
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
    } catch (error) {
      console.error("Failed to paste:", error);
      toast.error("Failed to paste text. Please paste manually.");
    }
  }, []);

  const handleClear = useCallback(() => {
    setScriptText("");
    toast.info("Script text cleared");
  }, []);

  const characterCount = scriptText.length;
  const wordCount = scriptText.trim()
    ? scriptText.trim().split(/\s+/).length
    : 0;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 shadow-lg min-w-[320px] max-w-[400px]">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-blue-400 border-2 border-white"
      />

      {/* Header */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <FileText className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-blue-900 text-sm">Script Input</h3>
          <p className="text-xs text-blue-600">Paste your script text here</p>
        </div>
      </div>

      {/* Text Input Area */}
      <div className="space-y-3">
        <div className="relative">
          <Textarea
            value={scriptText}
            onChange={(e) => setScriptText(e.target.value)}
            placeholder="Paste or type your script text here...

Example:
'Hey everyone! Today I'm going to show you the secret to creating viral content that actually converts. This one simple trick changed everything for me...'

Make it engaging and conversational!"
            className="min-h-[120px] bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400 text-sm resize-none"
            disabled={isTranscribing}
          />

          {/* Character/Word Count */}
          <div className="absolute bottom-2 right-2 text-xs text-blue-500 bg-white px-2 py-1 rounded">
            {characterCount} chars • {wordCount} words
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handlePaste}
            size="sm"
            variant="outline"
            className="border-blue-200 text-blue-700 hover:bg-blue-50 flex-1"
            disabled={isTranscribing}
          >
            <Copy className="w-3 h-3 mr-1" />
            Paste
          </Button>

          <Button
            onClick={handleClear}
            size="sm"
            variant="outline"
            className="border-red-200 text-red-700 hover:bg-red-50"
            disabled={isTranscribing || !scriptText}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>

        {/* Transcribe Button */}
        <Button
          onClick={handleTranscribe}
          disabled={
            isTranscribing ||
            !scriptText.trim() ||
            scriptText.trim().length < 10
          }
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          {isTranscribing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Processing Script...
            </>
          ) : (
            <>
              <Mic2 className="w-4 h-4 mr-2" />
              Generate Voice-Over
            </>
          )}
        </Button>

        {/* Instructions */}
        <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-100">
          <strong>Tips:</strong> Write conversational, engaging scripts. Use
          direct language and include hooks to grab attention. Optimal length:
          50-200 words.
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-400 border-2 border-white"
      />
    </div>
  );
}
