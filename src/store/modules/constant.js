import { setSessionStorage, getSessionStorage, removeSessionStorage } from '@/utils/sessionStorage'
import { getClienteleAndContact } from "@/api/basic/clientele";
import { getAllShipsName, getAllShipCompany, getDockList, getBoxPileList } from "@/api/oms/commonality";
import { getAllCorporateAccount } from "@/api/system/user";
import { findCostsSet } from "@/api/basic/costsset";
import { getCompany } from "@/api/system/company";
import { getVehicleAndDriver } from "@/api/basic/vehicle";
import { getDriverAndContact } from '@/api/basic/driver';
const constant = {
    state: {
        company: getSessionStorage({
            name: 'company'
        }) || '',
        customer: getSessionStorage({
            name: 'customer'
        }) || '',
        ships_name: getSessionStorage({
            name: 'ships_name'
        }) || '',
        ship_company: getSessionStorage({
            name: 'ship_company'
        }) || '',
        dock: getSessionStorage({
            name: 'dock'
        }) || '',
        box_pile: getSessionStorage({
            name: 'box_pile'
        }) || '',
        corporate_account: getSessionStorage({
            name: 'corporate_account'
        }) || '',
        costs_set: getSessionStorage({
            name: 'costs_set'
        }) || '',
        vehicle: getSessionStorage({
            name: 'vehicle'
        }) || '',
        driver:getSessionStorage({
            name:'driver'
        })|| ''
    },
    mutations: {
        // 存企业信息
        SET_COMPANY: (state, company) => {
            state.company = company
            setSessionStorage({
                name: 'company',
                content: state.company
            })
        },
        // 存客户与联系人
        SET_CUSTOMER: (state, customer) => {
            state.customer = customer
            setSessionStorage({
                name: 'customer',
                content: state.customer
            })
        },
        // 存船名
        SET_SHIPSNAME: (state, shipsName) => {
            state.ships_name = shipsName
            setSessionStorage({
                name: 'ships_name',
                content: state.ships_name
            })
        },
        // 存船公司
        SET_SHIPCOMPANY: (state, shipCompany) => {
            state.ship_company = shipCompany
            setSessionStorage({
                name: 'ship_company',
                content: state.ship_company
            })
        },
        // 存码头
        SET_DOCK: (state, dock) => {
            state.dock = dock
            setSessionStorage({
                name: 'dock',
                content: state.dock
            })
        },
        // 存箱型
        SET_BOX_PILE: (state, boxPile) => {
            state.box_pile = boxPile
            setSessionStorage({
                name: 'box_pile',
                content: state.box_pile
            })
        },
        // 存企业所有账户信息
        SET_CORPORATE_ACCOUNT: (state, corporateAccount) => {
            state.corporate_account = corporateAccount
            setSessionStorage({
                name: 'corporate_account',
                content: state.corporate_account
            })
        },
        // 存费用设置
        SET_COSTS_SET: (state, costsSet) => {
            state.costs_set = costsSet
            setSessionStorage({
                name: 'costs_set',
                content: state.costs_set
            })
        },
        //存车辆
        SET_VEHICLE: (state, vehicle) => {
            state.vehicle = vehicle
            setSessionStorage({
                name: 'vehicle',
                content: state.vehicle
            })
        },
        // 存司机
        SET_DRIVER:(state,driver)=>{
            state.driver = driver
            setSessionStorage({
                name:'driver',
                content:state.driver
            })
        }
    },
    actions: {
        // 获取常量信息
        GetConstant({ commit }, data) {
            return new Promise(resolve => {
                if (data.state == 0) {
                    //获取司机信息
                    getDriverAndContact(data.corporateIdentify).then(response=>{
                        if (response.status === 200) {
                            commit('SET_DRIVER', response.data)
                          }
                    })
                    // 获取企业所有账户
                    getAllCorporateAccount(data.corporateIdentify).then(response => {
                        if (response.status === 200) {
                            commit('SET_CORPORATE_ACCOUNT', response.data)
                        }
                    })
                    // 根据企业标识id查询 企业信息
                    getCompany(data.corporateIdentify).then(response => {
                        if (response.data.status === 200) {
                            commit('SET_COMPANY', response.data.data)
                        }
                    });
                    // 获取船名
                    getAllShipsName().then(response => {
                        if (response.status === 200) {
                            commit('SET_SHIPSNAME', response.data)
                        }
                    })
                    // 获取箱型
                    getBoxPileList().then(response => {
                        if (response.status === 200) {
                            commit('SET_BOX_PILE', response.data)
                        }
                    })
                    // 获取客户与联系方式
                    getClienteleAndContact(data.corporateIdentify).then(response => {
                        if (response.status === 200) {
                            commit('SET_CUSTOMER', response.data)
                        }
                    });
                    // 获取船公司
                    getAllShipCompany().then(response => {
                        if (response.status === 200) {
                            commit('SET_SHIPCOMPANY', response.data)
                        }
                    })
                    // 获取码头
                    getDockList().then(response => {
                        if (response.status === 200) {
                            commit('SET_DOCK', response.data)
                        }
                    })
                    // 获取费用设置
                    findCostsSet(data.corporateIdentify).then(response => {
                        if (response.status === 200) {
                            commit('SET_COSTS_SET', response.data)
                        }
                    })
                    //获取车辆
                    delete data.state
                    //data.vehicleBelongState=1,
                    getVehicleAndDriver(data).then(response => {
                        if (response.status === 200) {
                            commit('SET_VEHICLE', response.data)
                        }
                    })
                }
                if (data.state == 1) {
                    // 获取客户与联系方式
                    getClienteleAndContact(data.corporateIdentify).then(response => {
                        if (response.status === 200) {
                            commit('SET_CUSTOMER', response.data)
                        }
                    });
                }
                if (data.state == 2) {
                    // 获取费用设置
                    findCostsSet(data.corporateIdentify).then(response => {
                        if (response.status === 200) {
                            commit('SET_COSTS_SET', response.data)
                        }
                    })
                }

                if (data.state == 3) {
                    // 根据企业标识id查询 企业信息
                    getCompany(data.corporateIdentify).then(response => {
                        if (response.data.status === 200) {
                            commit('SET_COMPANY', response.data.data)
                        }
                    });
                }
                if (data.state == 4) {
                    //获取车辆
                    //删除data对象中的state属性
                    delete data.state
                    getVehicleAndDriver(data).then(response => {
                        if (response.status === 200) {
                            commit('SET_VEHICLE', response.data)
                        }
                    })
                }
                if (data.state == 5) {
                    // 获取船名
                    getAllShipsName().then(response => {
                        if (response.status === 200) {
                            commit('SET_SHIPSNAME', response.data)
                        }
                    })
                }
                resolve()
            })
        }
    }
}

export default constant
