'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/Card';
import { v4 as uuidv4 } from 'uuid';

interface CardData {
  id: string;
  uuid: string;
  url: string;
}

export default function Home() {
  const [username, setUsername] = useState('');
  const [run, setRun] = useState('');
  const [gameState, setGameState] = useState<'login' | 'playing' | 'finished' | 'history'>('login');

  const [deck, setDeck] = useState<CardData[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());

  const [moves, setMoves] = useState(0);
  const [userId, setUserId] = useState('');
  const [startTime, setStartTime] = useState(0);
  const [history, setHistory] = useState<any[]>([]);

  const startGameWithCreds = async (uname: string, urn: string) => {
    try {
      const res = await fetch('http://localhost:3001/game/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: uname, run: urn }),
      });
      if (!res.ok) throw new Error('Failed to start game');
      const data = await res.json();

      setUsername(uname);
      setRun(urn);
      setUserId(data.user.id);
      localStorage.setItem('memoryGameUser', JSON.stringify({ username: uname, run: urn, userId: data.user.id }));
      setDeck(data.deck);
      setGameState('playing');
      setMatchedIds(new Set());
      setFlippedIndices([]);
      setMoves(0);
      setStartTime(Date.now());
    } catch (err) {
      alert('Error starting game');
      console.error(err);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('memoryGameUser');
    if (storedUser) {
      const { username: storedUsername, run: storedRun } = JSON.parse(storedUser);
      startGameWithCreds(storedUsername, storedRun);
    }
  }, []);

  const startGame = () => {
    if (!username || !run) return alert('Please enter Name and RUN');
    startGameWithCreds(username, run);
  };

  const handleCardClick = (index: number) => {
    if (flippedIndices.length >= 2 || flippedIndices.includes(index) || matchedIds.has(deck[index].id)) return;

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      if (deck[first].uuid === deck[second].uuid) {
        // Match
        setTimeout(() => {
          setMatchedIds(prev => {
            const next = new Set(prev);
            next.add(deck[first].id);
            next.add(deck[second].id);

            if (next.size === deck.length) {
              finishGame(next.size);
            }
            return next;
          });
          setFlippedIndices([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => setFlippedIndices([]), 1000);
      }
    }
  };

  const finishGame = async (matchedCount: number) => {
    setGameState('finished');
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    try {
      await fetch('http://localhost:3001/game/result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          win: true,
          moves: moves + 1, // include the last move
          time: timeTaken
        })
      });
    } catch (e) {
      console.error("Failed to save result", e);
    }
  };

  const viewHistory = async () => {
    if (!run) return alert('No RUN available');
    try {
      const res = await fetch(`http://localhost:3001/game/history/${run}`);
      if (!res.ok) throw new Error('Failed to fetch history');
      const data = await res.json();
      setHistory(data);
      setGameState('history');
    } catch (err) {
      alert('Error fetching history');
      console.error(err);
    }
  };

  const changeUser = () => {
    localStorage.removeItem('memoryGameUser');
    setUsername('');
    setRun('');
    setUserId('');
    setGameState('login');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Memory Game</h1>

      {gameState === 'login' && (
        <div className="bg-white p-8 rounded shadow-lg flex flex-col gap-4">
          <input
            className="border p-2 rounded text-black"
            placeholder="Name"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <input
            className="border p-2 rounded text-black"
            placeholder="RUN"
            value={run}
            onChange={e => setRun(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            onClick={startGame}
          >
            Start Game
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="flex flex-col items-center">
          <div className="mb-4 text-xl">Moves: {moves}</div>
          <div className="grid grid-cols-4 gap-4">
            {deck.map((card, i) => (
              <Card
                key={card.id}
                {...card}
                isFlipped={flippedIndices.includes(i)}
                isMatched={matchedIds.has(card.id)}
                onClick={() => handleCardClick(i)}
              />
            ))}
          </div>
        </div>
      )}

      {gameState === 'finished' && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-green-600">Congratulations {username}!</h2>
          <p>You completed the game in {moves} moves.</p>
          <div className="mt-4 flex gap-4 justify-center">
            <button
              className="bg-blue-600 text-white p-2 rounded"
              onClick={startGame}
            >
              Play Again
            </button>
            <button
              className="bg-green-600 text-white p-2 rounded"
              onClick={viewHistory}
            >
              View History
            </button>
            <button
              className="bg-red-600 text-white p-2 rounded"
              onClick={changeUser}
            >
              Change User
            </button>
          </div>
        </div>
      )}

      {gameState === 'history' && (
        <div className="text-center text-black">
          <h2 className="text-2xl font-bold mb-4 text-black">Game History for RUN: {run}</h2>
          <div className="mb-4 text-black">
            {history.length === 0 ? (
              <p className="text-black">No games played yet.</p>
            ) : (
              <ul className="list-disc list-inside text-black">
                {history.map((game, index) => (
                  <li key={index} className="text-black">
                    Win: {game.win ? 'Yes' : 'No'}, Moves: {game.moves}, Time: {game.time}s, Date: {new Date(game.createdAt).toLocaleString()}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            className="bg-blue-600 text-white p-2 rounded"
            onClick={() => setGameState('finished')}
          >
            Back
          </button>
        </div>
      )}
    </main>
  );
}
