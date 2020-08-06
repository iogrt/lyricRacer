import styled from 'styled-components';

export const Background = styled.div({
  backgroundColor: "#4ecdc4",
  height: "100vh",
  overflow: "auto",
});

export const Header = styled.h1({
  textAlign: "center",
});
export const SubHeader = styled.h3({
  textAlign: "center",
  fontWeight: "normal",
})

export const Wrapper = styled.div({
  margin: "0 auto",
  maxWidth: "600px",

  // For LineIndicatedText and the close button
  position: "relative",
});

export const MultilineText = styled.p({
  whiteSpace: "pre-wrap",
  textAlign: "center",
  fontSize: "21px",
});

export const HighlightedText = styled.span({
  backgroundColor: "white"
})

export const LineIndicatedText = styled.span({
  ":before": {
    content: '"▶"',
    color: "grey",
    position: "absolute",
    left: 0,
  },
})

export const SearchBar = styled.input({
  width: "100%",
  borderRadius: "10px",
  border: "2px solid aqua",
  padding: "10px",
  fontSize: "15px",
  ":focus": {
    outline: "none",
    boxShadow: "0 0 0 1pt grey",
  }
})

export const TransparentButton = styled.button({
  border: "none",
  outline: "none",
  backgroundColor: "transparent",
  cursor: "pointer",
})

export const CloseButton = styled(TransparentButton)({
  position: "absolute",
  left: "0px",
  top: "0px",
  color: "grey",
  fontSize: "30px",
})

export const CenteredImage = styled.img({
  display: "block",
  margin: "0 auto",
})