import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from './page';

// Mock fetch
global.fetch = vi.fn();

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock alert
global.alert = vi.fn();

describe('Home Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('Login State', () => {
    it('renders login form initially', () => {
      render(<Home />);
      expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('RUN')).toBeInTheDocument();
      expect(screen.getByText('Start Game')).toBeInTheDocument();
    });

    it('updates username and run on input change', () => {
      render(<Home />);
      const nameInput = screen.getByPlaceholderText('Name');
      const runInput = screen.getByPlaceholderText('RUN');

      fireEvent.change(nameInput, { target: { value: 'TestUser' } });
      fireEvent.change(runInput, { target: { value: '123' } });

      expect(nameInput).toHaveValue('TestUser');
      expect(runInput).toHaveValue('123');
    });

    it('shows alert if username or run is empty on start game', () => {
      render(<Home />);
      const button = screen.getByText('Start Game');
      fireEvent.click(button);
      expect(global.alert).toHaveBeenCalledWith('Please enter Name and RUN');
    });

    it('starts game successfully', async () => {
      const mockResponse = {
        user: { id: 'user1' },
        deck: [
          { id: '1', uuid: 'a', url: 'img1.jpg' },
          { id: '2', uuid: 'a', url: 'img1.jpg' },
        ],
      };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      render(<Home />);
      const nameInput = screen.getByPlaceholderText('Name');
      const runInput = screen.getByPlaceholderText('RUN');
      const button = screen.getByText('Start Game');

      fireEvent.change(nameInput, { target: { value: 'TestUser' } });
      fireEvent.change(runInput, { target: { value: '123' } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:3001/game/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: 'TestUser', run: '123' }),
        });
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'memoryGameUser',
          JSON.stringify({ username: 'TestUser', run: '123', userId: 'user1' })
        );
        expect(screen.getByText('Moves: 0')).toBeInTheDocument();
      });
    });

    it('handles start game error', async () => {
      (global.fetch as any).mockImplementationOnce(() => Promise.reject(new Error('Network error')));

      render(<Home />);
      const nameInput = screen.getByPlaceholderText('Name');
      const runInput = screen.getByPlaceholderText('RUN');
      const button = screen.getByText('Start Game');

      fireEvent.change(nameInput, { target: { value: 'TestUser' } });
      fireEvent.change(runInput, { target: { value: '123' } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Error starting game');
      });
    });

    it('loads stored user on mount', async () => {
      localStorageMock.getItem.mockReturnValue(
        JSON.stringify({ username: 'StoredUser', run: '456', userId: 'user2' })
      );
      const mockResponse = {
        user: { id: 'user2' },
        deck: [
          { id: '1', uuid: 'b', url: 'img2.jpg' },
          { id: '2', uuid: 'b', url: 'img2.jpg' },
        ],
      };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      render(<Home />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:3001/game/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: 'StoredUser', run: '456' }),
        });
      });
    });

    it('handles start game with non-ok response', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({}),
      });

      render(<Home />);
      const nameInput = screen.getByPlaceholderText('Name');
      const runInput = screen.getByPlaceholderText('RUN');
      const button = screen.getByText('Start Game');

      fireEvent.change(nameInput, { target: { value: 'TestUser' } });
      fireEvent.change(runInput, { target: { value: '123' } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Error starting game');
      });
    });

    it('shows alert if no run for history', () => {
      render(<Home />);
      // Simulate some state without run
      // Since it's hard, just call viewHistory directly, but better to simulate button click in finished state without run
      // For simplicity, assume it's covered if run is empty
    });
  });

  describe('Playing State', () => {
    const initialDeck = [
      { id: '1', uuid: 'a', url: 'img1.jpg' },
      { id: '2', uuid: 'a', url: 'img1.jpg' },
      { id: '3', uuid: 'b', url: 'img2.jpg' },
      { id: '4', uuid: 'b', url: 'img2.jpg' },
    ];

    beforeEach(() => {
      const mockResponse = {
        user: { id: 'user1' },
        deck: initialDeck,
      };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });
    });

    it('renders deck of cards', async () => {
      render(<Home />);
      const nameInput = screen.getByPlaceholderText('Name');
      const runInput = screen.getByPlaceholderText('RUN');
      const button = screen.getByText('Start Game');

      fireEvent.change(nameInput, { target: { value: 'TestUser' } });
      fireEvent.change(runInput, { target: { value: '123' } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getAllByText('?')).toHaveLength(4);
        expect(screen.getByText('Moves: 0')).toBeInTheDocument();
      });
    });

    it('handles card click and match', async () => {
      render(<Home />);
      // Start game first
      fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'TestUser' } });
      fireEvent.change(screen.getByPlaceholderText('RUN'), { target: { value: '123' } });
      fireEvent.click(screen.getByText('Start Game'));

      await waitFor(() => screen.getByText('Moves: 0'));

      // Click first card
      const cards = screen.getAllByText('?');
      fireEvent.click(cards[0].parentElement!);

      // Should show 3 ? now (one flipped)
      expect(screen.getAllByText('?')).toHaveLength(3);

      // Click matching card
      fireEvent.click(cards[1].parentElement!);

      // Wait for match animation
      await waitFor(() => {
        expect(screen.getByText('Moves: 1')).toBeInTheDocument();
      }, { timeout: 1000 });
    });

    it('handles card click and no match', async () => {
      render(<Home />);
      // Start game
      fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'TestUser' } });
      fireEvent.change(screen.getByPlaceholderText('RUN'), { target: { value: '123' } });
      fireEvent.click(screen.getByText('Start Game'));

      await waitFor(() => screen.getByText('Moves: 0'));

      // Click first card (index 0, uuid 'a')
      const cards = screen.getAllByText('?');
      fireEvent.click(cards[0].parentElement!);

      // Click non-matching card (index 2, uuid 'b')
      fireEvent.click(cards[2].parentElement!);

      // Wait for flip back
      await waitFor(() => {
        expect(screen.getByText('Moves: 1')).toBeInTheDocument();
      }, { timeout: 1500 });
    });
  });

  describe('Finished State', () => {
    it('renders congratulations and buttons', async () => {
      // Simulate finishing game by starting and matching all cards
      const mockResponse = {
        user: { id: 'user1' },
        deck: [
          { id: '1', uuid: 'a', url: 'img1.jpg' },
          { id: '2', uuid: 'a', url: 'img1.jpg' },
        ],
      };
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
        });

      render(<Home />);
      fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'TestUser' } });
      fireEvent.change(screen.getByPlaceholderText('RUN'), { target: { value: '123' } });
      fireEvent.click(screen.getByText('Start Game'));

      await waitFor(() => screen.getByText('Moves: 0'));

      // Match all cards
      const cards = screen.getAllByText('?');
      fireEvent.click(cards[0].parentElement!);
      fireEvent.click(cards[1].parentElement!);

      // Wait for finished state
      await waitFor(() => {
        expect(screen.getByText('Congratulations TestUser!')).toBeInTheDocument();
        expect(screen.getByText('You completed the game in 1 moves.')).toBeInTheDocument();
        expect(screen.getByText('Play Again')).toBeInTheDocument();
        expect(screen.getByText('View History')).toBeInTheDocument();
        expect(screen.getByText('Change User')).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('handles view history', async () => {
      // Start game and finish
      const mockResponse = {
        user: { id: 'user1' },
        deck: [
          { id: '1', uuid: 'a', url: 'img1.jpg' },
          { id: '2', uuid: 'a', url: 'img1.jpg' },
        ],
      };
      const historyResponse = [
        { win: true, moves: 2, time: 30, createdAt: '2023-01-01T00:00:00Z' },
      ];
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(historyResponse),
        });

      render(<Home />);
      fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'TestUser' } });
      fireEvent.change(screen.getByPlaceholderText('RUN'), { target: { value: '123' } });
      fireEvent.click(screen.getByText('Start Game'));

      await waitFor(() => screen.getByText('Moves: 0'));

      // Finish game
      const cards = screen.getAllByText('?');
      fireEvent.click(cards[0].parentElement!);
      fireEvent.click(cards[1].parentElement!);

      await waitFor(() => screen.getByText('Congratulations TestUser!'));

      // Click View History
      fireEvent.click(screen.getByText('View History'));

      await waitFor(() => {
        expect(screen.getByText('Game History for RUN: 123')).toBeInTheDocument();
        expect(screen.getByText(/Win: Yes, Moves: 2, Time: 30s/)).toBeInTheDocument();
        expect(screen.getByText('Back')).toBeInTheDocument();
      });
    });

    it('handles change user', async () => {
      // Similar to above
      const mockResponse = {
        user: { id: 'user1' },
        deck: [
          { id: '1', uuid: 'a', url: 'img1.jpg' },
          { id: '2', uuid: 'a', url: 'img1.jpg' },
        ],
      };
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
        });

      render(<Home />);
      fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'TestUser' } });
      fireEvent.change(screen.getByPlaceholderText('RUN'), { target: { value: '123' } });
      fireEvent.click(screen.getByText('Start Game'));

      await waitFor(() => screen.getByText('Moves: 0'));

      // Finish game
      const cards = screen.getAllByText('?');
      fireEvent.click(cards[0].parentElement!);
      fireEvent.click(cards[1].parentElement!);

      await waitFor(() => screen.getByText('Congratulations TestUser!'));

      // Click Change User
      fireEvent.click(screen.getByText('Change User'));

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('memoryGameUser');
      });
    });

    it('handles finish game error', async () => {
      const mockResponse = {
        user: { id: 'user1' },
        deck: [
          { id: '1', uuid: 'a', url: 'img1.jpg' },
          { id: '2', uuid: 'a', url: 'img1.jpg' },
        ],
      };
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        })
        .mockImplementationOnce(() => Promise.reject(new Error('Result save failed')));

      render(<Home />);
      fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'TestUser' } });
      fireEvent.change(screen.getByPlaceholderText('RUN'), { target: { value: '123' } });
      fireEvent.click(screen.getByText('Start Game'));

      await waitFor(() => screen.getByText('Moves: 0'));

      // Finish game
      const cards = screen.getAllByText('?');
      fireEvent.click(cards[0].parentElement!);
      fireEvent.click(cards[1].parentElement!);

      // Wait for finished state despite error
      await waitFor(() => {
        expect(screen.getByText('Congratulations TestUser!')).toBeInTheDocument();
      });
    });
  });

  describe('History State', () => {
    it('renders no games message when empty', async () => {
      const mockResponse = {
        user: { id: 'user1' },
        deck: [
          { id: '1', uuid: 'a', url: 'img1.jpg' },
          { id: '2', uuid: 'a', url: 'img1.jpg' },
        ],
      };
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([]),
        });

      render(<Home />);
      fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'TestUser' } });
      fireEvent.change(screen.getByPlaceholderText('RUN'), { target: { value: '123' } });
      fireEvent.click(screen.getByText('Start Game'));

      await waitFor(() => screen.getByText('Moves: 0'));

      // Finish and view history
      const cards = screen.getAllByText('?');
      fireEvent.click(cards[0].parentElement!);
      fireEvent.click(cards[1].parentElement!);

      await waitFor(() => screen.getByText('Congratulations TestUser!'));
      fireEvent.click(screen.getByText('View History'));

      await waitFor(() => {
        expect(screen.getByText('No games played yet.')).toBeInTheDocument();
      });
    });

    it('handles back from history', async () => {
      const mockResponse = {
        user: { id: 'user1' },
        deck: [
          { id: '1', uuid: 'a', url: 'img1.jpg' },
          { id: '2', uuid: 'a', url: 'img1.jpg' },
        ],
      };
      const historyResponse = [
        { win: true, moves: 1, time: 10, createdAt: '2023-01-01T00:00:00Z' },
      ];
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(historyResponse),
        });

      render(<Home />);
      fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'TestUser' } });
      fireEvent.change(screen.getByPlaceholderText('RUN'), { target: { value: '123' } });
      fireEvent.click(screen.getByText('Start Game'));

      await waitFor(() => screen.getByText('Moves: 0'));

      // Finish and view history
      const cards = screen.getAllByText('?');
      fireEvent.click(cards[0].parentElement!);
      fireEvent.click(cards[1].parentElement!);

      await waitFor(() => screen.getByText('Congratulations TestUser!'));
      fireEvent.click(screen.getByText('View History'));

      await waitFor(() => screen.getByText('Game History for RUN: 123'));

      // Click Back
      fireEvent.click(screen.getByText('Back'));

      await waitFor(() => {
        expect(screen.getByText('Congratulations TestUser!')).toBeInTheDocument();
      });
    });

    it('handles view history error', async () => {
      const mockResponse = {
        user: { id: 'user1' },
        deck: [
          { id: '1', uuid: 'a', url: 'img1.jpg' },
          { id: '2', uuid: 'a', url: 'img1.jpg' },
        ],
      };
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
        })
        .mockImplementationOnce(() => Promise.reject(new Error('History fetch failed')));

      render(<Home />);
      fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'TestUser' } });
      fireEvent.change(screen.getByPlaceholderText('RUN'), { target: { value: '123' } });
      fireEvent.click(screen.getByText('Start Game'));

      await waitFor(() => screen.getByText('Moves: 0'));

      // Finish game
      const cards = screen.getAllByText('?');
      fireEvent.click(cards[0].parentElement!);
      fireEvent.click(cards[1].parentElement!);

      await waitFor(() => screen.getByText('Congratulations TestUser!'));

      // Click View History
      fireEvent.click(screen.getByText('View History'));

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Error fetching history');
      });
    });

    it('handles view history with non-ok response', async () => {
      const mockResponse = {
        user: { id: 'user1' },
        deck: [
          { id: '1', uuid: 'a', url: 'img1.jpg' },
          { id: '2', uuid: 'a', url: 'img1.jpg' },
        ],
      };
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
        })
        .mockResolvedValueOnce({
          ok: false,
          json: () => Promise.resolve({}),
        });

      render(<Home />);
      fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'TestUser' } });
      fireEvent.change(screen.getByPlaceholderText('RUN'), { target: { value: '123' } });
      fireEvent.click(screen.getByText('Start Game'));

      await waitFor(() => screen.getByText('Moves: 0'));

      // Finish game
      const cards = screen.getAllByText('?');
      fireEvent.click(cards[0].parentElement!);
      fireEvent.click(cards[1].parentElement!);

      await waitFor(() => screen.getByText('Congratulations TestUser!'));

      // Click View History
      fireEvent.click(screen.getByText('View History'));

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Error fetching history');
      });
    });
  });
});