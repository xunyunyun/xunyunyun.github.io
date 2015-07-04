var board = new Array();
var score = 0;
var hasConflicted = new Array();//此数组来避免重复合并；

documentWidth = window.screen.availWidth;
gridContainerWidth = 0.92*documentWidth ;
cellSideLength = 0.18*documentWidth ;
cellSpace = 0.04*documentWidth ;


$(document).ready(function() {
	if(documentWidth>500){
		gridContainerWidth = 500 ;
		cellSideLength = 100 ;
		cellSpace = 20 ;	
	}else{
		prepareForMobile();
	}
	newgame();
});

function prepareForMobile(){
	$('#grid-container').css('width',gridContainerWidth-2*cellSpace);
	$('#grid-container').css('height',gridContainerWidth-2*cellSpace);
	$('#grid-container').css('padding',cellSpace);
	$('#grid-container').css('border-radius',0.02*gridContainerWidth);

	$('.grid-cell').css('width',cellSideLength);
	$('.grid-cell').css('height',cellSideLength);
	$('.grid-cell').css('border-radius',0.05*cellSideLength);
	
}

function newgame(){
	//初始化棋盘格
	init();
	//随机生成数字
	generateOneNumber();
	generateOneNumber();
}
function init(){
	for(var i = 0; i < 4; i ++){
		board[i] = new Array();
		hasConflicted[i] = new Array();
		for(var j = 0; j < 4; j ++){
			var gridCell = $("#grid-cell-"+i+"-"+j);

			gridCell.css('top',getPosTop(i,j));
			gridCell.css('left',getPosLeft(i,j));	

			board[i][j] = 0;
			hasConflicted[i][j] = false;	
		}
	}

	updateBoardView();
	score = 0;
}
//根据board数组的值，对前端进行操作.
function updateBoardView(){
	$(".number-cell").remove();//清空number-cell元素，从新生成；
	for(var i = 0; i < 4; i ++){
		for(var j = 0; j < 4; j ++){
			$("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
			var theNumberCell=$('#number-cell-'+i+'-'+j);
			if(board[i][j]==0){
				theNumberCell.css('width','0');
				theNumberCell.css('height','0');
				theNumberCell.css('top',getPosTop(i,j)+cellSideLength/2);
				theNumberCell.css('left',getPosLeft(i,j)+cellSideLength/2);
						
			}else{
				theNumberCell.css('width',cellSideLength+'px');
				theNumberCell.css('height',cellSideLength+'px');
				theNumberCell.css('top',getPosTop(i,j));
				theNumberCell.css('left',getPosLeft(i,j));
				theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
				theNumberCell.css('color',getNumberColor(board[i][j]));
				theNumberCell.text(board[i][j]);
			}
			hasConflicted[i][j] = false;	
		}
	}
	if(documentWidth<500){
		$('.number-cell').css('line-height',cellSideLength+'px');
		$('.number-cell').css('border-radius',0.05*cellSideLength);
		$('.number-cell').css('font-size',cellSideLength*0.6+'px');
	}
	
}

function generateOneNumber(){
	if(nospace(board)){
		return false;
	}

	//随机一个位置
    //方法一
	/*var randx = parseInt(Math.floor(Math.random()*4));//强制转化成整形
	var randy = parseInt(Math.floor(Math.random()*4));

	var times = 0;
	while(times < 50){
		if(board[randx][randy]==0){
			break;
		}
		randx = parseInt(Math.floor(Math.random()*4));
		randy = parseInt(Math.floor(Math.random()*4));

		times ++;
	}
	if(times == 50){
		for(var i = 0; i < 4; i ++){
			for(var j = 0; j < 4; j ++){
				if(board[i][j]==0){
					randx = i;
					randy = j;
				}
			}
		}
	}*/
	//方法二(快速生成数字)
	var emptyx=new Array();
	var emptyy=new Array();
	for(var i = 0; i < 4; i ++){
		for(var j = 0; j < 4; j ++){
			if(board[i][j]==0){
				emptyx.push(i);
				emptyy.push(j); 
			}
		}
	}

	var len = emptyx.length;
	var index = parseInt(Math.floor(Math.random()*len));//会产生0到len-1的数字
	var randx = emptyx[index];//强制转化成整形
	var randy = emptyy[index];

	//随机一个数字
	var randNumber=Math.random()<0.5? 2 : 4;

	//在随机位置上显示随机数字
	board[randx][randy] = randNumber;
	showNumberWithAnimation(randx,randy,randNumber);
	return true;
}

/*
$(document).swipeLeft(function(){
	if(moveLeft()){
		setTimeout(generateOneNumber,210);
		setTimeout(isgameover,300);
	}
});
$(document).swipeRight(function(){
	if(moveRight()){
		setTimeout(generateOneNumber,210);
		setTimeout(isgameover,300);
	}
});
$(document).swipeUp(function(){
	if(moveUp()){
		setTimeout(generateOneNumber,210);
		setTimeout(isgameover,300);
	}
});
$(document).swipeDown(function(){
	if(moveDown()){
		setTimeout(generateOneNumber,210);
		setTimeout(isgameover,300);
	}
});
*/

document.addEventListener("touchstart",function(event){
	startx=event.touches[0].pageX;
	starty=event.touches[0].pageY;
});
document.addEventListener("touchmove",function(event){
	event.preventDefault();
});
document.addEventListener("touchend",function(event){
	endx=event.changedTouches[0].pageX;
	endy=event.changedTouches[0].pageY;
	var deltax = endx - startx;
	var deltay = endy - starty;

	if(Math.abs( deltax )< 0.2*documentWidth && Math.abs( deltay )< 0.2*documentWidth){
			return;
	}else{
	//x轴上的移动
		if(Math.abs( deltax )>Math.abs( deltay )){
			if(deltax>0){
				//right
				if(moveRight()){
					setTimeout(generateOneNumber,210);
					setTimeout(isgameover,300);
				}
			}else{
				//left
				if(moveLeft()){
					setTimeout(generateOneNumber,210);
					setTimeout(isgameover,300);
				}
			}

		}else{
			if(deltay>0){
				//down
				if(moveDown()){
					setTimeout(generateOneNumber,210);
					setTimeout(isgameover,300);
				}
			}else{
				//up
				if(moveUp()){
					setTimeout(generateOneNumber,210);
					setTimeout(isgameover,300);
				}
			}
		}
	}

});

$(document).keydown(function(event) {
	event.preventDefault();//阻挡住原电脑自带的keydown、keyup事件，比如滚动条的上下滚动；
	//preventDefault取消所有的默认操作,加上之后会对功能影响较大，改为touchmove事件上。
	switch(event.keyCode){
		case 37://left
			if(moveLeft()){
				setTimeout(generateOneNumber,210);
				setTimeout(isgameover,300);
			}
			break;
		case 38://up
			if(moveUp()){
				setTimeout(generateOneNumber,210);
				setTimeout(isgameover,300);
			}
			break;
		case 39://right
			if(moveRight()){
				setTimeout(generateOneNumber,210);
				setTimeout(isgameover,300);
			}
			break;
		case 40://down
			if(moveDown()){
				setTimeout(generateOneNumber,210);
				setTimeout(isgameover,300);
			}
			break;
		default://default
			break;
	}
});

function isgameover(){
	if(nospace(board)&&nomove(board)){
		gameover();			
	}

}

function gameover(){
	alert("gameover!");
	return;
}


function moveLeft(){
	if(! canMoveLeft(board)){
		return false;
	}

	for(var i = 0; i < 4; i ++){
		for(var j = 1; j < 4; j ++){
			if(board[i][j]!=0){

				for(var k = 0;k < j;k ++){
				   //noBlockHorizontal(i,k,j,board)第i行由k到j之间没有障碍物，就可以移动
					if(board[i][k]==0&&noBlockHorizontal(i,k,j,board)){
						//move
						showMoveAnimation(i,j,i,k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if(board[i][k]==board[i][j]&&noBlockHorizontal(i,k,j,board)&&!hasConflicted[i][k]){
						//move
						showMoveAnimation(i,j,i,k);
						//add
						board[i][k] += board[i][j];
						board[i][j] = 0;
						//add score
						score +=board[i][k];
						updateScore(score);
						//conflict
						hasConflicted[i][k] = true;

						continue;
					}
				}
				
			}
				
		}
	}
	setTimeout(updateBoardView,200);
	return true;
}


function moveRight(){
	if(! canMoveRight(board)){
		return false;
	}

	for(var i = 0; i < 4; i ++){
		for(var j = 2; j >= 0; j --){
			if(board[i][j]!=0){

				for(var k = 3;k > j;k --){
				   //noBlockHorizontal(i,k,j,board)第i行由k到j之间没有障碍物，就可以移动
					if(board[i][k]==0&&noBlockHorizontal(i,j,k,board)){
						//move
						showMoveAnimation(i,j,i,k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if(board[i][k]==board[i][j]&&noBlockHorizontal(i,j,k,board)&&!hasConflicted[i][k]){
						//move
						showMoveAnimation(i,j,i,k);
						board[i][k] += board[i][j];
						board[i][j] = 0;
						score +=board[i][k];
						updateScore(score);
						hasConflicted[i][k] = true;
						continue;
					}
				}
				
			}
				
		}
	}

	setTimeout(updateBoardView,200);
	return true;

}


function moveUp(){
	if(! canMoveUp(board)){
		return false;
	}

	for(var j = 0; j < 4; j ++){
		for(var i = 1; i < 4; i ++){
			if(board[i][j]!=0){

				for(var k = 0;k < i;k ++){
				   //noBlockHorizontal(i,k,j,board)第i行由k到j之间没有障碍物，就可以移动
					if(board[k][j]==0&&noBlockVertical(k,i,j,board)){
						//move
						showMoveAnimation(i,j,k,j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if(board[k][j]==board[i][j]&&noBlockVertical(k,i,j,board)&&!hasConflicted[k][j]){
						//move
						showMoveAnimation(i,j,k,j);
						board[k][j] += board[i][j];
						board[i][j] = 0;

						score +=board[k][j];
						updateScore(score);

						hasConflicted[k][j] = true;
						continue;
					}
				}
				
			}
				
		}
	}

	setTimeout(updateBoardView,200);
	return true;

}


function moveDown(){
	if(! canMoveDown(board)){
		return false;
	}

	for(var j = 0; j < 4; j ++){
		for(var i = 2; i >= 0; i --){
			if(board[i][j]!=0){

				for(var k = 3;k > i;k --){
				   //noBlockHorizontal(i,k,j,board)第i行由k到j之间没有障碍物，就可以移动
					if(board[k][j]==0&&noBlockVertical(i,k,j,board)){
						//move
						showMoveAnimation(i,j,k,j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					}
					else if(board[k][j]==board[i][j]&&noBlockVertical(i,k,j,board)&&!hasConflicted[k][j]){
						//move
						showMoveAnimation(i,j,k,j);
						board[k][j] += board[i][j];
						board[i][j] = 0;

						score +=board[k][j];
						updateScore(score);
						hasConflicted[k][j] = true;
						continue;
					}
				}
				
			}
				
		}
	}

	setTimeout(updateBoardView,200);
	return true;

}

