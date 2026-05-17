import React, { useState, useEffect } from 'react';
import Logo from './assets/logo/etec.png';
import StudentImg from './assets/students/StudentExam.png'; 

export default function ExamDashboard() {
  const [currentTime, setCurrentTime] = useState('');
  
  // Timer States
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(2 * 60 * 60); // ២ ម៉ោង

  // State សម្រាប់គ្រប់គ្រងការបង្ហាញ Alert ពិសេស (Custom Modal)
  const [showSpecialAlert, setShowSpecialAlert] = useState(false);

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

  // ២. លំហូរការងារគណនាថយក្រោយ (Countdown Logic)
  useEffect(() => {
    let countdownInterval = null;

    if (isExamStarted && timeLeft > 0) {
      countdownInterval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isExamStarted) {
      clearInterval(countdownInterval);
      
      // ហៅ Alert ពិសេសឱ្យបង្ហាញមកលើអេក្រង់ជំនួស alert() ធម្មតា
      setShowSpecialAlert(true); 
    }

    return () => clearInterval(countdownInterval);
  }, [isExamStarted, timeLeft]);

  // មុខងារជំនួយសម្រាប់បំប្លែងវិនាទីទៅជាទម្រង់ HH:MM:SS
  const formatTimer = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStartExam = () => {
    setIsExamStarted(true);
  };

  const handleCloseAlert = () => {
    setShowSpecialAlert(false);
    // អ្នកអាចបន្ថែម Logic សម្រាប់រុញទៅកាន់ទំព័រលទ្ធផល (Redirect) នៅទីនេះបាន
  };

  const khmerFontStyle = { fontFamily: '"Noto Sans Khmer", sans-serif' };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      
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
            <div className={`bg-zinc-900/80 border-2 rounded-xl p-6 text-center shadow-lg relative overflow-hidden group transition-all duration-300 ${isExamStarted ? 'border-amber-500/40' : 'border-emerald-500/20'}`}>
              <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className={`text-xs font-bold tracking-widest uppercase block mb-1 ${isExamStarted ? 'text-amber-400' : 'text-emerald-400'}`}>
                {isExamStarted ? 'Time Remaining' : 'Exam Timer Ready'}
              </span>
              <p className={`text-4xl md:text-5xl font-mono font-bold tracking-wider drop-shadow-[0_0_10px_rgba(52,211,153,0.3)] ${isExamStarted ? 'text-amber-400' : 'text-emerald-400'}`}>
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

      {/* ==================== ផ្ទាំង ALERT ពិសេស (CUSTOM MODAL) ==================== */}
      {showSpecialAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#121212] border border-red-500/30 w-full max-w-md p-8 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.2)] text-center scale-95 transform transition-all duration-300 animate-zoom-in">
            
            {/* Icon កម្រិតវប្បធម៌ ឬនិមិត្តសញ្ញាព្រមានបែបទំនើប */}
            <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              <span className="text-4xl animate-pulse">⏰</span>
            </div>

            {/* ចំណងជើងធំ */}
            <h2 
              style={khmerFontStyle} 
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-500 mb-3"
            >
              អស់រយៈពេលប្រឡងហើយ!
            </h2>

            {/* ការពិពណ៌នា */}
            <p 
              style={khmerFontStyle} 
              className="text-zinc-400 text-base leading-relaxed mb-6"
            >
              ប្រព័ន្ធបានរក្សាទុក និងបញ្ជូនសន្លឹកកិច្ចការរបស់អ្នកទៅកាន់ក្រុមការងារ IT ដោយស្វ័យប្រវត្តរួចរាល់ហើយ។ សូមសម្រាកសិនចុះ!
            </p>

            {/* ប៊ូតុងបិទ ឬចាកចេញ */}
            <button
              onClick={handleCloseAlert}
              style={khmerFontStyle}
              className="w-full py-3.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold tracking-wide rounded-xl shadow-[0_4px_15px_rgba(239,68,68,0.3)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.5)] active:scale-[0.98] transition-all duration-150 text-base"
            >
              យល់ព្រម និងចាកចេញ
            </button>
            
          </div>
        </div>
      )}
    </div>
  );
}