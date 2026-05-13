import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, CheckCircle2, XCircle, Award, ArrowRight } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { playSound } from '../lib/audio';

const QUIZ_QUESTIONS = [
  {
    question: "What does 'J-Cut' mean in video editing?",
    options: ["Audio precedes the video", "Video precedes the audio", "Cutting to the beat of music", "A fast jump cut"],
    answer: 0,
    explanation: "In a J-Cut, the audio from the next scene starts playing before you see the video."
  },
  {
    question: "Which color temperature makes a scene look 'warmer'?",
    options: ["3200K", "5600K", "10000K", "2000K"],
    answer: 3,
    explanation: "Lower Kelvin numbers (like 2000K-3200K) appear orange/warm, while higher numbers (5600K+) appear blue/cool."
  },
  {
    question: "What is the purpose of a 'proxy' file?",
    options: ["To add dramatic effects", "To color grade faster", "To edit high-res footage smoothly on slower computers", "To compress the final export"],
    answer: 2,
    explanation: "Proxies are low-resolution copies of your media that are easier for your computer to play back during editing."
  },
  {
    question: "What is the standard framerate for cinematic movies?",
    options: ["60 fps", "30 fps", "24 fps", "120 fps"],
    answer: 2,
    explanation: "24 frames per second is the traditional cinematic standard, giving movies their recognizable 'look'."
  },
  {
    question: "What does 'L-Cut' mean?",
    options: ["Cutting at a 90-degree angle", "Video transitions before the audio", "Audio transitions before the video", "Lowering the volume of a clip"],
    answer: 1,
    explanation: "In an L-Cut, the video switches to the next shot, but the audio from the previous shot continues playing."
  },
  {
    question: "Which of these is a common aspect ratio for widescreen cinema?",
    options: ["4:3", "16:9", "2.35:1", "1:1"],
    answer: 2,
    explanation: "2.35:1 (or 2.39:1) is the classic anamorphic widescreen ratio used in many modern films."
  },
  {
    question: "What does 'LUT' stand for?",
    options: ["Look Up Table", "Level Under Tone", "Light Unit Threshold", "Lens Utility Tool"],
    answer: 0,
    explanation: "A Look Up Table (LUT) is essentially a math formula used to map one color space to another, often used for color grading."
  },
  {
    question: "What is a 'Jump Cut'?",
    options: ["A cut between different scenes", "A cut that skips forward in time within the same shot", "A smooth transition between cameras", "A cut synchronized with a loud noise"],
    answer: 1,
    explanation: "A jump cut is an abrupt transition from one point in a clip to a later point in the same clip without changing framing."
  },
  {
    question: "What does 'B-Roll' refer to?",
    options: ["The second take of a scene", "Background music", "Supplemental footage intercut with the main shot", "Failed clips"],
    answer: 2,
    explanation: "B-roll is the supplemental or alternative footage intercut with the main shot (A-roll) to add context or hide cuts."
  },
  {
    question: "What does 'FPS' stand for?",
    options: ["First Person Shooter", "Frames Per Second", "Final Production Stage", "Fast Paced Sequence"],
    answer: 1,
    explanation: "Frames Per Second refers to the number of individual images displayed in one second of video."
  },
  {
    question: "Which tool is primarily used to adjust the brightness of specific tonal ranges?",
    options: ["Hue/Saturation", "Curves", "Sharpen", "Opacity"],
    answer: 1,
    explanation: "The Curves tool allows precise adjustment of shadows, midtones, and highlights independently."
  },
  {
    question: "In audio editing, what does a 'compressor' do?",
    options: ["Reduces file size", "Reduces dynamic range by lowering loud sounds and boosting quiet ones", "Removes background noise", "Adds an echo effect"],
    answer: 1,
    explanation: "Audio compression narrows the dynamic range, making the overall volume more consistent."
  },
  {
    question: "What is 'chroma keying' better known as?",
    options: ["Color grading", "Green screen", "Rotoscoping", "Motion tracking"],
    answer: 1,
    explanation: "Chroma keying is a technique for compositing two images based on color hues, commonly known as green screen."
  },
  {
    question: "Which setting controls how sensitive the camera sensor is to light?",
    options: ["Shutter Speed", "Aperture", "ISO", "White Balance"],
    answer: 2,
    explanation: "ISO measures the sensitivity of the image sensor. Higher ISO means a brighter image but more digital noise."
  },
  {
    question: "What is the primary purpose of an 'adjustment layer'?",
    options: ["To add titles to a video", "To apply effects or corrections to multiple clips below it", "To group audio tracks", "To synchronize multicam setups"],
    answer: 1,
    explanation: "Adjustment layers allow you to apply effects (like color grading) to all tracks positioned beneath them in the timeline."
  },
  {
    question: "What is 'rotoscoping'?",
    options: ["A 3D rendering technique", "A way to stabilize shaky footage", "Manually drawing over or masking footage frame-by-frame", "A specific type of lens flare"],
    answer: 2,
    explanation: "Rotoscoping involves tracing over footage frame by frame to separate an object from its background."
  },
  {
    question: "Which color space is standard for web and standard HD video?",
    options: ["Rec. 709", "Rec. 2020", "CMYK", "DCI-P3"],
    answer: 0,
    explanation: "Rec. 709 is the standard color space for HD television and most web video content."
  },
  {
    question: "What is the function of 'keyframing'?",
    options: ["Setting the main frame of a scene", "Automating changes in a parameter over time", "Locking a clip in place", "Generating a thumbnail"],
    answer: 1,
    explanation: "Keyframes are used to specify the starting and ending values of an effect parameter, allowing for animation over time."
  },
  {
    question: "What is a 'match cut'?",
    options: ["A transition between clips with similar visual elements", "Cutting to the beat of the music", "Using multiple cameras at the same time", "A cut that matches the color of two clips"],
    answer: 0,
    explanation: "A match cut transitions between two scenes using a similar framing, action, or subject to create a seamless link."
  },
  {
    question: "In the context of the Rule of Thirds, where should the subject's eyes typically be?",
    options: ["Dead center", "Along the bottom grid line", "Along the top grid line", "Outside the frame"],
    answer: 2,
    explanation: "The Rule of Thirds suggests placing points of interest, like a character's eyes, along the intersecting lines, usually the top third."
  },
  {
    question: "What does a 'cross dissolve' transition typically signify?",
    options: ["A fast-paced action", "A technical malfunction", "A passage of time or a change in location", "An error in rendering"],
    answer: 2,
    explanation: "Cross dissolves are soft transitions that often imply moving to a different place or time in the narrative."
  },
  {
    question: "What does the abbreviation 'VFX' stand for?",
    options: ["Video Frame X-rate", "Visual Effects", "Virtual Format Extension", "Volume Fade Cross"],
    answer: 1,
    explanation: "VFX stands for Visual Effects, referring to digital imagery created or manipulated outside of a live-action shot."
  },
  {
    question: "What is 'foley'?",
    options: ["The main dialogue in a film", "Synthesized music", "Custom recorded sound effects added to a film in post-production", "The sound of wind hitting a microphone"],
    answer: 2,
    explanation: "Foley is the reproduction of everyday sound effects that are added to films to enhance audio quality."
  },
  {
    question: "Which term describes the difference between the darkest and lightest parts of an image?",
    options: ["Saturation", "Contrast", "Hue", "Exposure"],
    answer: 1,
    explanation: "Contrast is the scale of difference between black and white in your images."
  },
  {
    question: "What is the main advantage of using 'vector' graphics (like SVGs) in a composition?",
    options: ["They have smaller file sizes for photos", "They contain 3D depth information", "They can be scaled infinitely without losing quality", "They naturally apply a blur effect"],
    answer: 2,
    explanation: "Vector graphics use mathematical equations instead of pixels, allowing them to remain crisp at any size."
  }
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  
  const { addCoins, addXp } = useGameStore();

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    
    const correct = index === QUIZ_QUESTIONS[currentQuestion].answer;
    if (correct) {
      playSound('success');
      setScore(s => s + 1);
    } else {
      playSound('fail');
    }
  };

  const handleNext = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(c => c + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
      const earnedCoins = score * 50;
      const earnedXp = score * 100;
      addCoins(earnedCoins);
      addXp(earnedXp);
      playSound('success');
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-500/20 text-purple-400 mb-4 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Daily Editor's Quiz
          </h1>
          <p className="text-slate-400 mt-2">Test your editing knowledge to earn Coins and XP!</p>
        </div>

        <AnimatePresence mode="wait">
          {!quizFinished ? (
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl relative"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-slate-800 rounded-t-3xl overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={{ width: `${(currentQuestion / QUIZ_QUESTIONS.length) * 100}%` }}
                  animate={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                />
              </div>

              <div className="text-sm font-bold text-purple-400 mb-4 tracking-widest uppercase">
                Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
              </div>
              
              <h2 className="text-xl md:text-2xl font-bold text-white mb-8 leading-relaxed">
                {QUIZ_QUESTIONS[currentQuestion].question}
              </h2>

              <div className="flex flex-col gap-3">
                {QUIZ_QUESTIONS[currentQuestion].options.map((option, idx) => {
                  let buttonStyle = "bg-slate-800/50 border-slate-700 hover:bg-slate-700 hover:border-purple-500/50 text-slate-300";
                  let Icon = null;

                  if (isAnswered) {
                    if (idx === QUIZ_QUESTIONS[currentQuestion].answer) {
                      buttonStyle = "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]";
                      Icon = <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
                    } else if (idx === selectedOption) {
                      buttonStyle = "bg-rose-500/20 border-rose-500/50 text-rose-300";
                      Icon = <XCircle className="w-5 h-5 text-rose-400" />;
                    } else {
                      buttonStyle = "bg-slate-900/50 border-slate-800 text-slate-600 opacity-50";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleSelect(idx)}
                      className={`text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${buttonStyle} focus:outline-none`}
                    >
                      <span className="font-medium">{option}</span>
                      {Icon}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 text-center"
                >
                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl mb-6 text-purple-200 text-sm">
                    {QUIZ_QUESTIONS[currentQuestion].explanation}
                  </div>
                  <button
                    onClick={handleNext}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-colors shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                  >
                    {currentQuestion < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'Finish Quiz'}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="finished"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900 border border-purple-500/30 rounded-3xl p-8 md:p-12 backdrop-blur-xl shadow-[0_0_40px_rgba(168,85,247,0.15)] text-center relative overflow-hidden"
            >
              <Award className="w-24 h-24 text-yellow-400 mx-auto mb-6" />
              <h2 className="text-3xl font-black text-white mb-2">Quiz Completed!</h2>
              <p className="text-slate-400 mb-8">You scored {score} out of {QUIZ_QUESTIONS.length}.</p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                 <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-500 font-bold uppercase block mb-1">XP Earned</span>
                    <span className="text-2xl font-mono text-cyan-400">+{score * 100}</span>
                 </div>
                 <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Coins</span>
                    <span className="text-2xl font-mono text-yellow-400">+{score * 50}</span>
                 </div>
              </div>

              <button
                onClick={handleRestart}
                className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors"
              >
                Play Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
