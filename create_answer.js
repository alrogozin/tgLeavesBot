// API:
// https://node-oracledb.readthedocs.io/en/latest/api_manual/connection.html#

// https://node-oracledb.readthedocs.io/en/latest/user_guide/introduction.html#getting-started-with-node-oracledb

const oracledb = require('oracledb');

const oraConnectString = `(DESCRIPTION =
	(ADDRESS_LIST =
	  (ADDRESS = (PROTOCOL = TCP)(HOST = 172.16.27.9)(PORT = 1521))
	)
	(CONNECT_DATA =
	  (SERVICE_NAME = billapp)
	)
  )
`;

/*
// Daily11G2:
			  const oraConnectString = `(DESCRIPTION =
					 (ADDRESS_LIST =
					   (ADDRESS = (PROTOCOL = TCP)(HOST = 172.16.191.4)(PORT = 1521))
					   (ADDRESS = (PROTOCOL = TCP)(HOST = 172.16.191.5)(PORT = 1521))
					 )
					   (CONNECT_DATA =
						 (SERVICE_NAME = BILLTEST)
					 )
				   )`
*/

class Ora {
	// connection;

	async connect() {
 
		  try {
			this.connection = await oracledb.getConnection( {
			  user          : "mvk",
			  password      : "mvkprod$",
			  connectString : oraConnectString
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

		// await this.connect();
		try {
			connection = await oracledb.getConnection( {
			  user          : "mvk",
			  password      : "mvkprod$",
			  connectString : oraConnectString
			})
		} catch(err) {
			throw(err);
		};
		// console.log(connection.oracleServerVersionString);

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

	async createAnswer(pUser, pUrqId, pMsg, pUsttId) {
		// let usttId = this.getUsttId(pUser);
		let connection;

		// console.log(`user ${pUser} urq_id: ${pUrqId} msg: ${pMsg} ustt_id: ${usttId}`);
		
		try {
			connection = await oracledb.getConnection( {
			  user          : "mvk",
			  password      : "mvkprod$",
			  connectString : oraConnectString
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
	
}


module.exports.Ora = Ora;
// module.exports.createAnswer = createAnswer;
