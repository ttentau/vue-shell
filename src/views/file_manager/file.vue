<template>
    <div class="content"
         @click="contextMenu.isShow = false"
         @mouseup="resize.directory = false"
         @mousemove="mousemove"
         @contextmenu="$event.preventDefault()"
    >
        <div class="tabs">
            <div class="tab">
                code11111
            </div>
            <div class="tab">
                asdfasdfasd
            </div>
        </div>
        <c-header>
            <option-bar></option-bar>
        </c-header>
        <div class="tab-content" :class="readFiles.length?'show-file-tab':''">
            <div :style="{'width':widths.directoryWidth+'px'}" class="left-dir">
                <directory></directory>
            </div>
            <div :style="{'width':viewWidth - widths.directoryWidth+'px'}" class="dir-content">
                <div class="gutter-vertical" @mousedown="resize.directory = true"></div>
                <folder :directory-width="widths.directoryWidth" @openFile="readFileContent"></folder>
            </div>
        </div>

        <div class="file-tab" v-if="readFiles.length">
            <div class="tab" v-for="(item,index) of readFiles" @click="showFileContent(item)">
                <img class="cp" src="@/assets/images/file.png">
                <span :title="item.title">{{ item.title }}</span>
                <img class="cp" src="@/assets/images/close.png" alt="" @click.stop="removeFile(index)">
            </div>
        </div>

        <CodeEdit class="file-content"
                  @close="readFile.isShow = false"
                  v-if="readFile.isShow"
                  :content="readFile.content"
                  :title="readFile.title"
                  :path="readFile.path">
        </CodeEdit>
    </div>
</template>

<script>
    import DirItem from './DirItem'
    import OptionBar from './OptionBar'
    import directory from './directory'
    import folder from './folder'
    import File from '../../template/php/file.js'
    import CodeEdit from './CodeEdit'
    import {mapActions, mapMutations, mapState} from 'vuex'
    import {TYPES} from '../../store/mutation-types'

    export default {
        components: {
            'dir-item': DirItem,
            'CodeEdit': CodeEdit,
            directory,
            folder,
            OptionBar
        },
        data() {
            return {
                scale: 2,
                viewWidth: 1000,
                contextMenu: {
                    isShow: false,
                    top: 0,
                    left: 0,
                    path: '',
                    file: '',
                },
                readFile: {
                    isShow: false,
                    content: `//没有内容`,
                    title: '',
                    path: 'D:/safe/code/vue-shell/php-shell//shell.php'
                },
                readFiles: [],
                resize: {
                    directory: false,
                },
                widths: {
                    directoryWidth: 1000 * .2,
                }
            }
        },
        computed: {
            ...mapState('file', [
                'currentDir',
                'homePath',
                'currentPath',
                'shell'
            ]),
        },
        created() {
            this.init()
        },
        methods: {
            ...mapActions('file', {
                gotoPath: 'gotoPath'
            }),
            ...mapMutations('file', {
                setShell: TYPES.SET_SHELL + '',
            }),
            mousemove(e) {
                if (this.resize.directory) {
                    if (e.clientX < 120) return this.resize.directory = false
                    this.widths.directoryWidth = e.clientX
                }
            },
            save() {
                // console.log(this.readFile.content)
                let pre = this.$refs['pre']
                let newContent = pre.innerText

                console.log()
            },
            async init() {
                let shell = this.$route.query.shell
                shell = JSON.parse(shell)
                this.setShell(shell)
            },

            async readFileContent(value) {
                let {filePath, fileName} = value
                let files = this.readFiles.find(v => v.path === filePath)
                if (!files) {
                    let res = await this.$genRequest(this.shell, new File().read, [filePath])
                    if (typeof res === 'object') {
                        res = JSON.stringify(res, null, 4)
                    }
                    let row = {
                        title: fileName,
                        content: `${res}`,
                        path: filePath,
                    }
                    // this.$console(row)
                    this.readFiles.push(row)
                    this.readFile = {...this.readFile, ...row}
                } else {
                    this.readFile = {...this.readFile, ...files}
                }
                this.readFile.isShow = true
            },
            showFileContent(item) {
                let that = this
                that.readFile = {...that.readFile, ...item}
                that.readFile.isShow = !that.readFile.isShow
                // console.log(that.readFile);
            },
            removeFile(i) {
                let fileTab = this.readFiles[i]
                if (fileTab.path === this.readFile.path) {
                    this.readFile = {
                        isShow: false,
                        content: '',
                        title: '',
                        path: ''
                    }
                }
                this.readFiles.splice(i, 1)
                if (this.readFiles.length === 0) {
                    this.readFile.isShow = false
                }
            },
        },
        mounted() {
            this.$bus.$on('updateContent', val => {
                let res = this.readFiles.find(item => item.path === val.path)
                res.content = val.content
            })
        }
    }
</script>

<style lang="less" scoped>
    @import "../../assets/less/color";

    .content {
        -webkit-user-select: none; //禁止文字被选中
        height: 100%;
        width: 100%;
        position: relative;
        background: @main-bg-color;
        color: @text-color;

        img {
            height: 15px;
        }

        .cp {
            cursor: pointer;
        }


        .tabs {
            display: none;

            .tab {
                width: 30%;
                background: #ff634c;
                margin: 3px;
            }
        }


        .tab-content {
            //border-top: 1px solid gray;
            display: flex;
            height: calc(100% - 50px);


            .left-dir {
                overflow: auto;
                position: relative;

            }

            .dir-content {
                height: 100%;
                position: relative;

                .gutter-vertical {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 1px;
                    height: 100%;

                    &::after {
                        content: "";
                        cursor: col-resize;
                        display: block;
                        height: 100%;
                        width: 8px;
                        position: fixed;
                        margin-left: -3px;
                        z-index: 10;
                    }
                }
            }
        }

        .show-file-tab {
            height: calc(100% - 80px);
        }

        .file-tab {
            min-height: 30px;
            width: 100%;
            display: flex;
            overflow: auto;
            position: relative;
            z-index: 999;

            .tab {
                box-sizing: border-box;
                height: 30px;
                max-width: 150px;
                cursor: pointer;
                padding: 5px;
                display: flex;
                margin-right: 1px;
                align-items: center;
                background: rgb(78, 82, 84);

                span {
                    overflow: hidden; //超出的文本隐藏
                    text-overflow: ellipsis; //溢出用省略号显示
                    white-space: nowrap; //溢出不换行
                }

            }
        }
    }

    .file-content {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        background: #fff;
    }

</style>
