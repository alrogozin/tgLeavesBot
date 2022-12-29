const sqlite3 = require('sqlite3');
const fs = require('fs');


class Config {
	dbfilePath;
	OraConnection = {
		user: '',
		password: '',
		connection_string: ''
	};
	botToken;

	get_bot_token(p_mode) {
		return new Promise((resolve, reject) =>{
			let mCfgAbbr;
			if  (p_mode=="ALROGPET") {
				mCfgAbbr = "BOT_TOKEN_TEST";
			} else {
				mCfgAbbr = "BOT_TOKEN"
			}

			let db = new sqlite3.Database(this.dbfilePath, sqlite3.OPEN_READONLY, (err) => {
				if (err) {
					return reject(err.message);
				}
			  });
			
			return db.each(`SELECT *
						FROM cmn_config
						Where abbr = '${mCfgAbbr}'
						`, (err, row) => {
				if (err) {
					return reject(err.message);
				}
				// console.log(row.grp_abbr+ "\t" + row.abbr + "\t" + row.name);
				
				if (row.abbr == mCfgAbbr) {
					this.botToken = row.val;
				}

				db.close((err) => {
					if (err) {
						return reject(err.message);
					}
					// console.log('Close the database connection.');
				});
	
				return resolve('done');
			});
			
			
		})
	}

	
	get_orcl() {
		return new Promise((resolve, reject) =>{

			let db = new sqlite3.Database(this.dbfilePath, sqlite3.OPEN_READONLY, (err) => {
				if (err) {
					return reject(err.message);
				}
			  });
			
			return db.each(`SELECT *
						FROM cmn_config
						Where grp_abbr='DB'
						`, (err, row) => {
				if (err) {
					return reject(err.message);
				}
				// console.log(row.grp_abbr+ "\t" + row.abbr + "\t" + row.name);
				if (row.abbr == "USER_NAME") {
					this.OraConnection.user = row.val;
				} else if(row.abbr == "PASSWORD") {
					this.OraConnection.password = row.val;
				} else if(row.abbr == "PROD_CONNECT_STRING") {
					this.OraConnection.connection_string = row.val;
				}

				db.close((err) => {
					if (err) {
						return reject(err.message);
					}
					// console.log('Close the database connection.');
				});
	
				return resolve('done');
			});
			
			
		})
	}

	constructor(p_dbfile){
		try {
			if (fs.existsSync(p_dbfile)) {
			  this.dbfilePath = p_dbfile;
			} else {
				throw new Error(`File DB ${p_dbfile} doesn't exist`);
			}
		  } catch(err) {
			console.error(err)
		  }
		
	}
}

module.exports.Config = Config;
