import { TYPES } from '../mutation-types'

export const layout = {
    // namespaced: true,
    state: {
        isLeftCollapse: false,
        isRightCollapse: true,
    },
    mutations: {
        [TYPES.COLLAPSE_LEFT](state) {
            state.isLeftCollapse = !state.isLeftCollapse
        },
        [TYPES.COLLAPSE_RIGHT](state) {
            state.isRightCollapse = !state.isRightCollapse
        },
    },
    getters: {},
    actions: {},
}
export default {}
