import {TYPES} from '../mutation-types'
import request from "../../utils/http";
import File from "../../template/php/file";

export const file = {
    namespaced: true,
    state: {
        currentDir: [],
        homePath: '',
        currentPath: '',
        currentParsePath: '',
        shell: {
            url: '',
            pwd: '',
            shellUrl: '',
        },
    },
    mutations: {
        [TYPES.SET_CURRENT_DIR](state, v) {
            state.currentDir = v
        },
        [TYPES.SET_HOME_PATH](state, v) {
            state.homePath = v
        },
        [TYPES.SET_CURRENT_PATH](state, v) {
            state.currentPath = v
        },
        [TYPES.SET_SHELL](state, v) {
            state.shell = v
        },
        [TYPES.SET_CURRENT_PARSE_PATH](state, v) {
            state.currentParsePath = v
        },

    },
    getters: {},
    actions: {
        async gotoPath({state, commit}, path) {
            // console.log(value)
            let res = await request(state.shell.shellUrl + new File(path + '/').dir())
            let row = res.split('\n')
            let currentDir = []
            row.map(v => {
                if (v) {
                    let row = v.split('``')
                    currentDir.push({
                        name: row[0],
                        type: Number(row[1]),
                        change_date: row[2],
                        file_size: row[3],
                    })
                }
            })
            commit(TYPES.SET_CURRENT_DIR, currentDir)
            commit(TYPES.SET_CURRENT_PATH, path)
        }
    },
}
export default {}
