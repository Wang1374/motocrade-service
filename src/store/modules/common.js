const common = {
    state: {
        ys_total_cost: 0,
        ys_total_analysis: 0,
        yf_total_cost: 0,
        yf_total_analysis: 0,
        qtys_total_cost: 0,
        qtys_total_analysis: 0,
        qtyf_total_cost: 0,
        qtyf_total_analysis: 0,
        //消息数量
        message_number: 0
    },
    mutations: {
        YS_TOTAL_COST: (state, total) => {
            state.ys_total_cost = total
        },
        YS_TOTAL_ANALYSIS: (state, total) => {
            state.ys_total_analysis = total
        },
        YF_TOTAL_COST: (state, total) => {
            state.yf_total_cost = total
        },
        YF_TOTAL_ANALYSIS: (state, total) => {
            state.yf_total_analysis = total
        },
        QTYS_TOTAL_COST: (state, total) => {
            state.qtys_total_cost = total
        },
        QTYS_TOTAL_ANALYSIS: (state, total) => {
            state.qtys_total_analysis = total
        },
        QTYF_TOTAL_COST: (state, total) => {
            state.qtyf_total_cost = total
        },
        QTYF_TOTAL_ANALYSIS: (state, total) => {
            state.qtyf_total_analysis = total
        },
        //消息数量
        MESSAGE_NUMBER: (state, total) => {
            state.message_number = total
        }
    },
    actions: {
        // 保存应收总金额
        setYsTotalCost({ commit }, total) {
            commit('YS_TOTAL_COST', total);
        },
        // 保存应收总金额
        setYsTotalAnalysis({ commit }, total) {
            commit('YS_TOTAL_ANALYSIS', total);
        },
        // 保存应付总金额
        setYfTotalCost({ commit }, total) {
            commit('YF_TOTAL_COST', total);
        },
        // 保存应付总金额
        setYfTotalAnalysis({ commit }, total) {
            commit('YF_TOTAL_ANALYSIS', total);
        },
        // 保存其他应收总金额
        setQtysTotalCost({ commit }, total) {
            commit('QTYS_TOTAL_COST', total);
        },
        // 保存其他应收总金额
        setQtysTotalAnalysis({ commit }, total) {
            commit('QTYS_TOTAL_ANALYSIS', total);
        },
        // 保存其他应付总金额
        setQtyfTotalCost({ commit }, total) {
            commit('QTYF_TOTAL_COST', total);
        },
        // 保存其他应付总金额
        setQtyfTotalAnalysis({ commit }, total) {
            commit('QTYF_TOTAL_ANALYSIS', total);
        },
        //保存消息数量
        setMessageNumber({ commit }, total) {
            commit('MESSAGE_NUMBER', total);
        }
    }
}

export default common
