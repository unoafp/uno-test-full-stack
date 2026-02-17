export class Card {
  constructor(
    private readonly id: string,
    private readonly title: string,
    private readonly url: string,
    private readonly value: string,
  ) {}

  static create(title: string, url: string, value: string) {
    const id = crypto.randomUUID();
    return new Card(id, title, url, value);
  }

  static createPair(title: string, url: string, value: string): [Card, Card] {
    const original = Card.create(title, url, value);
    const pair = Card.create(title, url, value);
    return [original, pair];
  }

  getId() {
    return this.id;
  }

  getTitle() {
    return this.title;
  }

  getUrl() {
    return this.url;
  }

  getValue() {
    return this.value;
  }
}
