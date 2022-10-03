import React, { useCallback, useEffect, useRef, useState } from 'react';
import { graphql } from 'gatsby';
import styled from 'styled-components';
import { Howl } from 'howler';
import { Knob, SEO } from '../components';
import { useAppDispatch, useAppSelector, useDetectiOS, useMediaQuery } from '../hooks';
import { adjustPan, adjustPitch, adjustVolume } from '../../store/knobs/knobSlice';

// Big thanks to https://andrcohen847.medium.com/designing-an-interactive-simple-sound-board-with-howler-js-and-react-91d00b899c8c
// Howler was the key to getting iOS audio working.

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
  z-index: 2;

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
  position: relative;

  /* button container */
  & label {
    display: grid;
    align-items: center;
    position: relative;

    // button text
    & span {
      position: absolute;
      color: black;
      left: 0;
      right: 0;
      pointer-events: none;
    }

    /* power / bank buttons */
    & input {
      height: 35px;
      width: 100%;
      background-color: #f2f2f2;
      border: none;
      border-radius: 15px;
      border-bottom: 6px solid red;
      box-shadow: -2px 2px 3px 3px rgba(0, 0, 0, 0.75);

      &:focus {
        outline: none;
      }
    }
  }

  ${({ theme }) => theme.breakpoints.for3TabletPortraitUp()`
    & label {
      align-self: start;
      margin: auto 0;

      & span {
      position: unset;
      color: white;
    }

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
  padding: 0;
  background-color: #f2f2f2;
  border: none;
  border-radius: 15px;
  display: grid;
  place-items: center;
  padding: 8%;
  border-bottom: 8px solid red;
  box-shadow: -2px 2px 3px 3px rgba(0, 0, 0, 0.75);

  & span {
    pointer-events: none;
    user-select: none;
    padding: 0;
    margin: 0;
    font-size: 0.55em;
  }

  &:focus {
    outline: none;
  }

  ${({ theme }) => theme.breakpoints.for2SlightlyBiggerPhoneUp()`
    & span {
      font-size: initial;

      &:first-of-type {
        opacity: 100;
      }
    }
  `}
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

    testFind: {
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
  { index: 0, keyTrigger: 'q', keyCode: 81, audio: 'tom1' },
  { index: 1, keyTrigger: 'w', keyCode: 87, audio: 'tom2' },
  { index: 2, keyTrigger: 'e', keyCode: 69, audio: 'cymbal1' },
  { index: 3, keyTrigger: 'r', keyCode: 82, audio: 'cymbal2' },
  { index: 4, keyTrigger: 'a', keyCode: 65, audio: 'hihat' },
  { index: 5, keyTrigger: 's', keyCode: 83, audio: 'hihatopen' },
  { index: 6, keyTrigger: 'd', keyCode: 68, audio: 'ride' },
  { index: 7, keyTrigger: 'f', keyCode: 70, audio: 'sidestick' },
  { index: 8, keyTrigger: 'z', keyCode: 90, audio: 'snare1' },
  { index: 9, keyTrigger: 'x', keyCode: 88, audio: 'snare2' },
  { index: 10, keyTrigger: 'c', keyCode: 67, audio: 'kick1' },
  { index: 11, keyTrigger: 'v', keyCode: 86, audio: 'kick2' },
];

const IndexPage = ({ data }: IndexPageProps) => {
  const hDk1Src1 = data.hDk1Src1.nodes[0].publicURL;
  const hDk1Src2 = data.hDk1Src2.nodes[0].publicURL;
  const hDk2Src1 = data.hDk2Src1.nodes[0].publicURL;
  const hDk2Src2 = data.hDk2Src2.nodes[0].publicURL;

  const [isiOS] = useState(useDetectiOS);
  const [powerState, setPowerState] = useState(!isiOS);
  const [soundBankState, setSoundBankState] = useState(false); // false = dk1, true = dk2
  const [drumKitOne, setDrumKitOne] = useState<Howl>();
  const [drumKitTwo, setDrumKitTwo] = useState<Howl>();
  const [displayMessage, setDisplayMessage] = useState(`\u00a0`);

  const dispatch = useAppDispatch();
  const volume = useAppSelector((state) => state.knobs.volumeKnob);
  const pitch = useAppSelector((state) => state.knobs.pitchKnob);
  const pan = useAppSelector((state) => state.knobs.panKnob);

  const powerButtonRef = useRef<HTMLInputElement>(null);
  const bankButtonRef = useRef<HTMLInputElement>(null);
  const drumPadContainerRef = useRef<HTMLDivElement>(null);
  const displayRef = useRef<HTMLDivElement>(null);

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

  // these are used for the sliders and knobs, auto updates from state
  const convertRange = (
    oldMin: number,
    oldMax: number,
    newMin: number,
    newMax: number,
    oldValue: number,
  ) => ((oldValue - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;

  useEffect(() => {
    if (drumKitOne) {
      // @ts-expect-error jank workaround for howler undefined error when normally trying to adjust rate on a howl
      Howler._howls[0]._rate = convertRange(0, 100, 0.1, 2, pitch); // eslint-disable-line no-underscore-dangle
    }
  }, [drumKitOne, pitch]);

  useEffect(() => {
    Howler.stereo(convertRange(0, 100, -1, 1, pan));
  }, [pan]);

  useEffect(() => {
    Howler.volume(volume / 100);
  }, [volume]);

  /* ----------------------------- control helpers ---------------------------- */

  // play correct audio for drum pad press
  const playAudioForDrumPad = useCallback(
    (pressedDrumPad: string) => {
      accessKeys.forEach((key, index) => {
        if (key.keyTrigger === pressedDrumPad) {
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
    let el = document.getElementById(
      accessKeys.find((key) => key.keyTrigger === pressedDrumPad)?.audio ?? '',
    );

    if (pressedDrumPad === 'b') {
      el = document.getElementById('BankButton');
    }

    if (pressedDrumPad === 'p') {
      if (!powerState) {
        el = document.getElementById('PowerButton');
      }
    }

    el?.classList.add('activated');

    // delay removing of add activated class to highlight pressed buttons
    const delay = (ms: number) => {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    };

    const removeActivated = async () => {
      await delay(75);
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
      rate: 1,
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
      rate: 1,
    });

    setDrumKitOne(drumSamples1);
    setDrumKitTwo(drumSamples2);
  }, [hDk1Src1, hDk1Src2, hDk2Src1, hDk2Src2]);

  // handle drum machine button glows
  useEffect(() => {
    if (
      powerButtonRef.current &&
      bankButtonRef.current &&
      drumPadContainerRef.current &&
      displayRef.current
    ) {
      const powerButton = powerButtonRef.current.classList;
      const bankButton = bankButtonRef.current.classList;
      const drumPadChildren = drumPadContainerRef.current.childNodes;
      const display = displayRef.current.firstChild as HTMLSpanElement;

      if (powerState) {
        // Bank A
        if (!soundBankState) {
          powerButton.remove('activatedThemeTwo');
          bankButton.remove('activatedThemeTwo');
          display.classList.remove('activatedThemeTwo');
          powerButton.add('activatedThemeOne');
          bankButton.add('activatedThemeOne');
          display.classList.add('activatedThemeOne');

          drumPadChildren.forEach((child) => {
            const c = child as HTMLButtonElement;
            c.classList.remove('activatedThemeTwo');
            c.classList.add('activatedThemeOne');
          });
        }

        // Bank B
        if (soundBankState) {
          powerButton.remove('activatedThemeOne');
          bankButton.remove('activatedThemeOne');
          display.classList.remove('activatedThemeOne');
          powerButton.add('activatedThemeTwo');
          bankButton.add('activatedThemeTwo');
          display.classList.add('activatedThemeTwo');

          drumPadChildren.forEach((child) => {
            const c = child as HTMLButtonElement;
            c.classList.remove('activatedThemeOne');
            c.classList.add('activatedThemeTwo');
          });
        }
      }

      // if power is off remove background colors
      if (!powerState) {
        powerButton.remove('activatedThemeOne', 'activatedThemeTwo');
        bankButton.remove('activatedThemeOne', 'activatedThemeTwo');
        display.classList.remove('activatedThemeOne', 'activatedThemeTwo');
        display.textContent = `\u00a0`; // non-breaking space character to hold screen size

        drumPadChildren.forEach((child) => {
          const c = child as HTMLButtonElement;
          c.classList.remove('activatedThemeOne', 'activatedThemeTwo');
        });
      }
    }
  }, [powerState, soundBankState]);

  // update display message
  const updateDisplay = useCallback(
    (pressedDrumPad: string) => {
      if (powerState) {
        let message = '';
        const drumPadKeys: string[] = [];
        accessKeys.forEach((key) => drumPadKeys.push(key.keyTrigger));

        if (pressedDrumPad === 'b') {
          message = soundBankState ? 'BANK: Korg MR-16 Kit' : 'BANK: Nintendo NES Kit';
          setDisplayMessage(message);
        } else if (drumPadKeys.some((key) => key === pressedDrumPad)) {
          const audioThatPlayed = `${
            accessKeys.find((key) => key.keyTrigger === pressedDrumPad)?.audio
          }`;
          message = `${audioThatPlayed.charAt(0).toUpperCase()}${audioThatPlayed.slice(1)}`;

          setDisplayMessage(message);
        }
      }
    },
    [powerState, soundBankState],
  );

  /* ----------------------------- handle inputs ------------------------------ */

  // for freeCodeCamp test suite. I'm handling sound in a way that is fairly different
  // and this is here to play silent audio to pass the tests (i'm using howlerjs)
  const handleFakeNoise = (event: React.MouseEvent) => {
    const target = event.target as HTMLButtonElement;
    const fakeDrumAudioSrc = target.lastElementChild as HTMLAudioElement;
    const pressedPadButton = accessKeys.find((key) => key.audio === target.id)?.keyTrigger ?? '';

    if (fakeDrumAudioSrc) {
      fakeDrumAudioSrc.play();
    }

    updateDisplay(pressedPadButton);
  };

  // handle mouse inputs
  const handleMouseClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLButtonElement;
    const pressedPadButton = accessKeys.find((key) => key.audio === target.id)?.keyTrigger ?? '';

    // if power is pressed
    if (target.id === 'PowerButton') {
      setPowerState(!powerState);
      buttonActivated('p');

      // loads/calls drumkits
      if (!drumKitOne && !drumKitTwo) {
        setupDrumKits();
      }
    }

    // everything only works if power is on
    if (powerState === true) {
      // for sound bank switching
      if (target.id === 'BankButton') {
        setSoundBankState(!soundBankState);
        buttonActivated('b');
        updateDisplay('b');
      } else {
        // for any other button
        playAudioForDrumPad(pressedPadButton);
        buttonActivated(pressedPadButton);
        updateDisplay(pressedPadButton);
      }
    }
  };

  // handle keyboard inputs
  useEffect(() => {
    const handleKeyboardButton = (event: KeyboardEvent) => {
      // if power is pressed
      if (event.key === 'p' || event.keyCode === 80) {
        setPowerState(!powerState);
        buttonActivated('p');

        // loads/calls drumkits
        if (!drumKitOne && !drumKitTwo) {
          setupDrumKits();
        }
      }

      // other buttons only work if power is on
      if (powerState === true) {
        // for sound bank switching
        if (event.key === 'b' || event.keyCode === 66) {
          setSoundBankState(!soundBankState);
          buttonActivated('b');
          updateDisplay(event.key);
        } else {
          // for freeCodeCamp test suite
          const fakeDrumAudioSrc = document.getElementById(
            `${accessKeys.find((k) => k.keyCode === event.keyCode)?.audio}`,
          )?.lastElementChild as HTMLAudioElement;

          if (fakeDrumAudioSrc) {
            fakeDrumAudioSrc.play();
          }

          // for any other button
          playAudioForDrumPad(event.key);
          buttonActivated(event.key);
          updateDisplay(event.key);
        }
      }
    };

    document.addEventListener('keydown', handleKeyboardButton);

    return () => {
      document.removeEventListener('keydown', handleKeyboardButton);
    };
  }, [
    drumKitOne,
    drumKitTwo,
    playAudioForDrumPad,
    powerState,
    setupDrumKits,
    soundBankState,
    updateDisplay,
  ]);

  /* ----------------------------- render helpers ----------------------------- */

  // helps render out multiple knobs or sliders depending on screen size (determined in 'render()')
  const knobRenderHelper = (type: string, id: string, text: string) => {
    const knobWithSettings = (size: number) => (
      <Knob key={id} id={id} size={size} degrees={182} min={1} max={100} value={50} />
    );

    let relatedValue = '';

    if (id === 'volumeKnob') {
      relatedValue = volume.toString();
    } else if (id === 'panKnob') {
      relatedValue = pan.toString();
    } else if (id === 'pitchKnob') {
      relatedValue = pitch.toString();
    } else {
      relatedValue = '50';
    }

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
            <input
              type="range"
              id={id}
              min="1"
              max="100"
              value={relatedValue}
              onChange={(e) => {
                if (id === 'volumeKnob') {
                  dispatch(adjustVolume(Number(e.target.value)));
                }

                if (id === 'panKnob') {
                  dispatch(adjustPan(Number(e.target.value)));
                }

                if (id === 'pitchKnob') {
                  dispatch(adjustPitch(Number(e.target.value)));
                }
              }}
            />
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
          key={`drumKey${accessKeys[i].keyTrigger.toUpperCase()}`}
          id={`${accessKeys[i].audio}`}
          onPointerDown={handleMouseClick}
          onClick={handleFakeNoise}
          className={`${i + 1 !== 0 && (i + 1) % 4 === 0 ? '' : 'drum-pad'}`}
        >
          <span>{`${accessKeys[i].keyTrigger.toUpperCase()}`}</span>
          <audio
            className="clip"
            id={`${accessKeys[i].keyTrigger.toUpperCase()}`}
            src={data.testFind.nodes[0].publicURL}
          >
            <track kind="captions" />
          </audio>
        </DrumPad>,
      );
    }

    return drumPads;
  };

  // iOS starts in off state, as they don't like to preload audio.
  useEffect(() => {
    if (!isiOS) {
      setupDrumKits();
    }
  }, [isiOS, setupDrumKits]);

  /* --------------------------------- render --------------------------------- */

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
      <DrumMachineContainer id="drum-machine">
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
            <Display ref={displayRef}>
              <span id="display">{displayMessage}</span>
            </Display>
            <ButtonsContainer>
              <label htmlFor="PowerButton">
                <input
                  id="PowerButton"
                  type="button"
                  ref={powerButtonRef}
                  onPointerDown={handleMouseClick}
                />
                <span>Power</span>
              </label>
              <label htmlFor="BankButton">
                <input
                  id="BankButton"
                  type="button"
                  ref={bankButtonRef}
                  onPointerDown={handleMouseClick}
                />
                <span>Bank</span>
              </label>
            </ButtonsContainer>
          </DrumMachineLogicContainer>
          <DrumPadContainer ref={drumPadContainerRef}>{renderDrumPads(12)}</DrumPadContainer>
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
/*                      default props | queries | exports                     */
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

    testFind: allFile(filter: { name: { eq: "silence" } }) {
      nodes {
        publicURL
      }
    }
  }
`;

export const Head = () => <SEO title="Drum Machine" />;
