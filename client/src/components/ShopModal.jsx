import React, { useState } from 'react';
import { storageService } from '../services/storage';
import { sound } from '../game/SoundEffects';
import { ArrowLeft, ShoppingBag, Coins, Check, Lock, Sparkles, Shield, Zap, Award, Globe, Flame } from 'lucide-react';
import { ALL_JERSEYS } from '../game/TeamData';

const BATS = [
  { id: 'willow', name: 'Classic English Willow', price: 0, color: '#d97706', power: '+0%', speed: 'Standard', desc: 'Balanced traditional cleft willow with authentic woody ping.' },
  { id: 'flame', name: 'Firestorm Flame', price: 600, color: '#ef4444', power: '+12%', speed: 'Power', desc: 'Fiery red grain with an aggressive sweet spot for maximum elevation.' },
  { id: 'carbon', name: 'Carbon Stealth', price: 1000, color: '#0f172a', power: '+15%', speed: 'Hyper', desc: 'Aerospace-grade composite for lightning-quick bat speed.' },
  { id: 'gold', name: 'Golden Sovereign', price: 1800, color: '#eab308', power: '+25%', speed: 'Elite', desc: 'Forged for kings. Gleaming finish with thunderous sweet spot power.' },
  { id: 'kahuna', name: 'Kookaburra Kahuna', price: 850, color: '#16a34a', power: '+10%', speed: 'Fast', desc: 'Iconic curved green spine blade made famous in World Cup chases.' },
  { id: 'mrf', name: 'MRF Grand Edition', price: 1200, color: '#dc2626', power: '+18%', speed: 'Subcontinent', desc: 'Smasher blade crafted for heavy back-foot pulls and lofted drives.' },
  { id: 'spartan', name: 'Spartan Beast', price: 1100, color: '#ea580c', power: '+16%', speed: 'Heavy', desc: 'Massive 45mm edges and low swell for brutal boundary clearance.' },
  { id: 'legend', name: 'Gray-Nicolls Legend', price: 1350, color: '#b45309', power: '+20%', speed: 'Heritage', desc: 'Handcrafted English willow with precision balance and ping.' },
  { id: 'cyber', name: 'Cyber Matrix', price: 1500, color: '#059669', power: '+22%', speed: 'Laser', desc: 'Neon electrified blade with precision vibration dampeners.' },
  { id: 'diamond', name: 'White Diamond Edition', price: 1650, color: '#f8fafc', power: '+24%', speed: 'Pure', desc: 'Pristine pearlescent willow tuned for effortless timing.' },
  { id: 'vintage', name: 'Vintage 1983 Heritage', price: 750, color: '#92400e', power: '+8%', speed: 'Classic', desc: 'Throwback retro cleft commemorating historic championship triumphs.' },
  { id: 'titan', name: 'Titanium Titan', price: 2200, color: '#475569', power: '+30%', speed: 'Maximum', desc: 'Ultimate weapon forged with titanium fibers for unstoppable sixes.' }
];

const JERSEYS = ALL_JERSEYS;

const PADS = [
  { id: 'pad_white', name: 'Classic White Shin Guards', price: 0, color: '#f8fafc', desc: 'Standard high-density cane batting pads.' },
  { id: 'pad_blue', name: 'Electric Blue Pro Pads', price: 300, color: '#3b82f6', desc: 'Lightweight molded foam for agile running.' },
  { id: 'pad_gold', name: 'Golden Champion Pads', price: 550, color: '#eab308', desc: 'Regal golden shine with padded knee rolls.' },
  { id: 'pad_black', name: 'Stealth Matte Pads', price: 750, color: '#1e293b', desc: 'Low-profile armor design with reinforced instep.' }
];

const GLOVES = [
  { id: 'glove_classic', name: 'White Sausage Foam', price: 0, color: '#f8fafc', desc: 'Traditional multi-section fingers with soft leather palm.' },
  { id: 'glove_neon', name: 'Neon Lime Flex Palm', price: 250, color: '#84cc16', desc: 'High-grip Pittards leather with airflow ventilation.' },
  { id: 'glove_crimson', name: 'Red Flame Shock Gloves', price: 450, color: '#ef4444', desc: 'High-impact D3O inserts to absorb 150 km/h bouncers.' },
  { id: 'glove_gold', name: 'Golden Sovereign Gloves', price: 700, color: '#eab308', desc: 'Ultra-supple sheepskin palm with embossed metallic cuffs.' }
];

// Helper to normalize jersey IDs with legacy aliases
const LEGACY_JERSEY_ALIASES = {
  blue: 'jersey_ind',
  gold: 'jersey_aus',
  crimson: 'jersey_eng',
  emerald: 'jersey_sa',
  maroon: 'jersey_wi',
  stealth: 'jersey_stealth',
  retro: 'jersey_retro',
  cyber: 'jersey_cyber'
};

export default function ShopModal({ onBack, profile, onProfileUpdate }) {
  const [activeTab, setActiveTab] = useState('jerseys'); // Default to jerseys tab!
  const [jerseyCategory, setJerseyCategory] = useState('all'); // 'all', 'country', 'ipl', 'special'

  const handleBuy = (item, tab) => {
    if (profile.coins < item.price) {
      alert("Not enough coins! Win more chases or complete daily quests to earn coins.");
      return;
    }

    sound.playCoin();
    let unlockedKey = 'unlockedBats';
    let equippedKey = 'equippedBat';

    if (tab === 'jerseys') {
      unlockedKey = 'unlockedJerseys';
      equippedKey = 'equippedJersey';
    } else if (tab === 'pads') {
      unlockedKey = 'unlockedPads';
      equippedKey = 'equippedPad';
    } else if (tab === 'gloves') {
      unlockedKey = 'unlockedGloves';
      equippedKey = 'equippedGlove';
    }

    const currentUnlocked = profile[unlockedKey] || [tab === 'bats' ? 'willow' : tab === 'jerseys' ? 'jersey_ind' : tab === 'pads' ? 'pad_white' : 'glove_classic'];
    const updatedUnlocked = [...currentUnlocked, item.id];

    const updatedProfile = storageService.updateProfile({
      coins: profile.coins - item.price,
      [unlockedKey]: updatedUnlocked,
      [equippedKey]: item.id
    });

    onProfileUpdate(updatedProfile);
  };

  const handleEquip = (itemId, tab) => {
    sound.playClick();
    let equippedKey = 'equippedBat';
    if (tab === 'jerseys') equippedKey = 'equippedJersey';
    else if (tab === 'pads') equippedKey = 'equippedPad';
    else if (tab === 'gloves') equippedKey = 'equippedGlove';

    const updatedProfile = storageService.updateProfile({
      [equippedKey]: itemId
    });

    onProfileUpdate(updatedProfile);
  };

  let items = BATS;
  let unlockedList = profile.unlockedBats || ['willow'];
  let equippedItem = profile.equippedBat || 'willow';

  if (activeTab === 'jerseys') {
    items = jerseyCategory === 'all'
      ? JERSEYS
      : JERSEYS.filter(j => j.category === jerseyCategory);

    // Normalize unlocked jerseys with default IND kit and aliases
    const rawUnlocked = profile.unlockedJerseys || ['jersey_ind', 'blue'];
    const expandedUnlocked = new Set([...rawUnlocked, 'jersey_ind', 'blue']);
    rawUnlocked.forEach(id => {
      if (LEGACY_JERSEY_ALIASES[id]) expandedUnlocked.add(LEGACY_JERSEY_ALIASES[id]);
    });
    unlockedList = Array.from(expandedUnlocked);

    const rawEquipped = profile.equippedJersey || 'jersey_ind';
    equippedItem = LEGACY_JERSEY_ALIASES[rawEquipped] || rawEquipped;
  } else if (activeTab === 'pads') {
    items = PADS;
    unlockedList = profile.unlockedPads || ['pad_white'];
    equippedItem = profile.equippedPad || 'pad_white';
  } else if (activeTab === 'gloves') {
    items = GLOVES;
    unlockedList = profile.unlockedGloves || ['glove_classic'];
    equippedItem = profile.equippedGlove || 'glove_classic';
  }

  return (
    <div className="w-full h-full flex flex-col bg-cricket-dark text-slate-100 overflow-y-auto safe-p-top safe-p-bottom px-4 py-6">
      <div className="max-w-2xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => { sound.playClick(); onBack(); }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-2xl font-display font-extrabold tracking-wide text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-amber-400" />
            GEAR & KITS VAULT
          </h1>

          {/* Coin balance */}
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 border border-amber-500/40 text-amber-300 font-bold text-sm shadow-md">
            <Coins className="w-4 h-4 text-amber-400" />
            {profile.coins}
          </div>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-900 rounded-2xl border border-slate-800 mb-4">
          <button
            onClick={() => { sound.playClick(); setActiveTab('jerseys'); }}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'jerseys'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            👕 Kits ({JERSEYS.length})
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveTab('bats'); }}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'bats'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🏏 Bats ({BATS.length})
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveTab('pads'); }}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'pads'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🛡️ Pads ({PADS.length})
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveTab('gloves'); }}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'gloves'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🧤 Gloves ({GLOVES.length})
          </button>
        </div>

        {/* Jersey Category Sub-Tabs when in Kits tab */}
        {activeTab === 'jerseys' && (
          <div className="flex items-center gap-1.5 p-1 bg-slate-950/70 rounded-2xl border border-slate-800 mb-5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => { sound.playClick(); setJerseyCategory('all'); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                jerseyCategory === 'all'
                  ? 'bg-amber-400 text-slate-950 font-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Kits ({JERSEYS.length})
            </button>
            <button
              onClick={() => { sound.playClick(); setJerseyCategory('country'); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                jerseyCategory === 'country'
                  ? 'bg-amber-400 text-slate-950 font-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🌍 Countries ({JERSEYS.filter(j => j.category === 'country').length})
            </button>
            <button
              onClick={() => { sound.playClick(); setJerseyCategory('ipl'); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                jerseyCategory === 'ipl'
                  ? 'bg-amber-400 text-slate-950 font-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ⚡ IPL Teams ({JERSEYS.filter(j => j.category === 'ipl').length})
            </button>
            <button
              onClick={() => { sound.playClick(); setJerseyCategory('special'); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                jerseyCategory === 'special'
                  ? 'bg-amber-400 text-slate-950 font-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ✨ Retro & Special ({JERSEYS.filter(j => j.category === 'special').length})
            </button>
          </div>
        )}

        {/* Items Grid */}
        <div className="space-y-3">
          {items.map(item => {
            const isUnlocked = unlockedList.includes(item.id);
            const isEquipped = equippedItem === item.id;
            const canAfford = profile.coins >= item.price;

            return (
              <div
                key={item.id}
                className={`glass-panel rounded-2xl p-4 border flex items-center justify-between gap-4 transition-all ${
                  isEquipped
                    ? 'border-emerald-500 bg-emerald-500/10 shadow-md shadow-emerald-500/15'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  {/* Item Icon Color Preview with dual-tone gradient & badge */}
                  <div
                    className="w-13 h-13 min-w-[50px] min-h-[50px] rounded-2xl flex items-center justify-center border border-white/20 shadow-md flex-shrink-0 relative overflow-hidden"
                    style={{
                      background: activeTab === 'jerseys' && item.secondaryColor
                        ? `linear-gradient(135deg, ${item.color} 52%, ${item.secondaryColor} 52%)`
                        : item.color
                    }}
                  >
                    {activeTab === 'jerseys' && item.badge ? (
                      <span className="text-2xl drop-shadow select-none">{item.badge}</span>
                    ) : (
                      <span className="text-xl">
                        {activeTab === 'bats' ? '🏏' : activeTab === 'jerseys' ? '👕' : activeTab === 'pads' ? '🛡️' : '🧤'}
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                        {item.name}
                        {isEquipped && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 uppercase tracking-wider">
                            Equipped
                          </span>
                        )}
                      </h3>
                      {item.code && (
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-800 text-amber-300 border border-slate-700">
                          {item.code}
                        </span>
                      )}
                      {item.category && (
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                          item.category === 'country' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          item.category === 'ipl' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                          'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        }`}>
                          {item.category === 'country' ? 'T20 Country' : item.category === 'ipl' ? 'IPL Franchise' : 'Special Edition'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                      {item.desc}
                    </p>
                    {item.power && (
                      <div className="flex items-center gap-2 mt-1 text-[11px] font-mono">
                        <span className="text-emerald-400 font-bold">Sweet Spot: {item.power}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-amber-400">{item.speed}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action button */}
                <div className="flex-shrink-0">
                  {isEquipped ? (
                    <div className="flex items-center gap-1 text-xs font-black text-emerald-400 px-3 py-1.5">
                      <Check className="w-4 h-4" /> IN USE
                    </div>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => handleEquip(item.id, activeTab)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white transition-colors"
                    >
                      EQUIP
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBuy(item, activeTab)}
                      className={`px-4 py-2 rounded-xl font-display font-extrabold text-xs tracking-wider flex items-center gap-1.5 transition-all ${
                        canAfford
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/25 active:scale-95'
                          : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                      }`}
                    >
                      <Coins className="w-3.5 h-3.5" />
                      {item.price}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

