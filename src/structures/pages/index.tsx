import React, { useCallback, useEffect, useState } from 'react';
import { graphql } from 'gatsby';
import styled from 'styled-components';
import { Howl } from 'howler';
import { Knob, SEO } from '../components';
import { useDetectiOS, useMediaQuery } from '../hooks';

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

const IOSWarning = styled.div`
  position: absolute;
  background-color: rgba(0, 0, 0, 0.85);
  width: 100%;
  height: 100%;
  padding: 20px;
  display: grid;
  align-items: end;
  justify-items: center;
  grid-template: 1fr 1fr / 1fr;

  & button {
    margin-top: 15px;
    align-self: start;
    background: none;
    border: none;
    text-decoration: underline;
    font-size: 28px;
    color: ${({ theme }) => theme.colors.accentTwo};
    text-underline-offset: 3px;
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
  overflow-x: hidden;
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
    hDk1Src1: {
      nodes: [
        {
          publicURL: string;
        },
      ];
    };

    hDk1Src2: {
      nodes: [
        {
          publicURL: string;
        },
      ];
    };

    hDk2Src1: {
      nodes: [
        {
          publicURL: string;
        },
      ];
    };

    hDk2Src2: {
      nodes: [
        {
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
const accessKeys = [
  { button: 'q', audio: 'tom1' },
  { button: 'w', audio: 'tom2' },
  { button: 'e', audio: 'cymbal1' },
  { button: 'r', audio: 'cymbal2' },
  { button: 'a', audio: 'hihat' },
  { button: 's', audio: 'hihatopen' },
  { button: 'd', audio: 'ride' },
  { button: 'f', audio: 'sidestick' },
  { button: 'z', audio: 'snare1' },
  { button: 'x', audio: 'snare2' },
  { button: 'c', audio: 'kick1' },
  { button: 'v', audio: 'kick2' },
];

const IndexPage = ({ data }: IndexPageProps) => {
  const hDk1Src1 = data.hDk1Src1.nodes[0].publicURL;
  const hDk1Src2 = data.hDk1Src2.nodes[0].publicURL;
  const hDk2Src1 = data.hDk2Src1.nodes[0].publicURL;
  const hDk2Src2 = data.hDk2Src2.nodes[0].publicURL;

  const [powerState, setPowerState] = useState(false);
  const [soundBankState, setSoundBankState] = useState(false); // false = dk1, true = dk2
  const [drumKitOne, setDrumKitOne] = useState<Howl>();
  const [drumKitTwo, setDrumKitTwo] = useState<Howl>();

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

  /* ----------------------------- control helpers ---------------------------- */

  // play correct audio for drum pad press
  const playAudioForDrumPad = useCallback(
    (pressedDrumPad: string) => {
      accessKeys.forEach((key, index) => {
        if (key.button === pressedDrumPad) {
          // drum kit 1 sounds
          if (soundBankState === false) {
            if (drumKitOne) {
              drumKitOne.play(`${accessKeys[index].audio}`);
            }
          }

          // drum kit 2 sounds
          if (soundBankState === true) {
            if (drumKitTwo) {
              drumKitTwo.play(`${accessKeys[index].audio}`);
            }
          }
        }

        return null;
      });
    },
    [drumKitOne, drumKitTwo, soundBankState],
  );

  // change drum pad button color when pressed
  const buttonActivated = (pressedDrumPad: string) => {
    const el = document.getElementById(`drumKey${pressedDrumPad.toUpperCase()}`);
    el?.classList.add('activated');

    const delay = (ms: number) => {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    };

    const removeActivated = async () => {
      await delay(200);
      el?.classList.remove('activated');
    };

    removeActivated();
  };

  // setup drumkits. Has to be after a button press otherwise iOS gets real mad
  const setupDrumKits = useCallback(() => {
    const drumSamples1 = new Howl({
      src: [hDk1Src1, hDk1Src2],
      sprite: {
        cymbal1: [0, 786.5079365079365],
        cymbal2: [2000, 121.08843537414948],
        hihat: [4000, 89.79591836734713],
        hihatopen: [6000, 327.52834467120186],
        kick1: [8000, 102.13151927437636],
        kick2: [10000, 118.2086167800449],
        ride: [12000, 787.5963718820866],
        sidestick: [14000, 106.8934240362811],
        snare1: [16000, 162.2222222222227],
        snare2: [18000, 317.7324263038557],
        tom1: [20000, 284.37641723355966],
        tom2: [22000, 266.0544217687075],
      },
    });

    const drumSamples2 = new Howl({
      src: [hDk2Src1, hDk2Src2],
      sprite: {
        cymbal1: [0, 150.22675736961452],
        cymbal2: [2000, 133.5827664399094],
        hihat: [4000, 50.20408163265344],
        hihatopen: [6000, 150.45351473922875],
        kick1: [8000, 154.30839002267584],
        kick2: [10000, 150.27210884353792],
        ride: [12000, 316.89342403628194],
        sidestick: [14000, 17.120181405894996],
        snare1: [16000, 103.94557823129347],
        snare2: [18000, 146.12244897959314],
        tom1: [20000, 83.53741496598488],
        tom2: [22000, 162.69841269841123],
      },
    });

    setDrumKitOne(drumSamples1);
    setDrumKitTwo(drumSamples2);
  }, [hDk1Src1, hDk1Src2, hDk2Src1, hDk2Src2]);

  /* ----------------------------- handle inputs ------------------------------ */

  // handle mouse inputs
  const handleMouseClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLButtonElement;
    const pressedPadButton = target.id.slice(-1).toLowerCase();

    // if power is pressed
    if (target.id === 'PowerButton') {
      setPowerState(!powerState);

      if (!drumKitOne && !drumKitTwo) {
        setupDrumKits();
      }
    }

    // everything only works if power is on
    if (powerState === true) {
      if (target.id === 'BankButton') {
        setSoundBankState(!soundBankState);
      } else {
        playAudioForDrumPad(pressedPadButton);
        buttonActivated(pressedPadButton);
      }
    }
  };

  // handle keyboard inputs
  useEffect(() => {
    const handleKeyboardButton = (event: KeyboardEvent) => {
      // if power is pressed
      if (event.key === 'p') {
        setPowerState(!powerState);

        if (!drumKitOne && !drumKitTwo) {
          setupDrumKits();
        }
      }

      // other buttons only work if power is on
      if (powerState === true) {
        if (event.key === 'b') {
          setSoundBankState(!soundBankState);
        } else {
          playAudioForDrumPad(event.key);
          buttonActivated(event.key);
        }
      }
    };

    document.addEventListener('keydown', handleKeyboardButton);

    return () => {
      document.removeEventListener('keydown', handleKeyboardButton);
    };
  }, [drumKitOne, drumKitTwo, playAudioForDrumPad, powerState, setupDrumKits, soundBankState]);

  /* ----------------------------- render helpers ----------------------------- */

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
          key={`drumKey${accessKeys[i].button.toUpperCase()}`}
          id={`drumKey${accessKeys[i].button.toUpperCase()}`}
          onPointerDown={handleMouseClick}
        />,
      );
    }

    return drumPads;
  };

  return (
    <PageContainer>
      {useDetectiOS() ? (
        <IOSWarning>
          <p>
            Make sure your device, mainly iOS users, is not on silent mode. Thank you for visiting!
          </p>
          <button
            type="button"
            onClick={(event: React.MouseEvent) => {
              const target = event.target as HTMLButtonElement;
              target.parentElement?.remove();
            }}
          >
            Close This
          </button>
        </IOSWarning>
      ) : null}
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
                <input id="PowerButton" type="button" onPointerDown={handleMouseClick} />
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
    hDk1Src1: allFile(
      filter: {
        relativeDirectory: { eq: "drum-kit-1" }
        name: { eq: "samples" }
        ext: { eq: ".webm" }
      }
    ) {
      nodes {
        publicURL
      }
    }

    hDk1Src2: allFile(
      filter: {
        relativeDirectory: { eq: "drum-kit-1" }
        name: { eq: "samples" }
        ext: { eq: ".wav" }
      }
    ) {
      nodes {
        publicURL
      }
    }

    hDk2Src1: allFile(
      filter: {
        relativeDirectory: { eq: "drum-kit-2" }
        name: { eq: "samples" }
        ext: { eq: ".webm" }
      }
    ) {
      nodes {
        publicURL
      }
    }

    hDk2Src2: allFile(
      filter: {
        relativeDirectory: { eq: "drum-kit-2" }
        name: { eq: "samples" }
        ext: { eq: ".wav" }
      }
    ) {
      nodes {
        publicURL
      }
    }
  }
`;

export const Head = () => <SEO title="Drum Machine" />;
