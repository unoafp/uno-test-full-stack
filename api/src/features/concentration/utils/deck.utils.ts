import { type ImageApiResponse } from '../types/images-api.types';

export function takeCards(
  array: ImageApiResponse[],
  n: number,
): ImageApiResponse[] {
  if (n > array.length) {
    throw new Error('N cannot be greater than the size of the array.');
  }

  return array.slice(0, n);
}

export function duplicateDeck<ImageApiResponse>(
  cards: ImageApiResponse[],
): ImageApiResponse[] {
  return [...cards, ...cards];
}

export function shuffleDeck<ImageApiResponse>(
  cards: ImageApiResponse[],
): ImageApiResponse[] {
  const copy = [...cards];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
