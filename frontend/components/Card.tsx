import React from 'react';

interface CardProps {
    id: string;
    url: string;
    isFlipped: boolean;
    isMatched: boolean;
    onClick: () => void;
}

export const Card: React.FC<CardProps> = ({ url, isFlipped, isMatched, onClick }) => {
    return (
        <div
            onClick={!isFlipped && !isMatched ? onClick : undefined}
            className={`relative w-24 h-32 m-2 cursor-pointer perspective-1000 transition-transform duration-500 transform ${isFlipped || isMatched ? 'rotate-y-180' : ''
                }`}
        >
            <div
                className={`w-full h-full rounded-lg shadow-md flex items-center justify-center text-3xl select-none transition-colors duration-300 ${isFlipped || isMatched ? 'bg-white' : 'bg-blue-600'
                    }`}
            >
                {(isFlipped || isMatched) ? (
                    <img src={url} alt="card" className="w-full h-full object-cover rounded-lg" />
                ) : (
                    <span className="text-white">?</span>
                )}
            </div>
        </div>
    );
};
