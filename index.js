var mainScreen = new Vue({
    el: "#mainScreen",
    data: {
        chessMapArr: [], //棋盘落子情况
        chessColor: ["black", "white"], //棋子颜色
        victory: "", //输赢显示文本
        step: 0, //记录当前步数
        checkMode: [ //输赢检查方向
            [1, 0], //水平
            [0, 1], //竖直
            [1, 1], //左斜线
            [1, -1] //右斜线
        ],
        flag: false
    },

    mounted() {
        this.gameInit();
    },

    methods: {
        //初始化
        gameInit() {
            console.log("初始化成功！");
            const gBCanvas = document.getElementById("goBangCanvas");
            this.drawBoard();
        },
        //初始化棋盘数组
        chessArr() {
            for (let i = 0; i < 15; i++) {
                this.chessMapArr[i] = [];
                for (let j = 0; j < 15; j++) {
                    this.chessMapArr[i][j] = 0;
                }
            }
        },
        //绘制棋盘
        drawBoard() {
            //初始化棋盘数组
            this.repaint();
            this.chessArr();
            let gbcanvas = this.$refs.gbcanvas;
            let context = gbcanvas.getContext("2d");
            //绘制，五子棋标准棋盘为15×15
            context.strokeStyle = '#666';
            for (let i = 0; i < 15; i++) {
                //canvas宽高为450
                context.moveTo(30 + i * 60, 30);
                context.lineTo(30 + i * 60, gbcanvas.height - 30);
                context.stroke();
                context.moveTo(30, 30 + i * 60);
                context.lineTo(gbcanvas.width - 30, 30 + i * 60);
                context.stroke();
            }
        },
        //绘制棋子
        drawChess(x, y, color) {
            let gbcanvas = this.$refs.gbcanvas;
            let context = gbcanvas.getContext("2d");
            context.beginPath();
            context.arc(x, y, 25, 0, Math.PI * 2, false);
            context.closePath();
            context.fillStyle = color;
            context.fill();
        },
        //开始
        startInit() {
            const gbcanvas = this.$refs.gbcanvas;
            //添加点击监听事件
            gbcanvas.addEventListener("click", e => {
                //判断点击范围是否越出棋盘
                if (e.offsetx < 30 || e.offsetx > 900 || e.offsetY < 30 || e.offsetY > 900) {
                    return;
                }
                //落子
                let x = Math.floor(e.offsetX / 60);
                let y = Math.floor(e.offsetY / 60);
                console.log('this.chessMapArr 数组', this.chessMapArr)
                if (this.chessMapArr[x][y] == 0) {
                    console.log('落下棋子', x, y, this.chessColor[this.step % 2])
                    this.drawChess(x * 60 + 30, y * 60 + 30, this.chessColor[this.step % 2]);
                    this.chessMapArr[x][y] = this.chessColor[this.step % 2];
                    //检查是否赢得游戏
                    for (let i = 0; i < 4; i++) {
                        this.checkWin(x, y, this.chessColor[this.step % 2], this.checkMode[i]);
                    }
                    //更换下棋方
                    this.step++;
                    if (this.flag == true) {
                        //跳出XX方胜利





                        this.playAgain();
                    }
                } else {
                    alert("已有棋子！")
                }
            })
        },
        //悔棋
        regret() {

        },
        //撤销悔棋
        undo() {

        },
        //投降
        giveUp() {
            if (step > 0) {
                if (this.chessColor[this.step % 2] == "black")
                    this.victory = "白子棋方胜利！";
                else
                    this.victory = "黑子棋方胜利！";
                flag = true;
            }
        },
        //重新开始
        playAgain() {
            this.drawBoard();
            this.flag = false;
            this.step = 0;
            this.victory = "";
        },
        repaint() {
            let gbcanvas = this.$refs.gbcanvas;
            let context = gbcanvas.getContext("2d");
            context.fillStyle = "bisque";
            context.fillRect(0, 0, gbcanvas.width, gbcanvas.height);
            context.beginPath();
            context.closePath();
        },
        //胜负判断
        checkWin(x, y, color, mode) {
            let count = 1; //记录
            for (let i = 1; i < 5; i++) {
                if (this.chessMapArr[x + i * mode[0]]) {
                    if (this.chessMapArr[x + i * mode[0]][y + i * mode[1]] == color) {
                        count++;
                    } else break;
                }
            }
            for (let j = 1; j < 5; j++) {
                if (this.chessMapArr[x - j * mode[0]]) {
                    if (this.chessMapArr[x - j * mode[0]][y - j * mode[1]] == color) {
                        count++;
                    } else {
                        break;
                    }
                }
            }
            if (count >= 5) {
                if (color == 'black') {
                    this.victory = "黑子棋方胜利！";
                } else {
                    this.victory = "白子棋方胜利！";
                }
                // 游戏结束
                // console.log('游戏结束')
                this.flag = true;
            }
        }
    },

})