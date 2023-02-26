export class InvalidBody extends Error {
  constructor(error: any) {
    super(JSON.stringify(error));
    this.name = "InvalidBody";
  }
}
