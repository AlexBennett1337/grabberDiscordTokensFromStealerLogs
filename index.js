const fs = require('fs-extra');
const path = require('path');
const walk = function(dir, done) {
	let results = [];
	fs.readdir(dir, function(err, list) {
		if (err) return done(err);
		let i = 0;
		(function next() {
			let file = list[i++];
			if (!file) return done(null, results);
			file = path.resolve(dir, file);
			fs.stat(file, function(err, stat) {
				if (stat && stat.isDirectory()) {
					walk(file, function(err, res) {
						results = results.concat(res);
						next();
					});
				} else {
					results.push(file);
					next();
				}
			});
		})();
	});
};

if(!fs.existsSync("logs")){
	fs.mkdirSync('logs');
	console.log('Я не нашёл папку "logs," поэтому я её создал за тебя.\nТебе только осталось закинуть логи в папку "logs" и запустить скрипт по новой.');
	return
}
console.log('Собираю пути, не завершайте скрипт пока он сам этого не захочет.\nДа, теперь не вы будете хотеть, а скрипт :3');
walk('./logs', function(err, results) {
	if (err) throw err;
	console.log(results)
	for ( strPath of results) {
		try{
			if(strPath.endsWith('.ldb') || strPath.endsWith('.txt') || strPath.endsWith('.log')){
				let data = fs.readFileSync(strPath, 'utf8');
				let tk = [...data.toString('utf8')
				.matchAll(/(mfa\.[\w_\-]{84})|([\w]{24}\.[\w_\-]{6}\.[\w_\-]{27})/g)]
				.map( m => m.slice(1)).flat(Infinity)
				.filter(Boolean).filter(tok => tok.startsWith('mfa.') || /\d{17,18}/.test(Buffer.from(tok.split('.')[0], 'base64').toString())); 
				tk.forEach(t => {
					console.log(t)	
					fs.appendFileSync(`tokens_finder.txt`, t +'\n');	
				});
			}
		} catch(err) {
			console.log(err)
		}
	}
});
