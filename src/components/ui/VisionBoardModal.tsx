import React, { useRef, useState } from 'react';
import Modal from './Modal';
import VisionBoardCard from './VisionBoardCard';
import { toPng } from 'html-to-image';
import { Download, Share2, Loader2, Sparkles } from 'lucide-react';

interface VisionBoardModalProps {
    isOpen: boolean;
    onClose: () => void;
    goal: {
        name: string;
        target_amount: number;
        current_amount: number;
        icon: string;
    } | null;
}

export default function VisionBoardModal({ isOpen, onClose, goal }: VisionBoardModalProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [generating, setGenerating] = useState(false);
    const [status, setStatus] = useState<'' | 'success' | 'checking'>('');

    if (!goal) return null;

    const generateImage = async (): Promise<Blob | null> => {
        if (!cardRef.current) return null;
        setGenerating(true);
        setStatus('checking');
        
        try {
            // Need a slight delay to ensure fonts/layout are fully rendered off-screen
            await new Promise(r => setTimeout(r, 100));
            
            const dataUrl = await toPng(cardRef.current, {
                quality: 1.0,
                pixelRatio: 2, // High resolution for Retina displays/social media
                cacheBust: true,
                style: {
                    transform: 'none', // Prevent scale issues
                    transformOrigin: 'top left',
                }
            });
            
            const res = await fetch(dataUrl);
            return await res.blob();
            
        } catch (err) {
            console.error('Failed to generate vision board', err);
            return null;
        } finally {
            setGenerating(false);
        }
    };

    const handleDownload = async () => {
        const blob = await generateImage();
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lovesaver-vision-${goal.name.toLowerCase().replace(/\s+/g, '-')}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        setStatus('success');
        setTimeout(() => setStatus(''), 3000);
    };

    const handleShare = async () => {
        const blob = await generateImage();
        if (!blob) return;

        const file = new File([blob], 'vision-board.png', { type: 'image/png' });
        
        // Native Share API on Mobile
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    title: 'My Savings Goal',
                    text: `Manifesting my ${goal.name} with LoveSaver App! 💖✨`,
                    files: [file],
                });
                setStatus('success');
                setTimeout(() => setStatus(''), 3000);
            } catch (err) {
                console.log('User cancelled share or share failed', err);
            }
        } else {
            // Fallback to Download if Native Share isn't supported (e.g., Desktop Chrome)
            handleDownload();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="✨ Manifest Your Vision">
            <div className="flex flex-col items-center">
                <p className="text-center text-sm text-gray-500 mb-6">
                    Share your aesthetic savings goal to your Instagram Story or with a partner!
                </p>

                {/* Secret Container: 
                    We render the 1080x1920 card hidden off-screen.
                    html-to-image will still parse it perfectly for export. 
                */}
                <div style={{ position: 'absolute', top: '-10000px', left: '-10000px' }}>
                    <div ref={cardRef}>
                        <VisionBoardCard 
                            goalName={goal.name}
                            targetAmount={goal.target_amount}
                            currentAmount={goal.current_amount}
                            icon={goal.icon}
                        />
                    </div>
                </div>

                {/* Visual Preview (Scaled down representation) */}
                <div className="w-full max-w-[200px] aspect-[9/16] bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl shadow-lg border-4 border-white mb-8 overflow-hidden relative flex flex-col items-center justify-center p-4">
                     <div className="text-4xl mb-4 bg-white/50 w-16 h-16 rounded-full flex items-center justify-center shadow-inner">{goal.icon}</div>
                     <h3 className="font-black text-center text-gray-800 text-sm leading-tight">{goal.name}</h3>
                     
                     <div className="w-full bg-white/50 rounded-full h-2 mt-4 overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-pink-400 to-purple-500"
                            style={{ width: `${Math.min(100, (goal.current_amount / goal.target_amount) * 100)}%` }}
                        />
                     </div>
                     <p className="text-[8px] font-bold text-gray-500 mt-2">LoveSaver App</p>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 w-full">
                    <button 
                        onClick={handleDownload}
                        disabled={generating}
                        className="btn-secondary flex items-center justify-center gap-2 !py-4"
                    >
                        {generating && status === 'checking' ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} 
                        Save Image
                    </button>
                    <button 
                        onClick={handleShare}
                        disabled={generating}
                        className="btn-primary flex items-center justify-center gap-2 !py-4 shadow-pink-500/30"
                    >
                        {status === 'success' ? <Sparkles size={16} className="text-yellow-200" /> : <Share2 size={16} />}
                        {status === 'success' ? 'Shared!' : 'Share Now'}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
