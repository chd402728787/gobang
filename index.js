var mainScreen = new Vue({
    el: "#mainScree",
    data: {
        victory: "",
    },

    created() {
        init();
    },

    methods: {
        //初始化
        init() {
            const gBCanvas = document.getElementById("goBangCanvas");
        },
        //开始
        startInit() {

        },
        //悔棋
        regret() {

        },
        //撤销悔棋
        undo() {

        },
        //投降
        giveUp() {

        },
        //重新开始
        playAgain() {

        },
        //胜负判断
        checkWin() {

        }
    },

})