import React, { FunctionComponent, useReducer, createContext, useContext } from 'react';
import {
  reducer,
  initialState,
  actions,
  Action,
  SongSelected,
  SongUnselected,
  dispatchMiddleware
} from './store'

import './App.css';
import {
  Background,
  Header,
  SubHeader,
  Wrapper,
  MultilineText,
  HighlightedText,
  LineIndicatedText,
  SearchBar,
  CloseButton,
  CenteredImage
} from './components/base';

import kermitGif from './images/kermit_typing.gif';

const DispatchCtx = createContext<React.Dispatch<Action>>(() => { });
const useDispatch = () => useContext(DispatchCtx);

const WithDispatch = (fn: (a: React.Dispatch<Action>) => JSX.Element) => fn(useDispatch())
const withPrevent = <T extends React.SyntheticEvent>(fn: (e: T) => void) => (e: T) => {
  e.preventDefault();
  fn(e);
}


const UnselectedView = ({ model }: { model: SongUnselected }) =>
  WithDispatch(dispatch =>
    (
      <Background>
        <Wrapper>
          <Header><i><u>LyricRacer</u></i></Header>
          <CenteredImage src={kermitGif} alt="Typing GIF" />
          <SubHeader><i>TypeRacer for song lyrics.</i></SubHeader>
          <Header>Search for a song: </Header>
          <form onSubmit={
            withPrevent(() => dispatch(actions.searchSong(model.searchQuery)))}
          >
            <SearchBar
              value={model.searchQuery}
              onChange={e => dispatch(actions.setSearchQuery(e.target.value))}
            ></SearchBar>
            {model.hint !== null &&
              <p style={{ color: model.hint.color }}>{model.hint.text}</p>
            }
          </form>
        </Wrapper>
      </Background>
    )
  )
const SelectedView = ({ model }: { model: SongSelected }) =>
  WithDispatch(dispatch =>
    (
      <Background
        onKeyPress={withPrevent(e => dispatch(actions.typeKey(e.key)))}
        tabIndex={0}
      >
        <Wrapper>
          <CloseButton onClick={() => dispatch(actions.closeSong())}>X</CloseButton>
          <Header>{model.song.author + " - " + model.song.title}</Header>
          <CenteredImage src={model.song.thumbnail} alt="Song thumbnail" />
          <hr style={{ borderColor: "black" }} />
          <MultilineText>
            <HighlightedText>{model.song.lyrics.slice(0, model.completionIndex)}</HighlightedText>
            <LineIndicatedText>{model.song.lyrics.slice(model.completionIndex)}</LineIndicatedText>
          </MultilineText>
        </Wrapper>
      </Background >
    )
  )


export const App: FunctionComponent<{}> = () => {

  const [model, rawDispatch] = useReducer(reducer, initialState);
  const dispatch = dispatchMiddleware(rawDispatch);

  return (
    <DispatchCtx.Provider value={dispatch}>
      {
        model.kind === "SongUnselected"
          ? <UnselectedView {...{ model }}></UnselectedView>
          : <SelectedView {...{ model }}></SelectedView>
      }
    </DispatchCtx.Provider>
  )
}

export default App;
