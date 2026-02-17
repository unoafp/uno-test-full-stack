import { GameGenerator } from './game-generator';

describe('GameGenerator', () => {
  it('should generate a game with a deck of cards', async () => {
    const mockProvider = {
      getCardContents: jest.fn().mockResolvedValue([
        { id: '1', title: 'Card 1', url: 'http://example.com/card1' },
        { id: '2', title: 'Card 2', url: 'http://example.com/card2' },
      ]),
    };

    const generator = new GameGenerator(mockProvider);
    const game = await generator.execute();

    expect(mockProvider.getCardContents).toHaveBeenCalledWith(10);

    const deck = game.getDeck();
    expect(deck).toHaveLength(4);

    const firstPair = deck.filter((card) => card.getValue() === '1');
    const secondPair = deck.filter((card) => card.getValue() === '2');

    expect(firstPair).toHaveLength(2);
    expect(secondPair).toHaveLength(2);

    expect(firstPair[0].getTitle()).toBe('Card 1');
    expect(firstPair[0].getUrl()).toBe('http://example.com/card1');
    expect(firstPair[0].getValue()).toBe('1');
    expect(firstPair[1].getTitle()).toBe('Card 1');
    expect(firstPair[1].getUrl()).toBe('http://example.com/card1');
    expect(firstPair[1].getValue()).toBe('1');
    expect(firstPair[0].getId()).not.toBe(firstPair[1].getId());

    expect(secondPair[0].getTitle()).toBe('Card 2');
    expect(secondPair[0].getUrl()).toBe('http://example.com/card2');
    expect(secondPair[0].getValue()).toBe('2');

    expect(secondPair[1].getTitle()).toBe('Card 2');
    expect(secondPair[1].getUrl()).toBe('http://example.com/card2');
    expect(secondPair[1].getValue()).toBe('2');
    expect(secondPair[0].getId()).not.toBe(secondPair[1].getId());
  });
});
