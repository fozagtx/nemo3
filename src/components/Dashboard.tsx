import { useState, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Headphones, Download, Loader2, LogOut, User as UserIcon, Play, Pause, Settings } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

interface DashboardProps {
  user: User;
}

export default function Dashboard({ user }: DashboardProps) {
  const [blogContent, setBlogContent] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out successfully');
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

    if (!apiKey.trim()) {
      toast.error('Please enter your ElevenLabs API key');
      setShowApiKeyInput(true);
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail?.message || `API Error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
      toast.success('Blog post converted to podcast successfully!');
    } catch (error: any) {
      console.error('Conversion error:', error);
      if (error.message.includes('401')) {
        toast.error('Invalid API key. Please check your ElevenLabs API key.');
        setShowApiKeyInput(true);
      } else if (error.message.includes('quota')) {
        toast.error('API quota exceeded. Please check your ElevenLabs account.');
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
      <div className="w-64 bg-zinc-900 border-r border-zinc-800 p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
            <Headphones className="w-5 h-5 text-black" />
          </div>
          <span className="text-white font-semibold text-lg">PodcastAI</span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-zinc-400" />
            </div>
            <div>
              <div className="text-white font-medium">
                {user.user_metadata?.full_name || 'User'}
              </div>
              <div className="text-zinc-400 text-sm">{user.email}</div>
            </div>
          </div>

          <Separator className="bg-zinc-800" />

          <Button 
            variant="ghost" 
            className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-800"
            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
          >
            <Settings className="w-4 h-4 mr-2" />
            API Settings
          </Button>

          <Button 
            variant="ghost" 
            className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-800"
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
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Create Podcast</h1>
            <p className="text-zinc-400">
              Paste your blog post content below and we'll convert it into an engaging podcast episode using ElevenLabs AI.
            </p>
          </div>

          {showApiKeyInput && (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">ElevenLabs API Configuration</CardTitle>
                <CardDescription className="text-zinc-400">
                  Enter your ElevenLabs API key to enable text-to-speech conversion
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey" className="text-white">API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Enter your ElevenLabs API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                  />
                </div>
                <div className="text-sm text-zinc-400">
                  Get your API key from{' '}
                  <a 
                    href="https://elevenlabs.io/app/speech-synthesis" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white hover:underline"
                  >
                    ElevenLabs Dashboard
                  </a>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Blog Post Content</CardTitle>
              <CardDescription className="text-zinc-400">
                Paste your blog post or article content here (300-1200 characters)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your blog post content here..."
                value={blogContent}
                onChange={(e) => setBlogContent(e.target.value)}
                className="min-h-[300px] bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 resize-none"
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
                  className="bg-white text-black hover:bg-zinc-200"
                >
                  {isConverting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Dialog...
                    </>
                  ) : (
                    'Convert to Podcast'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {audioUrl && (
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Headphones className="w-5 h-5 mr-2" />
                  Your Podcast is Ready!
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Your blog post has been converted to an audio podcast using ElevenLabs AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                        <Headphones className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <div className="text-white font-medium">Generated Podcast</div>
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
                        className="border-zinc-600 text-white hover:bg-zinc-700"
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
                        className="bg-white text-black hover:bg-zinc-200"
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