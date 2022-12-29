// API:
// https://node-oracledb.readthedocs.io/en/latest/api_manual/connection.html#

// https://node-oracledb.readthedocs.io/en/latest/user_guide/introduction.html#getting-started-with-node-oracledb

const oracledb = require('oracledb');
const Config = require(`./config.js`).Config;


const Cfg = new Config(`./db/local.db`);
Cfg.get_orcl().then(() => {
	// console.log(`User:`, Cfg.OraConnection.connection_string);
})
.catch((err)=>{
	console.log(err);
})

class Ora {
	// connection;

	async connect() {
 
		  try {
			this.connection = await oracledb.getConnection( {
			  user          : Cfg.OraConnection.user,
			  password      : Cfg.OraConnection.password,
			  connectString : Cfg.OraConnection.connection_string
			})
		} catch(err) {
			throw(err);
		};
		// console.log(this.connection.oracleServerVersionString);
	}


	isConnected() {
		return null;
	}

	getUsttId(pUser) {
		let mUsttId = 90;
		return mUsttId;
	}

	async isExistUrq(pUrqId) {
		let mRetValue, connection;

		if (!Number.isInteger(parseInt(pUrqId))) {
			throw new Error(`${pUrqId} is not integer value`);
		}
		
		// await this.connect();
		try {
			connection = await oracledb.getConnection( {
				user          : Cfg.OraConnection.user,
				password      : Cfg.OraConnection.password,
				connectString : Cfg.OraConnection.connection_string
			  })
		} catch(err) {
			throw(err);
		};
		// console.log(connection.oracleServerVersionString);
		// console.log(`Ok client version: ` + oracledb.oracleClientVersionString);

		try {

			const result = await connection.execute(
				`Select count(*)
					From urq_task_list 
					Where id = :urq_id`,
				[pUrqId],
				{maxRows: 1}
			);
			mRetValue = result.rows[0][0];
		
		} catch (err) {
			console.error(err);
		} finally {
			if (connection) {
			try {
				await connection.close();
			} catch (err) {
				console.error(err);
			}
			}
		}
		return mRetValue;
	}


// 	begin
// 	-- Call the function
// 	:result := get_jopex_task_info(p_task_id => :p_task_id,
// 								   p_markup => :p_markup);
//   end;

async getTaskInfo(pUrqId, pMarkUp) {
	let connection;

	try {
		connection = await oracledb.getConnection( {
			user          : Cfg.OraConnection.user,
			password      : Cfg.OraConnection.password,
			connectString : Cfg.OraConnection.connection_string
	  })
	} catch(err) {
		throw(err + ' pUrqId:' + pUrqId);
	};

	  try {

		const result = await connection.execute(
			`Begin
				:result := get_jopex_task_info(
												p_task_id 	=> :p_task_id,
			 								   	p_markup 	=> :p_markup
												);
			End;
			`,
			{
				p_task_id: 	pUrqId,
				p_markup: 	pMarkUp,
				result: { dir: oracledb.BIND_OUT, type: oracledb.DB_TYPE_VARCHAR, maxSize: 32767 }
			}
		 );
		return await result.outBinds.result;
	} catch (err) {
		console.error(err);
		throw err;
	  } finally {
		if (connection) {
		  try {
			await connection.close();
		  } catch (err) {
			console.error(err);
		  }
		}
	}
}

async createAnswer(pUser, pUrqId, pMsg, pUsttId) {
		// let usttId = this.getUsttId(pUser);
		let connection;

		// console.log(`user ${pUser} urq_id: ${pUrqId} msg: ${pMsg} ustt_id: ${usttId}`);
		
		try {
			connection = await oracledb.getConnection( {
				user          : Cfg.OraConnection.user,
				password      : Cfg.OraConnection.password,
				connectString : Cfg.OraConnection.connection_string
			  })
		} catch(err) {
			throw(err + ' pUrqId:' + pUrqId);
		};

 
		  try {

			const result = await connection.execute(
				`Begin
					urq_manage_pkg.create_new_answer_web(
															p_urq_id => :urq_id, 
															p_dvlp_id => :dvlp_id, 
															p_text => :p_msg
														);
				End;
				`,
				{
					urq_id: 	pUrqId,
					dvlp_id: 	pUsttId,
					p_msg: 		pMsg,
				}
			 );

		} catch (err) {
			console.error(err);
		  } finally {
			if (connection) {
			  try {
				await connection.close();
			  } catch (err) {
				console.error(err);
			  }
			}
		}
	}
	
	async getLastUnRead(pMode) {
		let connection;
	
		try {
			connection = await oracledb.getConnection( {
				user          : Cfg.OraConnection.user,
				password      : Cfg.OraConnection.password,
				connectString : Cfg.OraConnection.connection_string
			  })
		} catch(err) {
			throw(err + ' pUrqId:' + pUrqId);
		};
	
		  try {
	
			const result = await connection.execute(
				`Begin
					:result := get_jopex_last_unread(
													p_mode 	=> :p_mode,
													p_count => 5
													);
				End;
				`,
				{
					p_mode: 	pMode,
					result: { dir: oracledb.BIND_OUT, type: oracledb.DB_TYPE_VARCHAR, maxSize: 32767 }
				}
			 );
			// return await result.outBinds.result.getData();
			return await result.outBinds.result;
		} catch (err) {
			console.error(err);
			throw err;
		  } finally {
			if (connection) {
			  try {
				await connection.close();
			  } catch (err) {
				console.error(err);
			  }
			}
		}
	}
	
}


module.exports.Ora = Ora;
// module.exports.createAnswer = createAnswer;
