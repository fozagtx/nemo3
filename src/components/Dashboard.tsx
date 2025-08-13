import { useState } from 'react';
import { UserButton } from '@civic/auth/react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Mic, FileAudio } from 'lucide-react';
import { toast } from 'sonner';

export default function Dashboard() {
  const [isConverting, setIsConverting] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  // Fixed sidebar; no toggle logic
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [goal, setGoal] = useState('');

  const [isAddingImage, setIsAddingImage] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [hookIdeas, setHookIdeas] = useState<string[]>([]);
  const [selectedHook, setSelectedHook] = useState<string>('');
  const [finalHook, setFinalHook] = useState<string>('');
  const [renderedImageUrl, setRenderedImageUrl] = useState<string | null>(null);


  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsAddingImage(true);
    // Accept images of any size
    setTimeout(() => {
      setImagePreview(URL.createObjectURL(file));
      setIsAddingImage(false);
      setCurrentStep(2);
      toast.success('Image added');
    }, 600);
  };

  // Drag & drop support for image upload
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
    const file = e.dataTransfer.files[0];
    setIsAddingImage(true);
    setTimeout(() => {
      setImagePreview(URL.createObjectURL(file));
      setIsAddingImage(false);
      setCurrentStep(2);
      toast.success('Image added');
    }, 600);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Generate initial hook ideas from goal
  const generateHookIdeasFromGoal = () => {
    if (!goal.trim()) {
      toast.error('Enter a goal first');
      return;
    }
    const ideas = [
      `What if you could ${goal.toLowerCase()} in 10 seconds?`,
      `Stop scrolling! Here's how to ${goal.toLowerCase()} fast`,
      `${goal} with one simple trick you're not using`,
    ];
    setHookIdeas(ideas);
    setSelectedHook(ideas[0]);
    setCurrentStep(3);
  };

  // Proceed to voiceover using final hook
  const proceedToVoiceover = () => {
    const text = finalHook || selectedHook;
    if (!text) {
      toast.error('Select or write a hook');
      return;
    }
    setFinalHook(text);
    setCurrentStep(4);
  };

  // Convert finalHook to audio (voiceover)
  const convertHookToVoiceover = async () => {
    const text = finalHook || selectedHook;
    if (!text) {
      toast.error('No hook to convert');
      return;
    }
    if (!apiKey) {
      toast.error('ElevenLabs API key not configured. Please check your environment variables.');
      return;
    }
    if (!apiKey.startsWith('sk_')) {
      toast.error('Invalid ElevenLabs API key format. Key should start with "sk_"');
      return;
    }
    setIsConverting(true);
    setAudioUrl(null);
    try {
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/XrExE9yKIg1WjnnlVkGX', {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_turbo_v2_5',
          voice_settings: {
            stability: 0.6,
            similarity_boost: 0.9,
            style: 0.0,
            use_speaker_boost: true,
          },
        }),
      });
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      toast.success('Voiceover generated');
      setCurrentStep(5);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to generate voiceover');
    } finally {
      setIsConverting(false);
    }
  };

  // Render image with white hook text overlay and export
  const renderHookOnImage = async () => {
    if (!imagePreview) {
      toast.error('Upload an image first');
      return;
    }
    const text = finalHook || selectedHook || goal || '';
    if (!text) {
      toast.error('No hook text to render');
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imagePreview;
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Image load error'));
    });

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    // White text style with shadow at bottom
    const margin = Math.max(16, canvas.width * 0.03);
    const fontSize = Math.max(32, Math.floor(canvas.width * 0.06));
    ctx.font = `bold ${fontSize}px Inter, Arial, sans-serif`;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    // Wrap text
    const maxWidth = canvas.width - margin * 2;
    const lines: string[] = [];
    const words = text.split(' ');
    let line = '';
    for (let i = 0; i < words.length; i++) {
      const testLine = line ? line + ' ' + words[i] : words[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth) {
        if (line) lines.push(line);
        line = words[i];
    } else {
        line = testLine;
      }
    }
    if (line) lines.push(line);
    const lineHeight = fontSize * 1.2;
    let y = canvas.height - margin;
    for (let i = lines.length - 1; i >= 0; i--) {
      ctx.fillText(lines[i], canvas.width / 2, y);
      y -= lineHeight;
    }
    setRenderedImageUrl(canvas.toDataURL('image/jpeg', 0.92));
    toast.success('Image rendered with hook');
  };

  // Download rendered image
  const downloadImage = () => {
    if (!renderedImageUrl) {
      toast.error('Render the image first');
      return;
    }
    const link = document.createElement('a');
    link.href = renderedImageUrl;
    link.download = 'tiktok-image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Image downloaded');
  };

  // Download audio
  const downloadAudio = () => {
    if (!audioUrl) {
      toast.error('Generate voiceover first');
      return;
    }
      const link = document.createElement('a');
      link.href = audioUrl;
    link.download = 'tiktok-voiceover.mp3';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    toast.success('Audio downloaded');
  };

  // removed blog-related counters

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Sidebar */}
      <div className={`w-72 bg-gradient-to-b from-zinc-900 to-zinc-950 border-r border-zinc-800 p-6`}>
        <div className="flex items-center space-x-3 mb-8">
          <img 
            src="/nemo-g.png" 
            alt="nemo3 Logo" 
            className="w-10 h-10 rounded-lg"
          />
          <span className="text-white font-semibold text-lg">nemo3</span>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Mic className="w-4 h-4 text-yellow-400" />
                  <span className="text-zinc-300 text-sm">Conversions</span>
                </div>
                <span className="text-white font-medium">0</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FileAudio className="w-4 h-4 text-yellow-400" />
                  <span className="text-zinc-300 text-sm">Audio Files</span>
                </div>
                <span className="text-white font-medium">0</span>
              </div>
            </div>
          </div>
          <Separator className="bg-zinc-800" />
          <div className="w-full">
            <UserButton 
              className="w-full bg-zinc-800/50 hover:bg-zinc-800/70 text-white border-zinc-700"
              dropdownButtonClassName="bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-600"
            />
          </div>
        </div>
      </div>
      {/* Sidebar toggle removed for consistent layout */}
      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* TikTok Hook Generator Section (guided) */}
          <Card className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-zinc-800 shadow-2xl mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <span className="mr-2">🎣</span>
                TikTok Hook Generator
              </CardTitle>
              <CardDescription className="text-zinc-400">
                A simple flow: upload image → get hook ideas → refine → generate voiceover → render & download.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Step indicator */}
              <div className="flex items-center justify-center gap-2 text-xs">
                {[1,2,3,4,5].map((s) => (
                  <div key={s} className={`px-2 py-1 rounded ${currentStep === s ? 'bg-yellow-400 text-black' : 'bg-zinc-800 text-zinc-300'}`}>Step {s}</div>
                ))}
                    </div>

              {currentStep === 1 && (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center bg-zinc-900/50"
                >
                  <div className="text-white mb-2">Drag & drop an image here, or click to upload</div>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-white file:bg-yellow-400 file:text-black file:rounded file:px-4 file:py-2 mx-auto max-w-xs" />
                  {isAddingImage && (
                    <div className="mt-4 text-zinc-400 text-sm">Adding image...</div>
                  )}
                  {imagePreview && (
                    <div className="mt-4 flex justify-center">
                      <img src={imagePreview} alt="Preview" className="w-40 h-64 object-cover rounded-lg" />
                  </div>
                  )}
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-white mb-2">Your Goal</label>
                    <input
                      type="text"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      placeholder="e.g. Get more followers, promote a product..."
                      className="w-full bg-zinc-800 border-zinc-700 text-white px-3 py-2 rounded focus:ring-2 focus:ring-yellow-400/20"
                    />
                  </div>
                  <Button onClick={generateHookIdeasFromGoal} className="bg-yellow-400 text-black hover:bg-yellow-500">Get Hook Ideas</Button>
              </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="grid gap-2">
                    {hookIdeas.map((idea, idx) => (
                      <label key={idx} className={`p-3 rounded border ${selectedHook === idea ? 'border-yellow-400 bg-zinc-800' : 'border-zinc-700 bg-zinc-900'}`}>
                        <input type="radio" name="hook" className="mr-2" checked={selectedHook === idea} onChange={() => setSelectedHook(idea)} />
                        <span className="text-white">{idea}</span>
                      </label>
                    ))}
                      </div>
                      <div>
                    <label className="block text-white mb-2">Refine or write your own</label>
                    <input
                      type="text"
                      value={finalHook}
                      onChange={(e) => setFinalHook(e.target.value)}
                      placeholder={selectedHook || 'Type your hook...'}
                      className="w-full bg-zinc-800 border-zinc-700 text-white px-3 py-2 rounded"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => setCurrentStep(2)} variant="outline" className="border-zinc-700 text-white">Back</Button>
                    <Button onClick={proceedToVoiceover} className="bg-yellow-400 text-black hover:bg-yellow-500">Continue</Button>
                      </div>
                    </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="text-white">Generate voiceover for:</div>
                  <div className="p-3 rounded bg-zinc-900 text-white border border-zinc-700">{finalHook || selectedHook}</div>
                  <Button onClick={convertHookToVoiceover} disabled={isConverting} className="bg-yellow-400 text-black hover:bg-yellow-500">
                    {isConverting ? 'Generating...' : 'Generate Voiceover'}
                      </Button>
                    </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-4">
                  <div className="text-white">Voiceover ready.</div>
                  {audioUrl && (
                    <audio src={audioUrl} controls className="w-full" />
                  )}
                  <div className="flex gap-2 flex-wrap">
                    <Button onClick={renderHookOnImage} className="bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-700">Render Hook on Image</Button>
                    {renderedImageUrl && (
                      <Button onClick={downloadImage} className="bg-green-600 text-white hover:bg-green-700">Download Image</Button>
                    )}
                    {audioUrl && (
                      <Button onClick={downloadAudio} className="bg-blue-600 text-white hover:bg-blue-700">Download Audio</Button>
                    )}
                  </div>
                  {renderedImageUrl && (
                    <div className="mt-2 flex justify-center">
                      <img src={renderedImageUrl} alt="Rendered" className="w-40 rounded" />
                  </div>
                  )}
                </div>
              )}
              </CardContent>
            </Card>
          {/* Blog-related UI removed */}
        </div>
      </div>
    </div>
  );
}
