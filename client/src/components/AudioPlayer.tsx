import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Download, Loader } from 'lucide-react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

interface AudioPlayerProps {
  audioUrl: string | null;
  articleTitle: string;
  onSynthesize?: () => Promise<string>;
  isSynthesizing?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  articleTitle,
  onSynthesize,
  isSynthesizing = false,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { audioRef, state, togglePlayPause, seek, setVolume, setPlaybackRate } = useAudioPlayer(audioUrl);

  const handleSynthesize = async () => {
    if (!onSynthesize) return;
    setIsGenerating(true);
    try {
      await onSynthesize();
    } finally {
      setIsGenerating(false);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!audioUrl && !onSynthesize) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <Volume2 className="w-6 h-6 text-teal-600 flex-shrink-0" />
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">Ouvir Artigo</h3>
            
            {audioUrl ? (
              <>
                <audio ref={audioRef} src={audioUrl} />
                
                {/* Progress Bar */}
                <div className="mb-3">
                  <input
                    type="range"
                    min="0"
                    max={state.duration || 0}
                    value={state.currentTime}
                    onChange={(e) => seek(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-teal-600"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>{formatTime(state.currentTime)}</span>
                    <span>{formatTime(state.duration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={togglePlayPause}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    {state.isPlaying ? (
                      <>
                        <Pause className="w-4 h-4" />
                        Pausar
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Reproduzir
                      </>
                    )}
                  </button>

                  {/* Volume Control */}
                  <div className="flex items-center gap-2">
                    <VolumeX className="w-4 h-4 text-gray-600" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={state.volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="w-20 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-teal-600"
                    />
                  </div>

                  {/* Playback Speed */}
                  <select
                    value={state.playbackRate}
                    onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                    className="px-3 py-1 border border-gray-300 rounded text-sm bg-white hover:bg-gray-50"
                  >
                    <option value={0.75}>0.75x</option>
                    <option value={1}>1x</option>
                    <option value={1.25}>1.25x</option>
                    <option value={1.5}>1.5x</option>
                    <option value={2}>2x</option>
                  </select>

                  {/* Download Button */}
                  <a
                    href={audioUrl}
                    download={`${articleTitle}.mp3`}
                    className="flex items-center gap-2 px-3 py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Baixar
                  </a>
                </div>
              </>
            ) : (
              <button
                onClick={handleSynthesize}
                disabled={isGenerating || isSynthesizing}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors"
              >
                {isGenerating || isSynthesizing ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Gerando áudio...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Gerar Áudio
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
