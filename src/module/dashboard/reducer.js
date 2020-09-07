const initState = {
    count: {
        file: 0,
        menu: 0,
        user: 0,
        role: 0
    }
};

const dashboardReducer = (state = initState, action) => {

    if (action.type === "dashboard") {
        return {
            ...state,
            ...action.state,
        };
    } else {
        return state;
    }
};

export default dashboardReducer;