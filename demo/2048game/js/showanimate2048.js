function showNumberWithAnimation(i,j,number){
	var numberCell = $('#number-cell-'+i+'-'+j);
	numberCell.css('background-color',getNumberBackgroundColor(number));
	numberCell.css('color',getNumberColor(number));
	numberCell.text(number);

	numberCell.animate({
		width: cellSideLength+'px',
		height: cellSideLength+'px',
		top:getPosTop(i,j),
		left:getPosLeft(i,j)
	},50);
}

function showMoveAnimation(fromx,fromy,tox,toy){
	var numberCell = $('#number-cell-'+fromx+'-'+fromy);

	numberCell.animate({
		top:getPosTop( tox, toy),
		left:getPosLeft( tox, toy)
	},200);
}


function updateScore( score ){
	$('#score').text(score);
}