const messageOrder = {
    state: {
        //订单按钮状态
        order_diable: ''
    },
    mutations: {
        //订单按钮状态
        ORDER_DIABLE: (state, isDisable) => {
            state.order_diable = isDisable
        }
    },
    actions: {
        //保存订单按钮状态  同时应保存用户id-按钮状态
        setOrderIsDisable({ commit }, isDisable) {
            commit('ORDER_DIABLE', isDisable);
        }
    }
}

export default messageOrder
