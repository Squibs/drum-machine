import React from 'react';
import styled from 'styled-components';

const SliderWithStyles = styled.input`
  width: 90%;
  margin: 12.7px 0;
  background-color: transparent;
  -webkit-appearance: none;

  &:focus {
    outline: none;
  }
  &::-webkit-slider-runnable-track {
    background: rgba(255, 0, 0, 0.9);
    border: 0.7px solid #562425;
    border-radius: 6.2px;
    width: 90%;
    height: 12.6px;
    cursor: pointer;
  }
  &::-webkit-slider-thumb {
    margin-top: -13.4px;
    width: 18px;
    height: 38px;
    background: #23ebdf;
    border: 2.2px solid #000000;
    border-radius: 12px;
    cursor: pointer;
    -webkit-appearance: none;
  }
  &:focus::-webkit-slider-runnable-track {
    background: #ff1a1a;
  }
  &::-moz-range-track {
    background: rgba(255, 0, 0, 0.9);
    border: 0.7px solid #562425;
    border-radius: 6.2px;
    width: 90%;
    height: 12.6px;
    cursor: pointer;
  }
  &::-moz-range-thumb {
    width: 18px;
    height: 38px;
    background: #23ebdf;
    border: 2.2px solid #000000;
    border-radius: 12px;
    cursor: pointer;
  }
  &::-ms-track {
    background: transparent;
    border-color: transparent;
    border-width: 12.7px 0;
    color: transparent;
    width: 90%;
    height: 12.6px;
    cursor: pointer;
  }
  &::-ms-fill-lower {
    background: #e60000;
    border: 0.7px solid #562425;
    border-radius: 12.4px;
  }
  &::-ms-fill-upper {
    background: rgba(255, 0, 0, 0.9);
    border: 0.7px solid #562425;
    border-radius: 12.4px;
  }
  &::-ms-thumb {
    width: 18px;
    height: 38px;
    background: #23ebdf;
    border: 2.2px solid #000000;
    border-radius: 12px;
    cursor: pointer;
    margin-top: 0px;
    /*Needed to keep the Edge thumb centred*/
  }
  &:focus::-ms-fill-lower {
    background: rgba(255, 0, 0, 0.9);
  }
  &:focus::-ms-fill-upper {
    background: #ff1a1a;
  }
  /*TODO: Use one of the selectors from https://stackoverflow.com/a/20541859/7077589 and figure out
how to remove the virtical space around the range input in IE*/
  @supports (-ms-ime-align: auto) {
    /* Pre-Chromium Edge only styles, selector taken from hhttps://stackoverflow.com/a/32202953/7077589 */
    & {
      margin: 0;
      /*Edge starts the margin from the thumb, not the track as other browsers do*/
    }
  }
`;

type SliderProps = {
  id: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
};

const Slider = ({ id, value, onChange }: SliderProps) => {
  return (
    <SliderWithStyles type="range" id={id} min="1" max="100" value={value} onChange={onChange} />
  );
};

export default Slider;
