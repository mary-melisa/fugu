export default {
    state: {
        accountInfo: {}, // 账户信息
        urlPrev: '',
        cateenInfo: {},
    },
    getters: {
        getUrlPrev: state => {
            return state.urlPrev;
        },
        getCateenInfo: state => {
            return state.cateenInfo;
        },
    },
    mutations: {
        setUrlPrev: (state, urlPrev) => {
            state.urlPrev = urlPrev;
        },
        setCateenInfo: (state, value) => {
            state.cateenInfo = value;
        },
    },
    actions: {
        commitUrlPrev: ({ commit }, payload) => {
            commit('setUrlPrev', payload);
        },
        commitCateenInfo: ({ commit }, payload) => {
            commit('setCateenInfo', payload);
        },
    },
};
