
function getRowHtml(content) {
	return '<div class="row mt-3">' + content + '</div>';
}

function getColHmtl(content) {
	return '<div class="col-sm-3">' + content + '</div>'
}

function getImgHtml(src) {
	return '<img src="' + src + '" class="img-fluid img-thumbnail">';
}

function getDetailsHtml(date, data) {
	var s = '<strong>Fecha de reporte:</strong> ' + date + ' <br>';
	s += '<strong>Misma dimensión: </strong>' + (data.isSameDimensions? 'Sí': 'No') + '<br>';
	s += '<strong>Porcentaje de diferencias: </strong>' + data.misMatchPercentage + ' %<br>';
	s += '<strong>Tiempo de análisis: </strong>' + data.analysisTime + ' ms';
	return s;
}

$("#generateReportButton").click(function() {
	
	$("#generateReportButton").hide();
	$("#spinner").show();
	
	$.ajax({
		method: "POST",
		url: "reports"
	})
	.done(function( data ) {
		if (data.result = "OK") {
			$("#reports").append(getRowHtml(getColHmtl(getImgHtml(data.before)) + getColHmtl(getImgHtml(data.after)) + getColHmtl(getImgHtml(data.output)) + getColHmtl(getDetailsHtml(data.date, data.data))));
		}
	})
	.always(function() {
		$("#spinner").hide();
		$("#generateReportButton").show();
	})
	
});

$("#spinner").hide();