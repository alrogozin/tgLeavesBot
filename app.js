
// Может быть стоит посмотреть на Telegraf https://www.npmjs.com/package/telegraf (?)

const TelegramBot = require('node-telegram-bot-api');
const jopex = require(`./create_answer`);
const Auth = require(`./auth`);

// replace the value below with the Telegram token you receive from @BotFather
const token = '5816881379:AAEYDwLQALusr_QQU8M5qIEQe13ejkfcUgE';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

bot.setMyCommands([
	{command: '/start', 	description: 'Starting...'},
	{command: '/info', 		description: 'Получить информацию'},
	{command: '/jopex', 	description: 'Ответ в Jopex'},
	{command: '/about', 	description: 'О приложении'},
	{command: '/report', 	description: 'Сформировать отчет'},
])


async function runner() {
	oraMng = new jopex.Ora();
	bot.on('message', async msg => {	
		const text = msg.text;
		const chatId = msg.chat.id;
		lvsAuth = new Auth.lvsAut(chatId);

		try {
			if (text === '/start') {
				return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот Leaves Info`
				);
			}
			if (text === '/info') {
				bot.sendLocation(msg.chat.id, 60.002720, 30.349983);
				bot.sendMessage(chatId, `Вы:\n${msg.from.first_name}, ${msg.from.last_name}\nid:${msg.from.id}\nchatId:${msg.from.chatId}\ndescr: ${msg.from.description}`);
				bot.sendMessage(chatId, `Вы(II):\n${msg.chat.first_name}, ${msg.chat.last_name}\nuser_name:${msg.chat.username}\nid:${msg.chat.id}\nmsg.date:${msg.date}\nmsg.id:${msg.message_id}`);
				console.log(`Вы(II):\n${msg.chat.first_name}, ${msg.chat.last_name}\nuser_name:${msg.chat.username}\nid:${msg.chat.id}\nmsg.date:${msg.date}\nmsg.id:${msg.message_id}`);
				return;
			}
			if (text === '/jopex') {
					if(lvsAuth.currentUser.ustt_id == 0) {
						console.log(`У Вас нет полномочий для выполнения команды. chat_id:${chatId}`);
						bot.sendMessage(chatId, `У Вас нет полномочий для выполнения команды. Для получения информации: @alrog`);
						return;
					}
					bot.sendMessage(chatId, `Укажите номер задачи:`, { reply_markup: JSON.stringify({ force_reply: true }),})
					.then(function(sended) {
							bot.onReplyToMessage(sended.chat.id, sended.message_id, function (message) {
								let mUrqId = message.text;
								is_exist_jopex(mUrqId)
									.then(()=>{
										bot.sendMessage(chatId, `Текст сообщения:`
										,{ 
											// keyboard: [["Доброе утро, пожалуйста", "Добрый день, пожалуйста", "Добрый вечер, пожалуйста"],   ["Принято в работу"], ["Другое..."]],
											reply_markup: JSON.stringify({ 
												force_reply: true,
												input_field_placeholder: "Текст сообщения в журнал"
											// keyboard: [["Доброе утро, пожалуйста", "Добрый день, пожалуйста", "Добрый вечер, пожалуйста"],   ["Принято в работу"], ["Другое..."]],
										}),
										}
										)
										.then(function(sended) {
											bot.onReplyToMessage(sended.chat.id, sended.message_id, function (message) {
												do_jopex(mUrqId, message.text, lvsAuth.currentUser.ustt_id)
													.then(()=>{
															bot.sendMessage(chatId, `Запись в журнале создана`)
															console.log(`Запись создана #${mUrqId} "${message.text}"`);
														})
													.catch((err) => {
															bot.sendMessage(chatId, `Ошибка ${err.message}`);
															console.log(`Ошибка ${err.message}`);
														})
											})
										})
									})
									.catch(err => bot.sendMessage(chatId, err.message))
								})
							})

					return;
				}
			if (text === '/report') {
				console.log(text);
				return;
				// let mChatId = 792967198;
				// return bot.sendMessage(mChatId, `Bot останавливает свою работу до завтра`);
			}

			return;

		} catch (e) {
			return bot.sendMessage(chatId, 'Произошла ошибка: ', e.message);
		}
	})
}


async function is_exist_jopex (pUrqId) {
	oraMng = new jopex.Ora();
	let mIsExist = await oraMng.isExistUrq(pUrqId);
	if (mIsExist <= 0) {
		throw(new Error(`Задача ${pUrqId} не найдена в БД`));
	};
}

async function do_jopex (pUrqId, pMsg, pUsttId) {
	oraMng = new jopex.Ora();
	await oraMng.createAnswer('alrog', pUrqId, pMsg, pUsttId);
/*
	let mIsExist = await oraMng.isExistUrq(pUrqId);
	if (mIsExist > 0) {
		oraMng.createAnswer('alrog', pUrqId, pMsg);
	} else {
		throw(new Error(`Задача ${pUrqId} не найдена в БД`));
	};
*/
}

/*
let mUrqId = -94180;
runner(mUrqId, `Вот еще один пример!`);
*/
runner();

/*
				bot.onReplyToMessage(chatId, msg.message_id, function (message) {
					console.log(`echo: ${message.text}`);
					
					let mIsExist = oraMng.isExistUrq(pUrqId);
					if (mIsExist > 0) {
						oraMng.createAnswer('alrog', pUrqId, pMsg);
					} else {
						throw(new Error(`Задача ${pUrqId} не найдена в БД`));
					};
				});
*/			