import React, { useState, useEffect } from 'react';
import Logo from './assets/logo/etec.png';
import StudentImg from './assets/students/StudentExam.png'; 
import mp3Alarm from './assets/mp3/30min.mp3';

export default function ExamDashboard() {
  const [currentTime, setCurrentTime] = useState('');
  
  // Timer States (២ ម៉ោង = ៧២០០ វិនាទី)
  const TOTAL_TIME = 2 * 60 * 60;
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME); 

  // States សម្រាប់គ្រប់គ្រងផ្ទាំងដំណឹង
  const [showSpecialAlert, setShowSpecialAlert] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [showWarningModal, setShowWarningModal] = useState(false);

  // មុខងារចាក់សំឡេង MP3 ដែលបាន Import មក និងកំណត់ឱ្យលឺត្រឹមតែ 4 វិនាទី
  const playAlarmSound = () => {
    try {
      const audio = new Audio(mp3Alarm);
      audio.volume = 0.6; // កម្រិតសំឡេង (0.0 ដល់ 1.0)
      
      // ចាប់ផ្តើមចាក់សំឡេង
      audio.play();

      // បញ្ជាឱ្យឈប់ចាក់ (Pause) នៅពេលគ្រប់ ៤ វិនាទី (4000 មីលីវិនាទី)
      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0; // កំណត់ឱ្យសំឡេងត្រឡប់ទៅចំណុចចាប់ផ្តើមវិញ
      }, 4000);

    } catch (e) {
      console.log("ការចាក់សំឡេងមានបញ្ហា៖", e);
    }
  };

  // ១. បង្ហាញកាលបរិច្ឆេទបច្ចុប្បន្ន
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
      setCurrentTime(now.toLocaleDateString('en-US', options));
    };
    
    updateDateTime();
    const calendarInterval = setInterval(updateDateTime, 60000);
    return () => clearInterval(calendarInterval);
  }, []);

  // ២. លំហូរការងារគណនាថយក្រោយ និងការលោត Alarm ពេលប្រើអស់រៀងរាល់ ៣០ នាទីម្តង
  useEffect(() => {
    let countdownInterval = null;

    if (isExamStarted && timeLeft > 0) {
      countdownInterval = setInterval(() => {
        setTimeLeft((prevTime) => {
          const nextTime = prevTime - 1;
          const timeSpent = TOTAL_TIME - nextTime;

          // រៀងរាល់ពេលសិស្សប្រើអស់ ៣០ នាទីម្តង (30, 60, 90 នាទី)
          if (timeSpent % (30 * 60) === 0 && nextTime > 15 * 60 && timeSpent > 0) {
            const minutesUsed = timeSpent / 60;
            playAlarmSound();
            setWarningMessage(`អ្នកបានប្រើប្រាស់ពេលវេលាអស់ ${minutesUsed} នាទីហើយ! សូមពិនិត្យមើលល្បឿនធ្វើកិច្ចការរបស់អ្នកឡើងវិញ។`);
            setShowWarningModal(true);
          }

          // នៅពេលសល់ត្រឹមតែ ១៥ នាទីចុងក្រោយបង្អស់
          if (nextTime === 15 * 60) {
            playAlarmSound();
            setWarningMessage('🚨 អាសន្ន! ពេលវេលាប្រឡងសល់តែ ១៥ នាទីចុងក្រោយបង្អស់តែប៉ុណ្ណោះ! សូមប្រញាប់រួសរាន់ឡើង!');
            setShowWarningModal(true);
          }

          return nextTime;
        });
      }, 1000);
    } else if (timeLeft === 0 && isExamStarted) {
      clearInterval(countdownInterval);
      playAlarmSound();
      setShowWarningModal(false);
      setShowSpecialAlert(true); 
    }

    return () => clearInterval(countdownInterval);
  }, [isExamStarted, timeLeft]);

  const formatTimer = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStartExam = () => {
    setIsExamStarted(true);
  };

  // មុខងារសម្រាប់ចុច Fast-Forward ពេលវេលាទៅចំណុចតេស្ត
  const handleTestTrigger = (minutesSpentTarget) => {
    if (!isExamStarted) {
      setIsExamStarted(true);
    }
    const targetedTimeLeft = TOTAL_TIME - (minutesSpentTarget * 60) + 2;
    setTimeLeft(targetedTimeLeft);
    setShowWarningModal(false);
  };

  const handleCloseAlert = () => {
    setShowSpecialAlert(false);
  };

  const khmerFontStyle = { fontFamily: '"Noto Sans Khmer", sans-serif' };

  const getTimerBoxStyles = () => {
    if (!isExamStarted) return 'border-emerald-500/20 text-emerald-400';
    if (timeLeft <= 15 * 60) return 'border-red-500 animate-pulse text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]'; 
    return 'border-emerald-500/50 text-emerald-400';
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      
      {/* ==================== ប៊ូតុងត្រួតពិនិត្យ និងតេស្ត (DEVELOPER QUICK TEST TOOLS) ==================== */}
      <div className="absolute top-4 left-4 z-40 bg-zinc-900/90 border border-zinc-700 p-4 rounded-xl space-y-2 max-w-xs">
        <p style={khmerFontStyle} className="text-xs text-zinc-400 font-bold border-b border-zinc-700 pb-1">🛠️ ឧបករណ៍តេស្តល្បឿន (Testing Suite)</p>
        <button 
          onClick={() => handleTestTrigger(30)} 
          className="w-full text-left text-xs bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 p-2 rounded border border-amber-500/30 transition"
        >
          🔄️ តេស្តពេលប្រើអស់ 30 នាទី 
        </button>
        <button 
          onClick={() => handleTestTrigger(105)} 
          className="w-full text-left text-xs bg-red-600/20 hover:bg-red-600/40 text-red-300 p-2 rounded border border-red-500/30 transition"
        >
          🚨 តេស្តពេលសល់ 15 នាទីចុងក្រោយ
        </button>
        <button 
          onClick={() => setTimeLeft(2)} 
          className="w-full text-left text-xs bg-zinc-700 hover:bg-zinc-600 text-zinc-200 p-2 rounded transition"
        >
          🛑 តេស្តពេលអស់ម៉ោងទាំងស្រុង (00:00:00)
        </button>
      </div>

      {/* Container Wrapper */}
      <div className="w-full max-w-4xl bg-[#121212] rounded-2xl border border-zinc-800 p-10 shadow-2xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between border-b border-zinc-800 pb-6 mb-8 gap-4">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="ETEC Logo" className="w-30 h-auto object-contain" />
          </div>
          
          <div className="text-center md:text-right">
            <h1 
              style={khmerFontStyle}
              className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400 pb-2 border-b-2 border-amber-400/30"
            >
              អាហារូបករណ៍ជំនាន់ទី ៥
            </h1>
            <p className="text-xl font-medium tracking-wide text-zinc-500 mt-1">Chil Chil With Team IT</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* Left Column: Info & Timer */}
          <div className="space-y-4">
            
            {/* Dynamic Date Box */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 text-center shadow-md">
              <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase block mb-1">Current Date</span>
              <p className="text-xl font-medium text-zinc-300">{currentTime || "Loading..."}</p>
            </div>

            {/* Glowing Exam Timer Box */}
            <div className={`bg-zinc-900/80 border-2 rounded-xl p-6 text-center shadow-lg relative overflow-hidden group transition-all duration-300 ${getTimerBoxStyles()}`}>
              <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="text-xs font-bold tracking-widest uppercase block mb-1 text-zinc-400">
                {isExamStarted ? 'Time Remaining' : 'Exam Timer Ready'}
              </span>
              <p className="text-4xl md:text-5xl font-mono font-bold tracking-wider">
                {formatTimer(timeLeft)}
              </p>
            </div>

            {/* Student Conduct Rules Box */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 text-center shadow-md">
              <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase block mb-2">Student Conduct Rules</span>
              <p 
                style={khmerFontStyle}
                className="text-xl text-zinc-300 leading-relaxed"
              >
                សូមគោរពវិន័យ និងរក្សាសណ្តាប់ធ្នាប់
              </p>
            </div>

          </div>

          {/* Right Column: Student Image */}
          <div className="flex justify-center">
            <div className="relative group p-1 bg-gradient-to-b from-emerald-500/30 to-zinc-800 rounded-2xl shadow-xl w-full max-w-sm aspect-square overflow-hidden">
              <div className="w-full h-full bg-zinc-900 rounded-xl overflow-hidden relative">
                <img 
                  src={StudentImg} 
                  alt="Student Verification Profile" 
                  className="w-full h-full object-cover grayscale-[10%] group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-zinc-700">
                  <span className={`w-2 h-2 rounded-full bg-emerald-500 ${isExamStarted ? 'animate-ping' : 'animate-pulse'}`}></span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-300">
                    {isExamStarted ? 'Exam Live' : 'Verified Identity'}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Action Button Section */}
        <div className="mt-10 flex justify-center">
          <button 
            onClick={handleStartExam}
            disabled={isExamStarted}
            className={`px-10 py-4 font-bold tracking-wide rounded-xl text-lg transition-all duration-200 ${
              isExamStarted 
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700' 
                : 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow-[0_4px_20px_rgba(37,99,235,0.4)] hover:shadow-[0_6px_25px_rgba(37,99,235,0.6)] hover:-translate-y-0.5'
            }`}
          >
            {isExamStarted ? 'Exam In Progress...' : 'Start Exam'}
          </button>
        </div>

      </div>

      {/* ==================== ផ្ទាំង WARNING MODAL ==================== */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className={`bg-[#121212] border w-full max-w-md p-8 rounded-2xl text-center shadow-[0_0_50px_rgba(239,68,68,0.3)] transform transition-all duration-300 ${timeLeft <= 15 * 60 ? 'border-red-500 animate-bounce-short' : 'border-amber-500'}`}>
            
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl animate-ping">⚠️</span>
            </div>

            <h2 
              style={khmerFontStyle} 
              className={`text-2xl font-bold mb-3 ${timeLeft <= 15 * 60 ? 'text-red-500' : 'text-amber-500'}`}
            >
              {timeLeft <= 15 * 60 ? 'ការព្រមានបន្ទាន់ចុងក្រោយ!' : 'ដំណឹងដាស់តឿនពេលវេលា!'}
            </h2>

            <p 
              style={khmerFontStyle} 
              className="text-zinc-300 text-base leading-relaxed mb-6"
            >
              {warningMessage}
            </p>

            <button
              onClick={() => setShowWarningModal(false)}
              style={khmerFontStyle}
              className={`w-full py-3 bg-gradient-to-r text-white font-bold tracking-wide rounded-xl transition-all duration-150 ${timeLeft <= 15 * 60 ? 'from-red-600 to-red-700 hover:from-red-500 shadow-[0_4px_15px_rgba(239,68,68,0.4)]' : 'from-amber-600 to-amber-700 hover:from-amber-500 shadow-[0_4px_15px_rgba(245,158,11,0.4)]'}`}
            >
              {timeLeft <= 15 * 60 ? 'ខ្ញុំដឹងហើយ ឆាប់ធ្វើទៀត!' : 'យល់ព្រម និងបន្ត'}
            </button>
          </div>
        </div>
      )}

      {/* ==================== ផ្ទាំង ALERT ពិសេស (ពេលអស់ម៉ោងទាំងស្រុង) ==================== */}
      {showSpecialAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-[#121212] border border-red-500/30 w-full max-w-md p-8 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.5)] text-center">
            <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🛑</span>
            </div>

            <h2 style={khmerFontStyle} className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-500 mb-3">
              អស់រយៈពេលប្រឡងហើយ!
            </h2>

            <p style={khmerFontStyle} className="text-zinc-400 text-base leading-relaxed mb-6">
              ប្រព័ន្ធបានរក្សាទុក និងបញ្ជូនសន្លឹកកិច្ចការរបស់អ្នកទៅកាន់ក្រុមការងារ IT ដោយស្វ័យប្រវត្តរួចរាល់ហើយ។ សូមសម្រាកសិនចុះ!
            </p>

            <button onClick={handleCloseAlert} style={khmerFontStyle} className="w-full py-3.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold tracking-wide rounded-xl shadow-[0_4px_15px_rgba(239,68,68,0.3)]">
              យល់ព្រម និងចាកចេញ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}