import { csrfFetch } from "./csrf";
const LOAD_BOOKINGS = "bookings/LOAD";
// const LOAD_MY_BOOKING = "bookings/LOAD_MY_BOOKING";
const USER_BOOKINGS = "/bookings/userBookings";
const DELETE_BOOKING = "bookings/DELETE";

export const load = (bookings) => {
    return {
        type: LOAD_BOOKINGS,
        bookings,
    };
};

// const myBookings = (bookings) => ({
//     type: LOAD_MY_BOOKING,
//     bookings,
// });

const usersBookings = (bookings) => ({
    type: USER_BOOKINGS,
    bookings,
});

export const deleteBooking = (booking) => {
    return {
        type: DELETE_BOOKING,
        booking,
    };
};

export const getAllBookings = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/bookings`);

    if (response.ok) {
        const bookings = await response.json();
        dispatch(load(bookings));
        return bookings;
    }
};

// export const loadMyBooking = () => async (dispatch) => {
//     const response = await csrfFetch(`/api/bookings/current`);

//     if (response.ok) {
//         const myBookings = await response.json();
//         console.log(myBookings);
//         console.log("yo are we here~");
//         dispatch(load(myBookings.Spots));
//         return myBookings;
//     }
// };

export const getUserBookings = () => async (dispatch) => {
    const response = await csrfFetch(`/api/bookings/current`);

    if (response.ok) {
        const bookings = await response.json();
        dispatch(usersBookings(bookings));
        return bookings;
    }
};

export const deleteMyBooking = (bookingId) => async (dispatch) => {
    const response = await csrfFetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(deleteBooking(data));
    }
};

const initialState = { userBookings: {} };

const bookingReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case USER_BOOKINGS:
            // newState = { ...state, userBookings: {} };
            // action.bookings.Bookings.forEach((booking) => {
            //     newState.userBookings[booking.id] = booking;
            // });
            return action.bookings;

        case DELETE_BOOKING:
            newState = {
                ...state,
                allBookings: { ...state.allBookings },
                userBookings: { ...state.userBookings },
            };
            delete newState.allBookings[action.booking.id];
            delete newState.userBookings[action.booking.id];
            return newState;

        default:
            return state;
    }
};

export default bookingReducer;
