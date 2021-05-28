/**
 * Thrown error ifsomething wents wrong during parsing
 * (e.g. of the user message / command)
 * @param  {string} message
 */
export class ParsingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ParsingError";
  }
}
