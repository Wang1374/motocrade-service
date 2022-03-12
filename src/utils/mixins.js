export const selectBottomAction = {
    methods: {
        /**
         * 为element-ui的Select和Cascader添加弹层底部操作按钮
         * @param visible
         * @param refName  设定的ref名称
         * @param onClick  底部操作按钮点击监听
         * @param addname  底部按钮名称
         */
        visibleChange(visible, refName, index, onClick, addname) {
            if (visible) {
                const ref = this.$refs[refName];
                let popper;
                if (Array.isArray(ref) == false) {
                    popper = ref.$refs.popper;
                } else if (Array.isArray(ref) == true) {
                    popper = ref[index].$refs.popper;
                }
                // let popper = ref.$refs.popper;
                if (popper.$el) popper = popper.$el;
                if (!Array.from(popper.children).some(v => v.className === "el-select-dropdown__list")) {
                    const el = document.createElement("ul");
                    el.className = "el-select-dropdown__list";
                    el.style = "border-top: solid 1px #E4E7ED; padding:0; color: #606266;";
                    el.innerHTML =
                        `<li class="el-select-dropdown__item" style="height:50px;line-height: 50px;text-align: center;">
                  <span class="el-select-dropdown__item" style="color: #409EFF;"><i class="el-icon-circle-plus-outline"></i>` +
                        addname +
                        `</span>
                  </li>`;
                    popper.appendChild(el);
                    el.onclick = () => {
                        // 底部按钮的点击事件 点击后想触发的逻辑也可以直接写在这
                        onClick && onClick();
                        // 以下代码实现点击后弹层隐藏 不需要可以删掉
                        if (ref.toggleDropDownVisible) {
                            ref.toggleDropDownVisible(false);
                        } else {
                            ref.visible = false;
                        }
                    };
                }
            }
        }
    }
}
