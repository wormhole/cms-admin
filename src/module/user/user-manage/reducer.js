const initState = {
    selectedRowKeys: [],
    keyValue: null,
    params: {
        key: null,
        sort: null,
        order: null,
        roleIds: []
    },
    pagination: {current: 1, pageSize: 10},
    dataSource: [],
    loading: false,
    transferShow: false
};

const userManageReducer = (state = initState, action) => {

    if (action.type === 'user-manage') {
        return {
            ...state,
            ...action.state,
        };
    } else {
        return state;
    }
};

export default userManageReducer;
