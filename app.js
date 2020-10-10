const cypress = require('cypress')
const compareImages = require("resemblejs/compareImages");
const fs = require("mz/fs");
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();

async function getDiff(path, res, reportId) {
	try {

		const options = {
			output: {
				errorColor: {
					red: 255,
					green: 0,
					blue: 255
				},
				errorType: "flat",
				outputDiff: true
			},
			scaleToSameSize: false,
			ignore: "less"
		};

		// The parameters can be Node Buffers
		// data is the same as usual with an additional getBuffer() function
		const data = await compareImages(
			await fs.readFile(path + 'before.png'),
			await fs.readFile(path + 'after.png'),
			options
		);

		await fs.writeFile(path + 'output.png', data.getBuffer());
		
		var date = new Date();
		var dateStr = date.toLocaleString().substr(0, 19);
		
		res.send({
				result: 'OK',
				date: dateStr,
				data: data,
				before: reportId + '/before.png',
				after: reportId + '/after.png',
				output: reportId + '/output.png'
			});
	} catch (error) {
		console.error(error);
		res.send({result: 'ERROR'});
	}

}

app.post('/reports', function (req, res) {
	
	cypress.run({
		config: {
			headed: false,
			record: false
		}
	})
	.then((results) => {
		
		var screenshots = results.runs[0].tests[0].attempts[0].screenshots;
		var reportId = uuidv4();
		var path = 'public/' + reportId + '/';
		
		fs.mkdirSync(path, { mode : 777 });
		fs.renameSync(screenshots[0].path, path + 'before.png');
		fs.renameSync(screenshots[1].path, path + 'after.png');
		
		getDiff(path, res, reportId);
		
	})
	.catch((err) => {
		console.error(err)
		res.send({result: 'ERROR'});
	})
	
});

app.use(express.static('public'))

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});