class HandleElement {
    getEl(el, select) {
        return el ? (select ? document.querySelectorAll(el) : document.querySelector(el)) : null
    }
    setEl(value, style, pNode) {
        return new Promise((resolve, reject) => {
            let nodeEl = document.createElement('div')
            nodeEl.innerText = value
            nodeEl.classList.add(style)
            nodeEl.setAttribute('data-key', value)
            pNode.appendChild(nodeEl)
            resolve(nodeEl)
        })
    }
}

export default class Calculator extends HandleElement {
    constructor(opt = {}) {
        super()
        // 获取主结构
        this.container = this.getEl(opt.el)
        this.count = 0
        // 创建计算器的值
        this.keys = ['AC', 'Del', '%', '÷', 7, 8, 9, '×', 4, 5, 6, '-', 1, 2, 3, '+', 0, '.', '=']
    }
    /**
     * 初始化
     */
    init() {
        this.setStyle(result => {
            if (!result)
                return false
            this.handleClick()
        })
    }
    /**
     * 设置样式
     */
    async setStyle(callback) {
        await this.createCountOrKey().then(result => {
            if (result) {
                let link = document.createElement('link')
                link.href = './styles/index.css'
                link.rel = 'stylesheet'
                this.getEl('head').appendChild(link)
                callback && callback(true)
            }
        }).catch(err => {
            callback && callback(false)
        })
    }
    /**
     * 创建内容
     */
    createCountOrKey() {
        try {
            return new Promise((resolve, reject) => {
                const count = this.setEl(0, 'result', this.container)
                const keyRow = this.setEl(null, 'key-row', this.container)
                const keyCol = this.keys.map(key => {
                    return this.setEl(key, 'key-col', this.getEl('.key-row'))
                })
                return Promise.all([count, keyRow, keyCol]).then(_ => {
                    resolve(true)
                }).catch(err => {
                    reject(err)
                })
            })
        } catch (error) {
            throw new Error(error)
        }
    }
    /**
     * 处理事件绑定
     */
    handleClick() {
        const row = this.getEl('.key-row').children || null
        Array.from(row).forEach(el => {
            el.onclick = e => {
                this.keyClick(e)
            }
        })
    }
    /**
     * 点击处理
     */
    keyClick(e) {
        let target = e.target.getAttribute('data-key')
        let targetValue = Number(target)
        if (target === 'AC') { // 归零
            this.count = 0
        } else if (target === 'Del') { // 删除

            if (~~this.count < 0) {
                this.count = 0
            } else {
                this.count = String(this.count)
                this.count = this.count.substring(0, this.count.length - 1)
                this.count = this.count == '' ? 0 : this.count
            }

        } else if (target === '=') { // 求和
            this.count = eval(this.count)
        } else if (!isNaN(targetValue)) { // 数字
            if (String(this.count).length >= 2) {
                this.count += String(target)
            } else {
                this.count == 0 ? this.count = String(target) : this.count += String(target)
            }
        } else { // 字符
            let strCount = this.count <= 9 || this.count >= 0 ? String(this.count) : String(this.count)[this.count.length - 1]

            if (String(this.count)[this.count.length - 1] == '.') {
                return false;
            }
            if (this.count <= 0 && target != '.') {
                return false
            }
            if (this.count !== 0 || !isNaN(strCount)) {
                target = target == '×' ? '*' : target
                target = target == '÷' ? '/' : target
                this.count += target
            }

        }

        this.handleCount()
    }
    /**
     * 求和
     */
    handleCount() {
        return this.getEl('.result').innerText = this.count
    }
}