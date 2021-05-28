/**
 * Thrown error if the fetching of results about
 * infomration of music fails
 * @param  {string} message
 */
export class MusicResultError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MusicResultError";
  }
}
