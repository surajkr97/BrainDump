import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  notes: localStorage.getItem('notes')
    ? JSON.parse(localStorage.getItem('notes'))
    : [],
}

export const noteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    addToNotes: (state, action) => {
    
    },
    updateToNotes: (state, action) => {
    
    },
    resetAllNotes: (state, action) => {
    
    },
    removeFromNotes: (state, action) => {

    }
  },
})

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = noteSlice.actions

export default noteSlice.reducer