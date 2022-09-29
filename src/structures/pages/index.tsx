import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Knob, SEO } from '../components';
import { useMediaQuery } from '../hooks';
import { dk1Cymbal1, dk1Cymbal2, dk1Cymbal3, dk1Hihat1, dk1Hihat2, dk1HihatOpen, dk1LowTom, dk1MidTom, dk1HighTom, dk1Kick1, dk1Kick2, dk1Snare1, dk1Snare2, dk1SideStick1, dk1SideStick2, dk1Ride } from '../../media/sounds/drum-kit-1'; // prettier-ignore
import { dk2Cymbal1, dk2Cymbal2, dk2Cymbal3, dk2Hihat1, dk2Hihat2, dk2HihatOpen, dk2LowTom, dk2MidTom, dk2HighTom, dk2Kick1, dk2Kick2, dk2Snare1, dk2Snare2, dk2SideStick1, dk2SideStick2, dk2Ride } from '../../media/sounds/drum-kit-2'; // prettier-ignore

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
  overflow-y: auto;
  padding: 10px;
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
    padding: 50px;
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
    padding-right: 50px;
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
      align-items: center;
      justify-items: center;

      & .knob { display: flex; }
      & label {
        grid-template: 2fr 1fr / 1fr;
      }
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

  ${({ theme }) => theme.breakpoints.for3TabletPortraitUp()`
    & span {
      padding: 50px;
    }
  `}
`;

const ButtonsContainer = styled.div`
  grid-area: drum-buttons;
  display: grid;
  grid-template: 1fr / 1fr 1fr;
  grid-gap: 10%;

  /* button container */
  & label {
    display: grid;
    align-items: center;

    /* power / bank buttons */
    & input {
      height: 35px;
      width: 100%;
    }
  }

  ${({ theme }) => theme.breakpoints.for3TabletPortraitUp()`
    & label {
      align-self: start;
      margin: auto 0;

      & input {
        height: 75px;
        margin-bottom: 10px;
      }
    }
  `}
`;

/* -------------------------------- drum pads ------------------------------- */

const DrumPadContainer = styled.div`
  grid-area: drum-pads;
  display: grid;
  grid-template: repeat(4, 1fr) / repeat(3, 1fr);
  grid-gap: 5px;

  ${({ theme }) => theme.breakpoints.for3TabletPortraitUp()`
    grid-template: repeat(3, 1fr) / repeat(4, 1fr);
    grid-gap: 2%;
  `}
`;

const DrumPad = styled.button`
  border-radius: 15px;
  padding: 0;
  border: none;

  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

/* -------------------------------------------------------------------------- */
/*                                    types                                   */
/* -------------------------------------------------------------------------- */

// type DataProps = {};

// type IndexPageProps = DataProps;

/* -------------------------------------------------------------------------- */
/*                                  component                                 */
/* -------------------------------------------------------------------------- */
const IndexPage = () => {
  const hasPointer = useMediaQuery(`(pointer: fine)`);
  const screenIs4k = useMediaQuery(`screen and (min-width: 3500px)`);
  const screenIs1440p = useMediaQuery(`screen and (min-width: 2200px)`);
  const screenIs1080p = useMediaQuery(`screen and (min-width: 1800px)`);
  const screenIs720p = useMediaQuery(`screen and (min-width: 1200px)`);
  const screenIs480p = useMediaQuery(`screen and (min-width: 800px)`);

  let knobSize: number;

  switch (useMediaQuery(`screen`)) {
    case screenIs4k:
      knobSize = 200;
      break;
    case screenIs1440p:
      knobSize = 125;
      break;
    case screenIs1080p:
      knobSize = 100;
      break;
    case screenIs720p:
      knobSize = 50;
      break;
    case screenIs480p:
      knobSize = 25;
      break;
    default:
      knobSize = 80;
  }

  const accessKeys = ['q', 'w', 'e', 'r', 'a', 's', 'd', 'f', 'z', 'x', 'c', 'v'];

  // plays correct sound depending on which drum pad was pressed
  const handleButtonClick = (event: React.MouseEvent | KeyboardEvent) => {
    const mouseEvent = event as React.MouseEvent;
    const keyboardEvent = event as KeyboardEvent;

    if (keyboardEvent.key) {
      accessKeys.forEach((key) => {
        if (key === keyboardEvent.key) {
          // play sound assigned to accesskey

          const audio = new Audio(dk1Cymbal1);
          audio.play();
        }
      });
    } else {
      const target = mouseEvent.target as HTMLButtonElement;
      const pressedButton = target.id.slice(-1).toLowerCase();

      accessKeys.forEach((key) => {
        if (key === pressedButton) {
          // play sound assigned to accesskey

          const audio = new Audio(dk2Cymbal1);
          audio.play();
        }
      });
    }
  };

  // helps render out multiple knobs or sliders depending on screen size (determined in 'render()')
  const knobRenderHelper = (type: string, id: string, text: string) => {
    const knobWithSettings = (size: number) => (
      <Knob key={id} id={id} size={size} degrees={182} min={1} max={100} value={50} />
    );

    return (
      <label htmlFor={id}>
        {type === 'knob' ? (
          <>
            {knobWithSettings(knobSize || 100)}
            {text}
          </>
        ) : (
          <>
            {text}
            <input type="range" id={id} min="1" max="100" />
          </>
        )}
      </label>
    );
  };

  // helps render out multiple drum pads
  const renderDrumPads = (amount: number) => {
    const drumPads = [];

    for (let i = 0; i < amount; i += 1) {
      drumPads.push(
        <DrumPad
          key={`drumKey${accessKeys[i].toUpperCase()}`}
          id={`drumKey${accessKeys[i].toUpperCase()}`}
          onClick={handleButtonClick}
        />,
      );
    }

    return drumPads;
  };

  // listen for keyboard presses
  useEffect(() => {
    document.addEventListener('keydown', handleButtonClick);
  });

  return (
    <PageContainer>
      <DrumMachineContainer>
        <h1>Drum Machine</h1>
        <DrumMachineControlsContainer>
          <DrumMachineLogicContainer>
            <KnobContainer>
              {hasPointer ? (
                <>
                  {knobRenderHelper('knob', 'volumeKnob', 'Volume')}
                  {knobRenderHelper('knob', 'pitchKnob', 'Pitch')}
                  {knobRenderHelper('knob', 'panKnob', 'Pan')}
                </>
              ) : (
                <>
                  {knobRenderHelper('slider', 'volumeKnob', 'Volume')}
                  {knobRenderHelper('slider', 'pitchKnob', 'Pitch')}
                  {knobRenderHelper('slider', 'panKnob', 'Pan')}
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
            </ButtonsContainer>
          </DrumMachineLogicContainer>
          <DrumPadContainer>{renderDrumPads(12)}</DrumPadContainer>
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
