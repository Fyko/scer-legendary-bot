import { memo } from 'react';
import { Card } from './Card';
import { Avatar } from './Avatar';
import type { LatestEvent } from '../../types';
import { getRelativeTime } from '../../utils/date';

interface EventCardProps {
  event: LatestEvent;
  className?: string;
}

// Quirky phrases for the Majeggstics crew! 🥚
const legendaryPhrases = [
  "cracked open a legendary!",
  "hatched something legendary!",
  "got blessed by Wonky!",
  "struck legendary gold!",
  "found a legendary egg-ception!",
  "rolled the legendary dice!",
  "got egg-ceptionally lucky!",
  "discovered a legendary shell!",
  "hit the legendary jackpot!",
  "unlocked legendary status!",
  "stumbled upon legendary greatness!",
  "achieved legendary eggcellence!"
];

// Get a consistent random phrase for each user+timestamp combo
const getRandomPhrase = (userId: string, timestamp: string): string => {
  // easter eggs!
  if (userId === '597011699119292416') { //scer
    return 'just wanted to see their name on the board!';
  } else if (userId === '176010316675678208') { // dino
    return "might've gotten a legendary!";
  }

  const seed = userId + timestamp;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  const index = Math.abs(hash) % legendaryPhrases.length;
  const phrase = legendaryPhrases[index];
  
  if (userId === '211138529437155328') { // gomero
    return `${phrase} why am i not surprised...`;
  }
  
  return phrase
};

/**
 * Individual event card component for the latest events section
 */
export const EventCard = memo(function EventCard({
  event,
  className = ''
}: EventCardProps) {
  const randomPhrase = getRandomPhrase(event.user.id, event.created_at);

  return (
    <Card 
      variant="glass" 
      padding="md" 
      hover={true}
      className={`group animate-fade-in ${className}`}
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar
            src={event.user.avatar_url}
            alt={`${event.user.username}'s avatar`}
            size="sm"
            borderColor="border-green-400/70"
            className="group-hover:scale-110 transition-transform duration-300"
          />
          {/* Animated ring around avatar */}
          <div className="absolute -inset-1 bg-gradient-to-r from-green-400/50 to-emerald-500/50 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm mb-1">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
            <span className="font-medium text-white group-hover:text-green-400 transition-colors duration-300">
              {event.user.username}
            </span>
          </div>
          
          <div className="text-slate-400 font-medium text-sm mb-1">
            {randomPhrase}
          </div>
          
          <div className="text-xs text-slate-500 font-medium">
            {getRelativeTime(event.created_at)}
          </div>
        </div>

        {/* Sparkle effect */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <span className="text-yellow-400 text-lg animate-spin">✨</span>
        </div>
      </div>
    </Card>
  );
}); 
