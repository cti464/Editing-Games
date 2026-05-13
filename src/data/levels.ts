export type LevelType = 'color-match' | 'timeline-cut' | 'opacity-sync';

export interface LevelData {
  id: number;
  title: string;
  description: string;
  type: LevelType;
  difficulty: number; // 1-10
  timeLimit: number; // seconds
  target: any; // specific to type
  rewards: { xp: number; coins: number };
  imageUrl?: string;
}

// Helper to generate levels programmatically to cover all 50 challenges
const generateLevels = (): LevelData[] => {
  const levels: LevelData[] = [];
  
  const BASE_DEFINITIONS: Array<{title: string, desc: string, type: LevelType, img?: string}> = [
    { title: 'Crop the selfie correctly', desc: 'Hit the exact moment to crop the image perfectly.', type: 'timeline-cut', img: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80' },
    { title: 'Brightness fix challenge', desc: 'Fix the brightness and color balance of the photo.', type: 'color-match', img: 'https://images.unsplash.com/photo-1495344517868-8ebaf0a2044a?w=800&q=80' },
    { title: 'Remove background from a photo', desc: 'Fade out the background perfectly.', type: 'opacity-sync', img: 'https://images.unsplash.com/photo-1511556820780-d912e42b4980?w=800&q=80' },
    { title: 'Add simple text on poster', desc: 'Adjust text opacity for perfect readability.', type: 'opacity-sync', img: 'https://images.unsplash.com/photo-1583753028456-e630cc674bd2?w=800&q=80' },
    { title: 'Blur the background only', desc: 'Set the perfect background blur intensity.', type: 'opacity-sync', img: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=800&q=80' },
    { title: 'Fix dark night image', desc: 'Correct the exposure and colors of the night shot.', type: 'color-match', img: 'https://images.unsplash.com/photo-1505322022379-7c3353ee6291?w=800&q=80' },
    { title: 'Make thumbnail for gaming video', desc: 'Add punchy colors to the gaming thumbnail.', type: 'color-match', img: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80' },
    { title: 'Add stickers to photo', desc: 'Blend the sticker opacity naturally into the image.', type: 'opacity-sync', img: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80' },
    { title: 'Resize image for Instagram', desc: 'Stop the scaling at the exact Instagram dimension ratio.', type: 'timeline-cut', img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80' },
    { title: 'Speed thumbnail challenge', desc: 'Very fast reaction time needed to capture the thumbnail.', type: 'timeline-cut', img: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80' },
    { title: 'Make movie poster', desc: 'Give the poster a cinematic Hollywood color grade.', type: 'color-match', img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80' },
    { title: 'Face smooth editing', desc: 'Carefully adjust the face smoothing filter opacity.', type: 'opacity-sync', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80' },
    { title: 'Add rain effect', desc: 'Blend the falling rain simulation over the footage.', type: 'opacity-sync', img: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&q=80' },
    { title: 'Create double exposure effect', desc: 'Balance the two exposed images perfectly.', type: 'opacity-sync', img: 'https://images.unsplash.com/photo-1473859664689-53b0e35359cd?w=800&q=80' },
    { title: 'Sky replacement challenge', desc: 'Color grade the new sky to match the foreground lighting.', type: 'color-match', img: 'https://images.unsplash.com/photo-1513002749550-c59d8409f52c?w=800&q=80' },
    { title: 'Gaming logo design', desc: 'Match the neon aesthetic colors for the e-sports logo.', type: 'color-match', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80' },
    { title: 'Build travel poster', desc: 'Cut exactly when the airplane passes the center.', type: 'timeline-cut', img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80' },
    { title: 'Color grading challenge', desc: 'Advanced professional color grade matching.', type: 'color-match', img: 'https://images.unsplash.com/photo-1533167649158-6d508895b680?w=800&q=80' },
    { title: 'Create glitch effect', desc: 'Set the exact intensity for the digital RGB glitch.', type: 'opacity-sync', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80' },
    { title: 'Match colors of two photos', desc: 'The ultimate boss challenge: perfect color matching.', type: 'color-match', img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80' },
  ];

  const types: LevelType[] = ['color-match', 'timeline-cut', 'opacity-sync'];
  const subjects = ['vlog video', 'drone shot', 'concert footage', 'wedding clip', 'timelapse', 'sports highlight', 'product review'];
  const adjectives = ['cinematic', 'vintage', 'dark and moody', 'bright and airy', 'fast-paced', 'smooth', 'dramatic'];
  
  const images = [
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
    'https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=800&q=80',
    'https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=800&q=80',
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800&q=80'
  ];

  for (let i = 1; i <= 100; i++) {
    let title, description, type, img;
    
    if (i <= 20) {
      const def = BASE_DEFINITIONS[i - 1];
      title = def.title;
      description = def.desc;
      type = def.type;
      img = def.img;
    } else {
      type = types[i % 3];
      const subject = subjects[i % subjects.length];
      const adj = adjectives[i % adjectives.length];
      
      if (type === 'timeline-cut') {
        title = `Trim the ${adj} ${subject}`;
        description = 'Hit the cut button exactly on the beat to make the transition perfect.';
      } else if (type === 'color-match') {
        title = `Grade the ${subject}`;
        description = `Match the ${adj} color grading perfectly to win.`;
      } else {
        title = `Blend the ${subject}`;
        description = `Find the perfect opacity for this ${adj} visual effect.`;
      }
      img = images[i % images.length];
    }

    let target: any = {};
    
    // Harder formulas
    if (type === 'timeline-cut') {
      target = { 
        zoneStart: Math.random() * 60 + 20,
        zoneWidth: Math.max(3, 10 - (i * 0.05)), // narrower zone but playable
        speed: 1.5 + (i * 0.02) // noticeably faster
      };
    } else if (type === 'color-match') {
      target = {
        r: Math.floor(Math.random() * 255),
        g: Math.floor(Math.random() * 255),
        b: Math.floor(Math.random() * 255),
        tolerance: Math.max(8, 30 - (i * 0.2)) // more reasonable tolerance
      };
    } else {
      target = {
        opacity: Math.floor(Math.random() * 80) + 10,
        tolerance: Math.max(3, 12 - (i * 0.08)) // tighter tolerance
      };
    }

    levels.push({
      id: i,
      title: `${i}. ${title}`,
      description,
      type,
      difficulty: Math.ceil(i / 10),
      timeLimit: Math.max(5, 30 - Math.floor(i * 0.25)), // Much less time
      target,
      rewards: { xp: 50 + (i * 10), coins: 10 + (i * 2) },
      imageUrl: img
    });
  }
  
  return levels;
};

export const LEVELS = generateLevels();
