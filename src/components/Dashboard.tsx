import { useState, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Headphones, Download, Loader2, LogOut, User as UserIcon, Play, Pause, Mic, FileAudio, Zap, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import FileUpload from './FileUpload';

interface DashboardProps {
  user: User;
}

export default function Dashboard({ user }: DashboardProps) {
  const [blogContent, setBlogContent] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFileName, setCurrentFileName] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement>(null);

  // Get API key from environment variables
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out successfully');
  };

  const handleTextExtracted = (text: string, fileName: string) => {
    setBlogContent(text);
    setCurrentFileName(fileName);
    toast.success(`Text extracted from ${fileName}`);
  };

  const validateContent = (content: string): boolean => {
    const length = content.trim().length;
    if (length < 300) {
      toast.error('Content must be at least 300 characters long');
      return false;
    }
    if (length > 1200) {
      toast.error('Content must not exceed 1200 characters');
      return false;
    }
    return true;
  };

  const convertToAudio = async () => {
    if (!blogContent.trim()) {
      toast.error('Please enter some content to convert');
      return;
    }

    if (!validateContent(blogContent)) {
      return;
    }

    if (!apiKey) {
      toast.error('ElevenLabs API key not configured. Please check your environment variables.');
      console.error('Missing VITE_ELEVENLABS_API_KEY environment variable');
      return;
    }

    if (!apiKey.startsWith('sk_')) {
      toast.error('Invalid ElevenLabs API key format. Key should start with "sk_"');
      console.error('Invalid API key format:', apiKey.substring(0, 5) + '...');
      return;
    }

    setIsConverting(true);
    setAudioUrl(null);

    try {
      // Create a conversational dialog from the blog content
      const dialogContent = `Here's an interesting article I'd like to share with you. ${blogContent}`;

      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/XrExE9yKIg1WjnnlVkGX', {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text: dialogContent,
          model_id: 'eleven_turbo_v2_5',
          voice_settings: {
            stability: 0.6,
            similarity_boost: 0.9,
            style: 0.0,
            use_speaker_boost: true
          }
        }),
      });

      if (!response.ok) {
        let errorMessage = `API Error: ${response.status}`;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail?.message || errorData.message || errorMessage;
        } catch (e) {
          // If we can't parse the error response, use the status
        }
        
        console.error('ElevenLabs API Error:', {
          status: response.status,
          statusText: response.statusText,
          errorMessage
        });
        
        throw new Error(errorMessage);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
      toast.success('Blog post converted to podcast successfully!');
    } catch (error: any) {
      console.error('Conversion error:', error);
      
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        toast.error('Invalid API key. Please contact administrator.');
      } else if (error.message.includes('quota') || error.message.includes('limit')) {
        toast.error('API quota exceeded. Please check your ElevenLabs account.');
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        toast.error('Network error. Please check your internet connection.');
      } else {
        toast.error(`Failed to convert: ${error.message}`);
      }
    } finally {
      setIsConverting(false);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const downloadAudio = () => {
    if (audioUrl) {
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = 'podcast-episode.mp3';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Audio download started!');
    }
  };

  const characterCount = blogContent.length;
  const isValidLength = characterCount >= 300 && characterCount <= 1200;

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Sidebar */}
      <div className="w-72 bg-gradient-to-b from-zinc-900 to-zinc-950 border-r border-zinc-800 p-6">
        <div className="flex items-center space-x-3 mb-8">
          <img 
            src="/nemo-g.png" 
            alt="nimo3 Logo" 
            className="w-10 h-10 rounded-lg"
          />
          <span className="text-white font-semibold text-lg">nimo3</span>
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-3 p-3 bg-zinc-800/50 rounded-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-zinc-400" />
            </div>
            <div>
              <div className="text-white font-medium">
                {user.user_metadata?.full_name || 'User'}
              </div>
              <div className="text-zinc-400 text-xs truncate max-w-[140px]">{user.email}</div>
            </div>
          </div>

          <Separator className="bg-zinc-800" />

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

          <Button 
            variant="ghost" 
            className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all duration-200"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Create Audio Content</h1>
            <p className="text-zinc-400 mb-8">Upload documents or paste content to convert to audio</p>
          </div>

          <FileUpload 
            onTextExtracted={handleTextExtracted}
            disabled={isConverting}
          />

          <Card className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-zinc-800 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <FileText className="w-5 h-5 mr-2 text-yellow-400" />
                Content to Convert
                {currentFileName && (
                  <Badge variant="secondary" className="ml-2 bg-zinc-700 text-zinc-300">
                    From: {currentFileName}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-zinc-400">
                {currentFileName 
                  ? 'Content extracted from uploaded file. You can edit it before converting.'
                  : 'Paste your content here or upload a file above.'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your content here or upload a file above..."
                value={blogContent}
                onChange={(e) => setBlogContent(e.target.value)}
                className="min-h-[300px] bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 resize-none focus:ring-2 focus:ring-yellow-400/20 transition-all duration-200"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`text-sm ${isValidLength ? 'text-green-400' : characterCount > 1200 ? 'text-red-400' : 'text-yellow-400'}`}> 
                    {characterCount}/1200 characters
                  </div>
                  {characterCount < 300 && characterCount > 0 && (
                    <Badge variant="destructive" className="bg-red-900 text-red-300">
                      Need {300 - characterCount} more characters
                    </Badge>
                  )}
                  {characterCount > 1200 && (
                    <Badge variant="destructive" className="bg-red-900 text-red-300">
                      {characterCount - 1200} characters over limit
                    </Badge>
                  )}
                  {isValidLength && (
                    <Badge variant="secondary" className="bg-green-900 text-green-300">
                      Ready to convert
                    </Badge>
                  )}
                </div>
                <Button 
                  onClick={convertToAudio}
                  disabled={isConverting || !isValidLength}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 shadow-lg"
                >
                  {isConverting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Dialog...
                    </>
                  ) : (
                    'Convert to Audio'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {audioUrl && (
            <Card className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-zinc-800 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Headphones className="w-5 h-5 mr-2" />
                  Your Audio is Ready!
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Your content has been converted to audio using ElevenLabs AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-zinc-800 to-zinc-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center shadow-lg">
                        <Headphones className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <div className="text-white font-medium">Generated Audio</div>
                        <div className="text-zinc-400 text-sm">Ready for playback and download</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-green-900 text-green-300">
                        Complete
                      </Badge>
                      <Button 
                        onClick={togglePlayback}
                        size="sm"
                        variant="outline"
                        className="border-zinc-600 text-white hover:bg-zinc-700 transition-all duration-200"
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="w-4 h-4 mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Play
                          </>
                        )}
                      </Button>
                      <Button 
                        onClick={downloadAudio}
                        size="sm"
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 shadow-lg"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <audio
                    ref={audioRef}
                    src={audioUrl}
                    onEnded={() => setIsPlaying(false)}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    className="w-full"
                    controls
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
