/*
10		Лоуцкер Е.В.			lev@leaves.ru			659633971
50		Рогозин А.Р.			rog@leaves.ru 			159448512
60		Сазанкова И.В.          
90		Фридрих С.В.			SFridrikh@leaves.ru 	792967198
100		Автоматическое закрытие	mvk_jopex@leaves.ru           
91722	Смирнова Т.В.			TVSmirnova@leaves.ru          
141120	Иванов Ю.В.				YIvanov@leaves.ru             
295778	Круглов С.А.	
459828	Круглова А.А.			akruglova@leaves.ru           
2341015	Потопаева Н.А.			NPotopaeva@leaves.ru          
9805 Бурлова Л.И. 			LBurlova@leaves.ru    
*/
class lvsAuth {
	currentUser;
	UserList = [
		{
			id: 659633971,
			user_fio: "Лоуцкер Е.В.",
			ustt_id: 10,
			def_last_mode: 'ALL'
		},
		{
			id: 792967198,
			user_fio: "Фридрих С.В.",
			ustt_id: 90,
			def_last_mode: 'RD'
		},
		{
			id: 159448512,
			user_fio: "Рогозин А.Р.",
			ustt_id: 50,
			def_last_mode: 'RD'
		},

		{
			id: 144501083,
			user_fio: "Потопаева Н.А.",
			ustt_id: 2341015,
			def_last_mode: 'RD'
		},
		{
			id: 5264960816,
			user_fio: "Бурлова Л.И.",
			ustt_id:  9805,
			def_last_mode: 'ALL'
		},
/*
		{
			id: ,
			user_fio: "",
			ustt_id: 
		},
*/
	];
	constructor(chatId) {
		// console.log(`chatid: ${chatId}`);
		this.currentUser = this.UserList.find((user) => user.id==chatId)
		if(this.currentUser === undefined) {
			this.currentUser = {
				id: chatId,
				user_name: "undefined user",
				ustt_id: 0
			}
			// console.log('cu not found');
		}
	}
}

module.exports.lvsAut = lvsAuth;