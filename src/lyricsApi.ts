import { Song } from './store';

interface ResultType {
  title: string,
  author: string,
  lyrics: string,
  thumbnail: {
    genius: string,
  },
}

// Replace ‘ for ', some songs have this character
const lyricsSanitizer = (lyrics: string) =>
  // remove first \n if it exists
  (lyrics.startsWith("\n") ? lyrics.slice(1) : lyrics)
    .replace(/‘/g, "'")
    // a lot of different types of whitespace
    // https://emptycharacter.com/
    .replace(/\u00A0|\u2000|\u2001|\u2002|\u2003|\u2004|\u2005|\u2006|\u2007|\u2008|\u2009|\u200A|\u2028|\u205F|\u3000/g, " ")


export default (search: string) =>
  fetch(`https://cors-anywhere.herokuapp.com/some-random-api.ml/lyrics/?title=${search}`)
    .then(r => r.json()).then((r: ResultType) => ({
      title: r.title,
      author: r.author,
      lyrics: lyricsSanitizer(r.lyrics),
      thumbnail: r.thumbnail.genius
    }) as Song)