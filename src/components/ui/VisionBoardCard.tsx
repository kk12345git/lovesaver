import React from 'react';

interface VisionBoardCardProps {
    goalName: string;
    targetAmount: number;
    currentAmount: number;
    icon: string;
}

export default function VisionBoardCard({ goalName, targetAmount, currentAmount, icon }: VisionBoardCardProps) {
    const percent = Math.min(100, Math.round((currentAmount / targetAmount) * 100));

    return (
        <div 
            id="vision-board-export"
            className="w-[1080px] h-[1920px] bg-gradient-to-br from-pink-100 via-rose-50 to-purple-50 flex flex-col items-center justify-center p-20 relative overflow-hidden"
            style={{ fontFamily: "'Inter', sans-serif" }}
        >
            {/* Background decorative blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-pink-300/30 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-purple-300/30 rounded-full blur-[100px]" />

            {/* Main content card */}
            <div className="bg-white/40 backdrop-blur-3xl border border-white/60 p-16 rounded-[4rem] shadow-2xl w-full max-w-[900px] flex flex-col items-center text-center z-10 relative">
                
                {/* Crystal / Icon Placeholder */}
                <div className="w-64 h-64 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full flex items-center justify-center text-[100px] shadow-inner mb-12 border-8 border-white">
                    {icon}
                </div>

                <h1 className="text-6xl font-black text-gray-800 mb-6 tracking-tight">
                    {goalName}
                </h1>
                
                <p className="text-4xl font-bold text-pink-500 mb-16">
                    ₹{currentAmount.toLocaleString('en-IN')} <span className="text-gray-400 font-medium text-3xl">/ ₹{targetAmount.toLocaleString('en-IN')}</span>
                </p>

                {/* Progress Bar */}
                <div className="w-full bg-white/50 rounded-full h-8 mb-8 overflow-hidden shadow-inner border border-white/50">
                    <div 
                        className="h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                    />
                </div>
                
                <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-4">
                    {percent}% Manifested ✨
                </h2>
                
                {percent >= 100 ? (
                    <p className="text-2xl font-bold text-gray-500 mt-4">Goal Achieved! Time to celebrate. 🎉</p>
                ) : (
                    <p className="text-2xl font-bold text-gray-500 mt-4">Working towards my soft life.</p>
                )}
            </div>

            {/* Footer Branding */}
            <div className="absolute bottom-16 flex items-center gap-4 opacity-80 z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
                    💖
                </div>
                <span className="text-3xl font-black text-gray-800 tracking-tight">LoveSaver App</span>
            </div>
        </div>
    );
}
