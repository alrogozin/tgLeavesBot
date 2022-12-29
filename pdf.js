const fs =require('fs');
const { jsPDF } = require("jspdf");
const { builtinModules } = require('module');


function formPDF(pInpData, fname) {

	const
	pageWidth 		= 8.5,
	lineHeight 		= 1.4,
	margin 			= 0.5,
	maxLineWidth 	= pageWidth - margin * 2 - 0.2,
	fontSize 		= 10,
	ptsPerInch 		= 72,
	oneLineHeight 	= (fontSize * lineHeight) / ptsPerInch,
	xMargin 		= 0.6,
	yMargin 		= 0.6,
	// text 			= `Господа, Давайте наверное, если от нас требуют удаление расчетов НВ/НССВ и запрещенных ЗВ, не только во втором и третьем месяце, но и в первом, не пользоваться «служебным входом», а просто аннулировать пробу. Иначе получается как в договоре 306586, объект -399719. В компенсации все хорошо, а месячный план показывает фигню: судя по актам пробы обработаны, судя по отсутствию коэффициентов–нет, плюс есть ( остался ) признак наличия запрещенных ЗВ. Возможно, есть другой, более правильный способ–корректно отражать изменения в компенсации в месячном плане.\nРис 1. Новый месячный план, кстати, показывает этот объект как с обработанными пробами, что неверно.\nРис 2. Форма расчеты тоже показывает фигню: налчие Кнв, отсутствие Кнссв, налчие ЗЗВ`
	text 			= pInpData
	;

	const doc = new jsPDF({
		orientation: 	'p',
		unit: 			'in',
		format: 		'a4',
		lineHeight: 	lineHeight,
		maxLineWidth: 	maxLineWidth,
		oneLineHeight: 	oneLineHeight,
	});

	doc.setProperties({
		title: 			'Заголовок документа',
		subject: 		'Subject документа',
		author:			'Алексей Рогозин',
		keywords: 		'JavaScript Oracle Leaves ',
		creator: 		'AlRogozin@gmail.com'
	});


	doc.addFont("c:/windows/fonts/verdana.ttf", "Verdana", "normal");
	doc.addFont("c:/windows/fonts/verdana.ttf", "Verdana", "bold");
	doc.addFont("c:/windows/fonts/verdana.ttf", "Verdana", "italic");

	let bs =pInpData.split("/n");
	let textHeight = 0;
	for (let i=0; i< bs.length; i++) {

		// -------------------------------------
		// Формирование блокка текста с посчетом координат начала печати текста
		var textLines = doc
		.setFont("Verdana")
		.setFontSize(fontSize)
		.splitTextToSize(bs[i], maxLineWidth);
		if(textLines[0].startsWith("Запрос:")  || textLines[0].startsWith("Автор:") || textLines[0].startsWith("Задача:")) {
			doc.setFont("Verdana", "bold");
		} else {
			doc.setFont("Verdana", "normal");
		}
		doc.text(textLines, xMargin,textHeight + yMargin, {maxWidth: maxLineWidth, align: "left" })
		textHeight = textHeight + (textLines.length * fontSize * lineHeight) / ptsPerInch;
	}

	// -------------------------------------
	// Формирование блокка текста с посчетом координат начала печати текста
/*
	var textLines = doc
	.setFont("Verdana")
	.setFontSize(fontSize)
	.splitTextToSize(t1, maxLineWidth);
	textHeight = textHeight + (textLines.length * fontSize * lineHeight) / ptsPerInch;
	doc.text('Reprehenderit eiusmod laborum velit nostrud nostrud consectetur laboris sint ut. Quis ad qui elit adipisicing minim proident tempor enim dolor. Officia aliqua est quis Lorem esse aliqua Lorem aliquip sunt adipisicing voluptate. Sit minim enim eiusmod sunt nostrud. Reprehenderit non cillum sit minim occaecat ex officia qui sunt ea fugiat. Quis aute aliqua ipsum labore anim sunt proident eiusmod Lorem adipisicing.',
	xMargin, textHeight + yMargin, {maxWidth: maxLineWidth }
	)
*/
	// -------------------------------------
	// Запись файлв
	doc.save(fname);
	// var blobPDF = new Blob([doc.output("blob")], {type: 'application/.pdf'})
	// let ab = doc.output("pdfjsnewwindow");
	// let ab = doc.output("datauristring");
	// console.log(ab);
	return "";

}

module.exports.formPDF = formPDF;