import React from 'react';
import styled from 'styled-components';
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
`;

/* -------------------------------------------------------------------------- */
/*                                    types                                   */
/* -------------------------------------------------------------------------- */

// type DataProps = {};

// type IndexPageProps = DataProps;

/* -------------------------------------------------------------------------- */
/*                                  component                                 */
/* -------------------------------------------------------------------------- */
const accessKeys = ['q', 'w', 'e', 'r', 'a', 's', 'd', 'f', 'z', 'x', 'c', 'v'];

const handleButtonClick = (event: React.MouseEvent | React.KeyboardEvent) => {
  const mouseEvent = event as React.MouseEvent;
  const keyboardEvent = event as React.KeyboardEvent;

  if (keyboardEvent.key) {
    accessKeys.forEach((key) => {
      if (key === keyboardEvent.key) {
        // play sound assigned to accesskey
      }
    });
  } else {
    const target = mouseEvent.target as HTMLButtonElement;
    const pressedButton = target.id.slice(-1).toLowerCase();

    accessKeys.forEach((key) => {
      if (key === pressedButton) {
        // play sound assigned to accesskey
      }
    });
  }
};

const renderDrumPads = (amount: number) => {
  const drumPads = [];

  for (let i = 0; i < amount; i += 1) {
    // eslint-disable-next-line jsx-a11y/no-access-key
    drumPads.push(
      <DrumPad
        id={`drumKey${accessKeys[i].toUpperCase()}`}
        onKeyDown={handleButtonClick}
        onClick={handleButtonClick}
      />,
    );
  }

  return drumPads;
};

const knobWithSettings = (id: string, size: number) => (
  <Knob id={id} size={size} degrees={182} min={1} max={100} value={50} />
);

const knobRenderHelper = (type: string, id: string, text: string, knobSize?: number) => {
  return (
    <label htmlFor={id}>
      {type === 'knob' ? (
        <>
          {knobWithSettings(id, knobSize || 100)}
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

const IndexPage = () => {
  const hasPointer = useMediaQuery(`(pointer: fine)`);
  const screenIs4k = useMediaQuery(`screen and (min-width: 3500px)`);
  const screenIs1440p = useMediaQuery(`screen and (min-width: 2200px)`);
  let knobSize;

  if (screenIs4k) {
    knobSize = 200;
  } else if (screenIs1440p) {
    knobSize = 125;
  } else {
    knobSize = 100;
  }

  return (
    <PageContainer>
      <DrumMachineContainer>
        <h1>Drum Machine</h1>
        <DrumMachineControlsContainer>
          <DrumMachineLogicContainer>
            <KnobContainer>
              {hasPointer ? (
                <>
                  {knobRenderHelper('knob', 'volumeKnob', 'Volume', knobSize)}
                  {knobRenderHelper('knob', 'pitchKnob', 'Pitch', knobSize)}
                  {knobRenderHelper('knob', 'panKnob', 'Pan', knobSize)}
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
