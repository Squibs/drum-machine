import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type KnobState = {
  volumeKnob: number;
  pitchKnob: number;
  panKnob: number;
};

const initialState: KnobState = {
  volumeKnob: 50,
  pitchKnob: 50,
  panKnob: 50,
};

export const knobSlice = createSlice({
  name: 'knobs',
  initialState,
  reducers: {
    adjustVolume: (state, action: PayloadAction<number>) => {
      state.volumeKnob = action.payload;
    },
    adjustPitch: (state, action: PayloadAction<number>) => {
      state.pitchKnob = action.payload;
    },
    adjustPan: (state, action: PayloadAction<number>) => {
      state.panKnob = action.payload;
    },
  },
});

export const { adjustVolume, adjustPitch, adjustPan } = knobSlice.actions;

export default knobSlice.reducer;
