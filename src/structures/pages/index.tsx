import React, { useCallback, useEffect, useState } from 'react';
import { graphql } from 'gatsby';
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

type DataProps = {
  data: {
    dk1: {
      nodes: [
        {
          id: string;
          name: string;
          publicURL: string;
        },
      ];
    };

    dk2: {
      nodes: [
        {
          id: string;
          name: string;
          publicURL: string;
        },
      ];
    };
  };
};

type IndexPageProps = DataProps;

/* -------------------------------------------------------------------------- */
/*                                  component                                 */
/* -------------------------------------------------------------------------- */
const accessKeys = ['q', 'w', 'e', 'r', 'a', 's', 'd', 'f', 'z', 'x', 'c', 'v'];

const IndexPage = ({ data: { dk1, dk2 } }: IndexPageProps) => {
  const [powerState, setPowerState] = useState(false);
  const [soundBankState, setSoundBankState] = useState(false); // false = dk1, true = dk2
  const [drumKitOne, setDrumKitOne] = useState<string[]>([]);
  const [drumKitTwo, setDrumKitTwo] = useState<string[]>([]);

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

  const getAudioForDrumPad = useCallback(
    (pressedDrumPad: string) => {
      console.log(pressedDrumPad);
      accessKeys.forEach((key, index) => {
        if (key === pressedDrumPad) {
          if (soundBankState === false) {
            const audio = new Audio(drumKitOne[index]);
            audio.play();
          }

          if (soundBankState === true) {
            const audio = new Audio(drumKitTwo[index]);
            audio.play();
          }
        }

        return null;
      });
    },
    [drumKitOne, drumKitTwo, soundBankState],
  );

  // handle mouse inputs
  const handleMouseClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLButtonElement;
    const pressedPadButton = target.id.slice(-1).toLowerCase();

    // if power is pressed
    if (target.id === 'PowerButton') {
      setPowerState(!powerState);
    }

    // everything only works if power is on
    if (powerState === true) {
      if (target.id === 'BankButton') {
        setSoundBankState(!soundBankState);
      } else {
        getAudioForDrumPad(pressedPadButton);

        // accessKeys.forEach((key, index) => {
        //   if (key === pressedPadButton) {
        //     if (soundBankState === false) {
        //       const audio = new Audio(drumKitOne[index]);
        //       audio.play();
        //     }

        //     if (soundBankState === true) {
        //       const audio = new Audio(drumKitTwo[index]);
        //       audio.play();
        //     }
        //   }
        // });
      }
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
          onClick={handleMouseClick}
        />,
      );
    }

    return drumPads;
  };

  // setup drumkits
  useEffect(() => {
    const drumKitOrder = [ "lowtom", "midtom", "hightom", "cymbal1", "hihat1", "hihat-open", "hihat2", "ride", "sidestick1", "snare1", "snare2", "sidestick2", "cymbal2", "kick1", "kick2", "cymbal3", ]; // prettier-ignore
    const drumKit1: string[] = [];
    const drumKit2: string[] = [];

    for (let i = 0; i < drumKitOrder.length; i += 1) {
      const currentSelector = drumKitOrder[i];

      dk1.nodes.forEach((node, index) => {
        if (node.name === currentSelector) {
          drumKit1.push(dk1.nodes[index].publicURL);
        }
      });

      dk2.nodes.forEach((node, index) => {
        if (node.name === currentSelector) {
          drumKit2.push(dk2.nodes[index].publicURL);
        }
      });
    }

    setDrumKitOne(drumKit1);
    setDrumKitTwo(drumKit2);
  }, [dk1.nodes, dk2.nodes]);

  // listen for keyboard presses
  useEffect(() => {
    // handle keyboard inputs
    const handleKeyboardButton = (event: KeyboardEvent) => {
      // console.log(event);

      if (event.key === 'p') {
        setPowerState(!powerState);
      }

      console.log(powerState);

      // other buttons only work if power is on
      if (powerState === true) {
        if (event.key === 'b') {
          setSoundBankState(!soundBankState);
        } else {
          getAudioForDrumPad(event.key);
        }
      }
    };

    document.addEventListener('keydown', handleKeyboardButton);

    return () => {
      document.removeEventListener('keydown', handleKeyboardButton);
    };
  }, [getAudioForDrumPad, powerState, soundBankState]);

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
                <input id="PowerButton" type="button" onClick={handleMouseClick} />
                Power
              </label>
              <label htmlFor="BankButton">
                <input id="BankButton" type="button" onClick={handleMouseClick} />
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

export const query = graphql`
  query {
    dk1: allFile(filter: { relativeDirectory: { eq: "drum-kit-1" }, extension: { eq: "wav" } }) {
      nodes {
        id
        name
        publicURL
      }
    }

    dk2: allFile(filter: { relativeDirectory: { eq: "drum-kit-2" }, extension: { eq: "wav" } }) {
      nodes {
        id
        name
        publicURL
      }
    }
  }
`;

export const Head = () => <SEO title="Drum Machine" />;
