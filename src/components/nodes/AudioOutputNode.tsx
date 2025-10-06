import { useState, useRef, useCallback } from "react";
import { Handle, Position } from "reactflow";
import {
  Volume2,
  Download,
  Play,
  Pause,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { toast } from "sonner";

interface AudioOutputNodeData {
  audioUrl: string | null;
  audioBlob: Blob | null;
  scriptText: string;
  isGenerating: boolean;
  onRegenerate?: () => void;
  onClear?: () => void;
}

interface AudioOutputNodeProps {
  data: AudioOutputNodeData;
}

export function AudioOutputNode({ data }: AudioOutputNodeProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayPause = useCallback(() => {
    if (!audioRef.current || !data.audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
        toast.error("Failed to play audio");
      });
    }
  }, [isPlaying, data.audioUrl]);

  const handleDownload = useCallback(() => {
    if (!data.audioUrl) {
      toast.error("No audio available to download");
      return;
    }

    try {
      const link = document.createElement("a");
      link.href = data.audioUrl;
      link.download = `voiceover-${Date.now()}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Audio downloaded successfully!");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download audio");
    }
  }, [data.audioUrl]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const renderContent = () => {
    if (data.isGenerating) {
      return (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-center py-6 sm:py-8">
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 border-3 border-border border-t-primary rounded-full animate-spin mx-auto mb-3" />
              <p className="text-foreground font-medium text-sm sm:text-base">
                Generating voice-over...
              </p>
              <p className="text-muted-foreground text-xs sm:text-sm mt-1">
                Please wait, this may take a few seconds
              </p>
            </div>
          </div>

          {data.scriptText && (
            <div className="p-2 sm:p-3 bg-secondary rounded-lg border-border">
              <p className="text-muted-foreground text-xs mb-1 font-medium">
                Processing script:
              </p>
              <p className="text-foreground text-xs sm:text-sm line-clamp-3">
                {data.scriptText}
              </p>
            </div>
          )}
        </div>
      );
    }

    if (!data.audioUrl) {
      return (
        <div className="text-center py-6 sm:py-8">
          <Volume2 className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-foreground font-medium text-sm sm:text-base">
            No audio generated yet
          </p>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
            Paste the script text and generate voice-over
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-3 sm:space-y-4">
        {/* Script Preview */}
        {data.scriptText && (
          <div className="p-2 sm:p-3 bg-secondary rounded-lg border-border">
            <p className="text-muted-foreground text-xs mb-1 font-medium">
              Generated from:
            </p>
            <p className="text-foreground text-xs sm:text-sm line-clamp-2">
              {data.scriptText}
            </p>
          </div>
        )}

        {/* Audio Player */}
        <div className="bg-background rounded-lg p-3 sm:p-4 border-border">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-3">
            <Button
              onClick={handlePlayPause}
              size="sm"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full p-0"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </Button>

            <div className="flex-1">
              <Progress value={progressPercent} className="h-1.5 sm:h-2" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>

          {/* Hidden audio element */}
          <audio
            ref={audioRef}
            src={data.audioUrl}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
            preload="metadata"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handleDownload}
            size="sm"
            variant="secondary"
            className="text-xs sm:text-sm"
          >
            <Download className="w-3 h-3 mr-1" />
            Download MP3
          </Button>

          {data.onRegenerate && (
            <Button
              onClick={data.onRegenerate}
              size="sm"
              variant="outline"
              className="text-xs sm:text-sm"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Regenerate
            </Button>
          )}
        </div>

        {data.onClear && (
          <Button
            onClick={data.onClear}
            size="sm"
            variant="destructive"
            className="w-full text-xs sm:text-sm"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Clear Audio
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="bg-card border-2 border-border rounded-xl p-3 sm:p-4 shadow-lg w-full max-w-sm sm:min-w-[320px] sm:max-w-[380px]">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-ring border-2 border-background"
      />

      {/* Header */}
      <div className="flex items-center space-x-2 mb-3 sm:mb-4">
        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-secondary rounded-lg flex items-center justify-center">
          <Volume2 className="w-4 h-4 text-secondary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-sm">Audio Output</h3>
          <p className="text-xs text-muted-foreground">
            Generated voice-over playback
          </p>
        </div>
      </div>

      {/* Content */}
      {renderContent()}

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-ring border-2 border-background"
      />
    </div>
  );
}
