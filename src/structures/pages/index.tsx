import React from 'react';
import styled, { ThemeConsumer } from 'styled-components';
import { Knob, SEO } from '../components';
import { useMediaQuery } from '../hooks';

/* -------------------------------------------------------------------------- */
/*                                   styles                                   */
/* -------------------------------------------------------------------------- */

const PageContainer = styled.div`
  background-color: #cccccc;
  display: flex;
  flex-direction: column;
  height: 100%;
  color: ${({ theme }) => theme.colors.whiteTint};
  text-align: center;
  justify-content: space-around;
  align-items: center;

  & footer,
  & h1 {
    font-family: 'Righteous', cursive;
  }

  & footer a {
    text-decoration: none;
    color: #c0392b;
  }
`;

/* ------------------------------ drum machine ------------------------------ */

const DrumMachineContainer = styled.main`
  width: 90%;
  height: 90%;
  background-color: #212226;
  border-radius: 25px;
  border: 5px solid #8e8d92;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.75);
  display: grid;
  grid-template: auto 1fr / 1fr;
  overflow-y: scroll;
  padding: 10px;

  ${({ theme }) => theme.breakpoints.for3TabletPortraitUp()`
    overflow: hidden;
  `}
`;

const DrumMachineControlsContainer = styled.div`
  display: grid;
  grid-template: repeat(2, 1fr) / 1fr;
  grid-template-areas:
    'drum-pads'
    'drum-controls';

  ${({ theme }) => theme.breakpoints.for3TabletPortraitUp()`
    grid-template: 1fr / 1fr 2fr;
    grid-template-areas:
      'drum-controls drum-pads';
  `}
`;

/* --------------------------- drum logic controls -------------------------- */

const DrumMachineLogicContainer = styled.div`
  grid-area: drum-controls;
  display: grid;
  grid-template: 1fr 0.5fr 1fr / 1fr;
  grid-template-areas:
    'drum-display'
    'drum-buttons'
    'drum-knobs';

  ${({ theme }) => theme.breakpoints.for3TabletPortraitUp()`
    grid-template: repeat(3, 1fr) / 1fr;
    grid-template-areas:
      'drum-knobs'
      'drum-display'
      'drum-buttons';
  `}
`;

const KnobContainer = styled.div`
  grid-area: drum-knobs;
  display: grid;
  grid-template: repeat(3, 1fr) / 1fr;

  & label {
    display: grid;
    grid-template: 1fr / 1fr 2fr;
    align-items: center;
  }

  & input {
    width: 90%;
  }

  /* knobs only display on larger screens */
  & .knob {
    display: none;
  }

  /* knobs only display if a pointing device is available */
  ${({ theme }) => theme.breakpoints.for3TabletPortraitUp()`
    @media (pointer: fine) {
      grid-template: 1fr / repeat(3, 1fr);
      & .knob { display: grid; }
    }
  `}
`;

const Display = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  & span {
    color: ${({ theme }) => theme.colors.primaryDark};
    background-color: #d9d9d9;
    width: 100%;
    padding: 20px;
  }
`;

const ButtonsContainer = styled.div`
  grid-area: drum-buttons;
  display: grid;
  grid-template: 1fr / repeat(3, 1fr);
  grid-gap: 10%;

  /* button container */
  & label {
    display: flex;
    flex-direction: column;
    height: 100%;

    & input {
      height: 35px;
    }
  }
`;

/* -------------------------------- drum pads ------------------------------- */

const DrumPadContainer = styled.div`
  grid-area: drum-pads;
  display: grid;
  grid-template: repeat(4, 1fr) / repeat(3, 1fr);
  grid-gap: 5px;

  ${({ theme }) => theme.breakpoints.for3TabletPortraitUp()`
    grid-template: repeat(3, 1fr) / repeat(4, 1fr);
  `}
`;

const DrumPad = styled.button`
  border-radius: 15px;
  padding: 0;
  border: none;
`;

/* -------------------------------------------------------------------------- */
/*                                    types                                   */
/* -------------------------------------------------------------------------- */

// type DataProps = {};

// type IndexPageProps = DataProps;

/* -------------------------------------------------------------------------- */
/*                                  component                                 */
/* -------------------------------------------------------------------------- */
const knobWithSettings = () => <Knob size={50} degrees={180} min={1} max={100} value={50} />;

const IndexPage = () => {
  const hasPointer = useMediaQuery(`(pointer: fine)`);

  return (
    <PageContainer>
      <DrumMachineContainer>
        <h1>Drum Machine</h1>
        <DrumMachineControlsContainer>
          <DrumMachineLogicContainer>
            <KnobContainer>
              {hasPointer ? (
                <>
                  {knobWithSettings()}
                  {knobWithSettings()}
                  {knobWithSettings()}
                </>
              ) : (
                <>
                  <label htmlFor="volumeKnob">
                    Volume
                    <input type="range" id="volumeKnob" min="1" max="100" />
                  </label>
                  <label htmlFor="pitchKnob">
                    Pitch
                    <input type="range" id="pitchKnob" min="1" max="100" />
                  </label>
                  <label htmlFor="panKnob">
                    Pan
                    <input type="range" id="panKnob" min="1" max="100" />
                  </label>
                </>
              )}
            </KnobContainer>
            <Display>
              <span>I&apos;m a screen.</span>
            </Display>
            <ButtonsContainer>
              <label htmlFor="PowerButton">
                <input id="PowerButton" type="button" />
                Power
              </label>
              <label htmlFor="BankButton">
                <input id="BankButton" type="button" />
                Bank
              </label>
              <label htmlFor="UnknownButton">
                <input id="UnknownButton" type="button" />
                Unknown
              </label>
            </ButtonsContainer>
          </DrumMachineLogicContainer>
          <DrumPadContainer>
            <DrumPad />
            <DrumPad />
            <DrumPad />
            <DrumPad />
            <DrumPad />
            <DrumPad />
            <DrumPad />
            <DrumPad />
            <DrumPad />
            <DrumPad />
            <DrumPad />
            <DrumPad />
          </DrumPadContainer>
        </DrumMachineControlsContainer>
      </DrumMachineContainer>
      <footer>
        Designed &amp; Coded by
        <a href="https://github.com/squibs"> Zachary Holman</a>
      </footer>
    </PageContainer>
  );
};

/* -------------------------------------------------------------------------- */
/*                      default props / queries / exports                     */
/* -------------------------------------------------------------------------- */

export default IndexPage;

// export const query = graphql``;

export const Head = () => <SEO title="Drum Machine" />;
