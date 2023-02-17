export class InvalidBody extends Error {
  constructor(error: any) {
    super(error);
    this.name = "InvalidBody";
  }
}
