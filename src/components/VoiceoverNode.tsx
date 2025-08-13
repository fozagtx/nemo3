import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Volume2, Play, Download } from 'lucide-react';
import { Button } from './ui/button';

interface VoiceoverData {
  hookText: string;
  audioUrl: string | null;
  isGenerating: boolean;
  onGenerateVoiceover: () => void;
  onDownloadAudio: () => void;
}

const VoiceoverNode = memo(({ data, isConnectable }: NodeProps<VoiceoverData>) => {
  return (
    <div className="bg-gradient-to-br from-green-900 to-green-950 border-2 border-green-600 rounded-lg p-4 shadow-lg min-w-[250px]">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-green-400"
      />
      
      <div className="flex items-center space-x-2 mb-3">
        <Volume2 className="w-5 h-5 text-green-300" />
        <span className="text-white font-semibold">Voiceover Generator</span>
      </div>

      <div className="space-y-3">
        {data.hookText ? (
          <div className="p-3 rounded bg-green-900/30 border border-green-600">
            <p className="text-green-200 text-sm mb-1">Hook text:</p>
            <p className="text-white text-sm">{data.hookText}</p>
          </div>
        ) : (
          <div className="p-3 rounded bg-green-900/30 border border-green-600">
            <p className="text-green-300 text-sm">No hook text available</p>
          </div>
        )}

        {!data.audioUrl ? (
          <Button 
            onClick={data.onGenerateVoiceover}
            disabled={data.isGenerating || !data.hookText}
            size="sm"
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {data.isGenerating ? (
              <>
                <Volume2 className="w-4 h-4 mr-2 animate-pulse" />
                Generating Voiceover...
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 mr-2" />
                Generate Voiceover
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Play className="w-4 h-4 text-green-300" />
              <span className="text-green-200 text-sm">Voiceover ready!</span>
            </div>
            
            <audio src={data.audioUrl} controls className="w-full h-8" />
            
            <Button 
              onClick={data.onDownloadAudio}
              size="sm"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Audio
            </Button>
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-green-400"
      />
    </div>
  );
});

VoiceoverNode.displayName = 'VoiceoverNode';

export default VoiceoverNode;

