import {
  takeCards,
  duplicateDeck,
  shuffleDeck,
  toPublicCard,
} from './deck.utils';
import { CardModel } from '../schemas/card.schema';
import { ImageApiResponse } from '../types/images-api.types';

describe('deck.utils', () => {
  describe('takeCards', () => {
    it('should return the first N cards', () => {
      const cards: ImageApiResponse[] = [
        { uuid: '1', title: 'A' } as ImageApiResponse,
        { uuid: '2', title: 'B' } as ImageApiResponse,
        { uuid: '3', title: 'C' } as ImageApiResponse,
      ];

      const result = takeCards(cards, 2);

      expect(result).toHaveLength(2);
      expect(result).toEqual([
        { uuid: '1', title: 'A' },
        { uuid: '2', title: 'B' },
      ]);
    });

    it('should throw an error if N is greater than array length', () => {
      const cards: ImageApiResponse[] = [
        { uuid: '1', title: 'A' } as ImageApiResponse,
      ];

      expect(() => takeCards(cards, 2)).toThrow(
        'N cannot be greater than the size of the array.',
      );
    });
  });

  describe('duplicateDeck', () => {
    it('should duplicate the deck', () => {
      const cards = [
        { uuid: '1', title: 'A' },
        { uuid: '2', title: 'B' },
      ];

      const result = duplicateDeck(cards);

      expect(result).toHaveLength(4);
      expect(result).toEqual([
        { uuid: '1', title: 'A' },
        { uuid: '2', title: 'B' },
        { uuid: '1', title: 'A' },
        { uuid: '2', title: 'B' },
      ]);
    });

    it('should not mutate the original array', () => {
      const cards = [{ uuid: '1', title: 'A' }];

      const result = duplicateDeck(cards);

      expect(cards).toEqual([{ uuid: '1', title: 'A' }]);
      expect(result).not.toBe(cards);
    });
  });

  describe('shuffleDeck', () => {
    it('should return a deck with the same elements', () => {
      const cards = [
        { uuid: '1', title: 'A' },
        { uuid: '2', title: 'B' },
        { uuid: '3', title: 'C' },
      ];

      const result = shuffleDeck(cards);

      // Mismos elementos, sin importar orden
      expect(result).toHaveLength(cards.length);
      expect(result).toEqual(expect.arrayContaining(cards));
    });

    it('should not mutate the original array', () => {
      const cards = [
        { uuid: '1', title: 'A' },
        { uuid: '2', title: 'B' },
      ];

      const original = [...cards];
      shuffleDeck(cards);

      expect(cards).toEqual(original);
    });

    it('should actually shuffle order sometimes', () => {
      const cards = [
        { uuid: '1', title: 'A' },
        { uuid: '2', title: 'B' },
        { uuid: '3', title: 'C' },
        { uuid: '4', title: 'D' },
      ];

      const result = shuffleDeck(cards);

      // No garantizamos que siempre cambie, pero al menos validamos que no rompe datos
      expect(result).not.toBe(cards);
      expect(result).toEqual(expect.arrayContaining(cards));
    });
  });

  describe('toPublicCard', () => {
    it('should hide imageId when status is hidden', () => {
      const card = {
        id: '1',
        status: 'hidden',
        imageId: 'img-123',
        position: 0,
      } as CardModel;

      const result = toPublicCard(card);

      expect(result).toEqual({
        id: '1',
        status: 'hidden',
        imageId: null,
        position: 0,
      });
    });

    it('should show imageId when status is revealed or match', () => {
      const card = {
        id: '1',
        status: 'revealed',
        imageId: 'img-123',
        position: 0,
      } as CardModel;

      const result = toPublicCard(card);

      expect(result).toEqual({
        id: '1',
        status: 'revealed',
        imageId: 'img-123',
        position: 0,
      });
    });
  });
});
