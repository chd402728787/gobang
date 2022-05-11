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
        flag: false,
        img: ["images/黑.png", "images/白.png"],
        showBefore: true,
        showIng: false
    },

    created() {

    },
    mounted() {
        this.gameInit();
        let gbcanvas = this.$refs.gbcanvas;
        let gbcontext = gbcanvas.getContext("2d");
        gbcontext.font = '56px "微软雅黑"';
        gbcontext.fillStyle = "white";
        gbcontext.fillText("点击按钮开始游戏", gbcanvas.width / 4, gbcanvas.height / 2);
    },

    methods: {
        //初始化
        gameInit() {
            //console.log("初始化成功！");
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
            let gbcontext = gbcanvas.getContext("2d");
            //绘制，五子棋标准棋盘为15×15
            gbcontext.strokeStyle = '#666';
            for (let i = 0; i < 15; i++) {
                //canvas宽高为450
                gbcontext.moveTo(30 + i * 60, 30);
                gbcontext.lineTo(30 + i * 60, gbcanvas.height - 30);
                gbcontext.stroke();
                gbcontext.moveTo(30, 30 + i * 60);
                gbcontext.lineTo(gbcanvas.width - 30, 30 + i * 60);
                gbcontext.stroke();
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
            this.drawBoard();
            const gbcanvas = this.$refs.gbcanvas;
            this.showBefore = false;
            this.showIng = true;
            //添加点击监听事件
            gbcanvas.addEventListener("click", e => {
                if (this.flag == true) {
                    alert("游戏结束,请重新开始~");
                    return;
                    //this.playAgain();
                }
                //判断点击范围是否越出棋盘
                if (e.offsetx < 30 || e.offsetx > 900 || e.offsetY < 10 || e.offsetY > 900) {
                    return;
                }
                //落子
                let x = Math.floor(e.offsetX / 60);
                let y = Math.floor(e.offsetY / 60);
                //console.log('this.chessMapArr 数组', this.chessMapArr)
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
                    //更换鼠标样式
                    styleStr = "url(" + this.img[this.step % 2] + "),auto";
                    document.body.style.cursor = styleStr;
                } else if (this.chessMapArr[x][y] != 0) {
                    alert("已有棋子！")
                }
            })
        },
        //投降
        giveUp() {
            if (this.step > 0) {
                if (this.chessColor[this.step % 2] == "black")
                    this.victory = "白子棋方胜利！";
                else
                    this.victory = "黑子棋方胜利！";
                this.flag = true;
                this.gameOverText();
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
                this.gameOverText();
                this.flag = true;
            }
        },
        //游戏结束文本
        gameOverText() {
            let gbcanvas = this.$refs.gbcanvas;
            let gbcontext = gbcanvas.getContext("2d");
            gbcontext.font = '72px "微软雅黑"';
            gbcontext.fillStyle = "white";
            gbcontext.fillText(this.victory, gbcanvas.width / 4, gbcanvas.height / 2);
            gbcontext.font = '48px "微软雅黑"';
            gbcontext.fillStyle = "red";
            gbcontext.fillText("点击上方按钮重新开始", gbcanvas.width / 4, gbcanvas.height / 2 + 100);
        }
    },

})