class User {
  constructor(
    private readonly id: string,
    private run: string,
    private name: string,
  ) {}

  // TODO : validate run and name
  // TODO : Change to value object
  static Create({ run, name }: { run: string; name: string }): User {
    const id = crypto.randomUUID();
    return new User(id, run, name);
  }

  getId(): string {
    return this.id;
  }

  getRun(): string {
    return this.run;
  }

  getName(): string {
    return this.name;
  }
}

export { User };
