export class ShortUrlEntity {
  constructor(
    public readonly id: string,
    public url: string,
    public readonly shortCode: string,
    public accessCount: number,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  updateUrl(newUrl: string) {
    this.url = newUrl;
    this.updatedAt = new Date();
  }

  registerAccess() {
    this.accessCount += 1;
    this.updatedAt = new Date();
  }
}
