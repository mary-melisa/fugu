export default {
    state: {
        accountInfo: {}, // 账户信息
        urlPrev: '',
        cateenInfo: {},
    },
    getters: {
        getAccountInfo: state => {
            return state.accountInfo;
        },
        getUrlPrev: state => {
            return state.urlPrev;
        },
        getCateenInfo: state => {
            return state.cateenInfo;
        },
    },
    mutations: {
        setAccountInfo: (state, value) => {
            state.accountInfo = value;
        },
        setUrlPrev: (state, value) => {
            state.urlPrev = value;
        },
        setCateenInfo: (state, value) => {
            state.cateenInfo = value;
        },
    },
    actions: {
        commitAccountInfo: ({ commit }, payload) => {
            commit('setAccountInfo', payload);
        },
        commitUrlPrev: ({ commit }, payload) => {
            commit('setUrlPrev', payload);
        },
        commitCateenInfo: ({ commit }, payload) => {
            commit('setCateenInfo', payload);
        },
    },
};
