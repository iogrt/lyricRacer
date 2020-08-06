import { ValuesType } from 'utility-types';
import {
  typedAction,

} from './utils';
import lyricsApi from '../lyricsApi';


export interface Song {
  title: string;
  author: string;
  lyrics: string;
  thumbnail: string;
}

export type Hint = {
  text: string,
  color: string,
} | null

export interface SongUnselected {
  kind: 'SongUnselected',
  searchQuery: string,
  hint: Hint,
}

export interface SongSelected {
  kind: 'SongSelected',
  song: Song,
  completionIndex: number,
}

export type Model = SongUnselected | SongSelected
type ModelKind = Model["kind"]

type KindMap<U> = {
  [K in ModelKind]: U extends { kind: K } ? U : never
}
type ModelKindMap = KindMap<Model>

const ifKind = (
  state: Model,
  x: Partial<{ [K in ModelKind]: (stateCase: ModelKindMap[K]) => Model }>
): Model => {
  const desiredBranch = x[state.kind];
  if (desiredBranch !== undefined) {
    // This is safe because desiredBranch has the same kind as state.
    return desiredBranch(state as any)
  }
  else {
    return state
  }
}

export const initialState: Model = {
  kind: 'SongUnselected',
  searchQuery: "",
  hint: null,
}


export const actions = {
  setSong: (song: Song) => typedAction('song/set', song),
  typeKey: (key: string) => typedAction('song/typeKey', key),
  setSearchQuery: (query: string) => typedAction('search/setQuery', query),
  searchSong: (query: string) => typedAction('search/start', query),
  closeSong: () => typedAction('song/close'),
  setHint: (hint: Hint) => typedAction('hint/set', hint),
}
export type Action = ReturnType<ValuesType<typeof actions>>



export const dispatchMiddleware = (dispatch: React.Dispatch<Action>) => (action: Action) => {
  switch (action.type) {
    case 'search/start':
      dispatch(actions.setHint({
        text: "Searching...",
        color: "white"
      }))

      lyricsApi(action.payload).then(songData => {
        dispatch(actions.setSong(songData));
      }).catch(() =>
        dispatch(actions.setHint({
          text: "Song search failed, please try again",
          color: "red"
        }))
      )
      break;
    default:
      dispatch(action);
  }
}

export function reducer(
  state = initialState,
  action: Action
): Model {
  switch (action.type) {
    case 'search/setQuery':
      return ifKind(state,
        {
          'SongUnselected': m => ({ ...m, searchQuery: action.payload }),
        }
      )
    case 'song/set':
      return {
        kind: 'SongSelected',
        song: action.payload,
        completionIndex: 0,
      }
    case 'song/close':
      return initialState;
    case 'song/typeKey':
      return ifKind(state,
        {
          'SongSelected': model => {
            const charTyped = action.payload === "Enter" ? "\n" : action.payload
            const correctChar = charTyped === model.song.lyrics[model.completionIndex];
            const newIndex = correctChar
              ? model.completionIndex + 1
              : model.completionIndex;
            return { ...model, completionIndex: newIndex }
          }
        }
      )
    case 'hint/set':
      return ifKind(state,
        {
          'SongUnselected': model => ({
            ...model,
            hint: action.payload,
          })
        }
      )
    default:
      return state;
  }
}
