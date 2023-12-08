import { createSlice} from '@reduxjs/toolkit';

const notificationSlice = createSlice({
    name: 'notification',
    initialState: {
        notification: false,
        notificationColor: "neutral",
        notificationMessage: ""
    },
    reducers: {
        notificationStateChange: (state,action) => {
            state.notification = action.payload.notification;
            state.notificationColor = action.payload.notificationColor;
            state.notificationMessage = action.payload.notificationMessage;
        },
    },

});

export const {notificationStateChange} = notificationSlice.actions;

export default notificationSlice.reducer;