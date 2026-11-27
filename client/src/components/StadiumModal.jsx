import React from 'react';
import { sound } from '../game/SoundEffects';
import { ALL_STADIUMS, getStadium, TIME_OF_DAY_CONFIGS, WEATHER_CONFIGS } from '../game/Stadiums';

export default function StadiumModal({
  isOpen,
  onClose,
  stadiumKey = 'colosseum',
  onSelectStadium,
  timeOfDay = 'day',
  onChangeTimeOfDay,
  weather = 'sunny',
  onChangeWeather,
  title = 'WORLD STADIUMS & ATMOSPHERE',
  confirmLabel = 'CONFIRM & APPLY'
}) {
  if (!isOpen) return null;

  const currentStadium = getStadium(stadiumKey) || ALL_STADIUMS[0];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#0f172a] to-[#090d16] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/70">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🏟️</span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white tracking-wide flex items-center gap-2">
                {title}
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-400">
                12 Iconic international arenas • Authentic turf physics • Day / Afternoon / Sunset / Night
              </p>
            </div>
          </div>
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Broadcast Info Strip */}
        <div className="px-5 py-2 bg-emerald-950/40 border-b border-emerald-500/20 flex items-center justify-between text-[10px] text-emerald-300 font-bold">
          <div className="flex items-center gap-1.5">
            <span>✨</span>
            <span>PRO VECTOR CRICKETERS & VENUES ACTIVE</span>
            <span className="text-emerald-400 font-normal hidden sm:inline">• High-definition vector cricketers with lighting shadows</span>
          </div>
          <span className="text-slate-400 text-[9px] font-mono">[T] Light • [Y] Stadium</span>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {/* 1. Time of Day / Atmosphere */}
          <div>
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>🕒</span> Time of Day & Lighting
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(TIME_OF_DAY_CONFIGS).map(([key, cfg]) => {
                const isSelected = timeOfDay === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      if (onChangeTimeOfDay) onChangeTimeOfDay(key);
                      sound.playClick();
                    }}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md shadow-amber-500/10'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-sm mb-0.5">
                      <span>{cfg.icon}</span>
                      <span className="font-black text-xs">{cfg.name}</span>
                    </div>
                    <div className="text-[9px] text-slate-400 line-clamp-1">{cfg.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Weather Conditions */}
          <div>
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>🌤️</span> Pitch Weather Conditions
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(WEATHER_CONFIGS).map(([key, cfg]) => {
                const isSelected = weather === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      if (onChangeWeather) onChangeWeather(key);
                      sound.playClick();
                    }}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-sky-500/20 border-sky-400 text-sky-200 shadow-md shadow-sky-500/10'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-sm mb-0.5">
                      <span>{cfg.icon}</span>
                      <span className="font-black text-xs">{cfg.name}</span>
                    </div>
                    <div className="text-[9px] text-slate-400 line-clamp-1">{cfg.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Stadium Selection (12 Venues) */}
          <div>
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span>🏟️</span> Select Match Venue ({ALL_STADIUMS.length} Arenas)
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold">
                Current: {currentStadium?.name}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {ALL_STADIUMS.map((st) => {
                const isSelected = stadiumKey === st.id;
                const pitchBadge =
                  st.pitchType === 'grass_green' ? '🟢 Green Seamer' :
                  st.pitchType === 'dusty_turner' ? '🟡 Dusty Turner' :
                  st.pitchType === 'bouncy_clay' ? '🔴 Bouncy Clay' :
                  st.pitchType === 'red_soil' ? '🟠 Red Soil' :
                  st.pitchType === 'compact_turf' ? '🟤 Compact Turf' : '⚪ Hard Surface';

                return (
                  <button
                    key={st.id}
                    onClick={() => {
                      if (onSelectStadium) onSelectStadium(st.id);
                      sound.playClick();
                    }}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                      isSelected
                        ? 'bg-gradient-to-br from-emerald-950/70 to-slate-900/90 border-emerald-400 shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400'
                        : 'bg-slate-900/70 border-slate-800/90 hover:border-slate-700 hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <div className="font-black text-white text-xs flex items-center gap-1.5">
                          <span className="text-base">{st.flag}</span>
                          <span className="line-clamp-1">{st.name}</span>
                        </div>
                        {isSelected && (
                          <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-black font-black text-[8px] uppercase tracking-wider flex-shrink-0">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mb-1.5">
                        <span>📍</span>
                        <span>{st.location}</span>
                        <span className="text-slate-600">•</span>
                        <span>👥 {st.capacity}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-800/60 text-[9px]">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800/80 text-amber-300 font-semibold border border-amber-500/20">
                        {pitchBadge}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800/80 text-cyan-300 font-semibold border border-cyan-500/20">
                        {st.boundaryRadiusRatio >= 1.05 ? '🏟️ Big' : st.boundaryRadiusRatio <= 0.95 ? '⚡ Compact' : '🎯 Standard'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="text-[10px] text-slate-400 flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentStadium?.pitchColor || '#dfcaa4' }} />
            <span>Pitch: <strong className="text-white">{currentStadium?.pitchType?.replace('_', ' ').toUpperCase()}</strong></span>
            <span className="text-slate-600">•</span>
            <span>Mow: <strong className="text-white">{currentStadium?.grassPattern?.toUpperCase()}</strong></span>
          </div>
          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-xs tracking-wide shadow-md cursor-pointer transition-all active:scale-95"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
