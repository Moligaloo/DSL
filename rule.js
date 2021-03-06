skill =
 	sections:skill_section+{
 		if(sections.length == 1)
 			return sections[0];
 		else{
 			return sections;
 		}
 	}

skill_section =
	skill_spec:skill_type* conditions:conditions? statements:statements{
		return {
			"技能类型": skill_spec,
			"发动条件": conditions,
			"执行效果": statements
		};
	}

skill_type =
	type:('主公技' / '锁定技' / '限定技' / '觉醒技') comma{
		return type;
	}

conditions =
	condition:condition second_conditions:second_condition* punctuation{
		if(second_conditions.length == 0)
			return condition;
		else{
			var all_conditions = second_conditions;
			all_conditions.unshift(condition);

			return {
				'条件类型':'并列条件',
				'条件组':all_conditions
			};
		}
	}

condition =
	'当'? player:player? event:event{
		return {
			"目标": player,
			"事件": event
		};
	} 

second_condition = 
	'或' condition:condition {
		return condition;
	}

statements =
	statements:statement_with_punc+ { 
		return statements;
	}

statement_with_punc = 
	statement:statement punctuation?{
		return statement;
	}

statement =
	'各' action:action{
		return {
			'语句类型':'循环动作',
			'循环动作':action
		};
	} /
	left_paren statement:statement right_paren{
		return statement;
	} /
	'然后' statement:statement{
		return statement;
	} /
	subject:player? ('必须'/'须')? action:action{
		return {
			"语句类型":"普通语句",
			"主语":subject,
			"动作":action
		};
	} /
	subject:player? '可' '以'? action:action{
		return {
			'语句类型':"可选执行语句",
			'主语':subject,
			'动作':action
		};
	} /
	'若' if_condition:if_condition {
		return {
			"语句类型":"条件语句",
			"条件": if_condition
		};
	} /
	card_class:card_class '牌'{
		return {
			"语句类型":"条件判断",
			"条件": "此前提到的牌为固定类型",
			"类型":card_class
		};
	} /
	from:player '与' to:player '距离' modify:distance_modify{
		return {
			"语句类型":'距离修正',
			"源":from,
			"目标":to,
			"修正":modify
		};
	} /
	var_name:var_name '为' player:player player_property:player_property{
		return {
			'语句类型':'变量定义',
			'变量名':var_name,
			'对象':player,
			'属性':player_property
		};
	} /
	var_name:var_name '为' '伤害点数'{
		return {
			'语句类型':'变量定义',
			'变量名':var_name,
			'对象':'此前提到的伤害',
			'属性':'点数'
		};
	} /
	'视为' player:player action:action{
		return {
			'语句类型': '视为动作',
			'对象': player,
			'动作': action
		};
	} /
	'若如此做' {
		return undefined;
	} /
	'称为' mark_name:mark_name{
		return {
			'语句类型':'标记定义',
			'标记名':mark_name
		};
	}

distance_modify =
	sign:[+-] number:number {
		return {
			"符号":sign,
			"数值":number
		};
	}	

has_card_or_not = 
	'有牌' {
		return true;
	} /
	'无牌' {
		return false;
	}

if_condition =
	'结果' compare_op:compare_op card_modifier:card_modifier {
		return {
			'判断类型':"判定结果判断",
			'操作符':compare_op,
			'修饰':card_modifier
		};
	} /
	area:area has:has_card_or_not {
		return {
			'判断类型':'区域内容判断',
			'区域':area,
			'是否有牌': has
		};
	} /
	player:player player_property:player_property compare_op:compare_op property_value:property_value{
		return {
			"判断类型":"角色属性判断",
			"角色":player,
			"属性":player_property,
			"判断符":compare_op,
			"值":property_value
		};
	} /
	'此牌' kind_op:kind_op card_class:card_class '牌'?{
		return {
			"判断类型":"卡牌类别判断",
			"对象":'之前提到的卡牌',
			"判断符":kind_op,
			"类别":card_class
		}
	} /
	player:player '武将牌' face:('正面'/'背面') '朝上'{
		return {
			"判断类型":'角色属性判断',
			'角色':player,
			'属性':'翻面状态',
			'朝上的面':face
		};
	}

player_property = 
	'体力值' / '已损失体力值' / '数'

kind_op =
	'为' {
		return '=';
	} /
	'不为' {
		return '!=';
	}

card_class = 
	name:('装备' / '武器' / '防具' / '坐骑' / '锦囊'){
		return name;
	}

compare_op = 
	('为' / '=') {
		return '=';
	} /
	('不为' / '≠') {
		return '!=';
	} /
	("大于" / '>') {
		return '>'
	} /
	("小于" / '<') {
		return '<'
	} /
	('不大于' / '小于或等于' / '<=' / '⩽') {
		return '<=';
	} /
	('不小于' / '大于或等于' / '>=' / '⩾') {
		return '>=';
	}

property_value =
	number:number {
		return {
			"数字":number
		};
	}

pre_adverbial =
	'不能' {
		return {
			'状语类型':'禁止'
		};
	} /
	'于' timespan:timespan '内'{
		return {
			'状语类型':'时间限定',
			'时间':timespan
		}
	}

post_adverbials =
	post_adverbial:post_adverbial second_post_adverbials:second_post_adverbial*{
		var post_adverbials = new Array();
		post_adverbials.push(post_adverbial);
		post_adverbials = post_adverbials.concat(second_post_adverbials);

		return post_adverbials;
	}

post_adverbial =
	'无距离限制' {
		return {
			'状语类型':'距离限定',
			'距离':'无限'
		};
	} /
	limit:('额定次数上限' / '额外次数上限') op:number_linear_op x:number{
		return {
			'状语类型':'上限修正',
			'上限':limit,
			'操作':op,
			'增减值':x
		};
	} /
	'结算完毕后' {
		return {
			'状语类型':'时间限定',
			'限定':'结算完毕后'
		};
	}

second_post_adverbial =
	'且' post_adverbial:post_adverbial{
		return post_adverbial;
	} 

timespan =
	'此回合'{
		return {
			'时段类型':'此回合',
		};
	} /
	'此阶段'{
		return {
			'时段类型':'此阶段',
		};
	} /
	player:player '回合'{
		return {
			'时段类型':'某角色的回合',
			'角色':player
		};
	} /
	phrase_name:phrase_name '阶段' {
		return{
			'时段':'阶段',
			'阶段名':phrase_name
		};
	}

action = 
	'受到' player:player '造成' damage:damage{
		return {
			'动作类型':'受到伤害',
			'伤害来源':player,
			'伤害':damage
		};
	} /
	'对' player:player '造成' damage:damage{
		return {
			'动作类型':'造成伤害',
			'目标':player,
			'伤害':damage
		}
	} /
	'判定' {
		return {
			'动作类型':'判定'
		};
	} /
	'放弃' what:'摸牌' {
		return {
			'动作类型':'放弃获取资源',
			'资源':'摸牌'
		};
	} /
	'观看牌堆顶' x:number '张牌'{
		return {
			'动作类型':'观看牌堆顶的牌',
			'数量':x
		};
	} /
	'视为' action:action{
		return {
			'动作类型':'视为操作',
			'视为操作':action
		};
	} /
	pre_adverbials:pre_adverbial+ action:action post_adverbials:post_adverbials?{
		var adverbials = new Array();
		adverbials = adverbials.concat(pre_adverbials);
		if(post_adverbials != '')
			adverbials = adverbials.concat(post_adverbials);

		action['状语'] = adverbials;
		return action;
	} /
	'回复' number:number '点体力' {
		return {
			"动作类型":"普通动作",
			"动词":'回复',
			"恢复值": number
		};
	} /
	'翻面' {
		return {
			"动作类型":"普通动作",
			'动词':'翻面'
		};
	} /
	'打出' card:card card_usage:card_usage{
		return {
			'动作类型':'打出卡牌',
			'卡牌':card,
			'作用':card_usage
		}
	} /
	op:('使用/打出' / '使用或打出' / '使用' / '打出') card:card post_adverbials:post_adverbials?{
		return {
			'动作类型':"卡牌操作",
			'操作':op,
			'卡牌':card
		};
	} /
	'令' player:player action:action{
		return {
			"动作类型":"使动动作",
			"对象":player,
			"动作":action
		};
	} /
	'选择' decision:decision{
		return {
			"动作类型":"选择动作",
			"决定":decision
		};
	} /
	'选择' player:player{
		return {
			'动作类型':'选择角色',
			'角色':player
		};
	} /
	'选择一项' colon? options:option+{
		return {
			"动作类型":"多选动作",
			"可选项":options
		}
	} /
	'亮出牌堆顶' number:number '张牌'{
		return{
			"动作类型":"亮出牌堆顶的牌",
			"张数":number
		};
	} /
	'将' card:card ('置入' / '置于') destination:area{
		return {
			"动作类型":"卡牌置入处理",
			"目的地":destination,
			"卡牌":card
		};
	} /
	modifier:'依次'? '将' card:card '任意分配' {
		return {
			'动作类型':'卡牌任意分配',
			'卡牌':card,
			'是否依次': modifier == '' ? false : true
		};
	} /
	buff:('多'/'少') '摸' number:number '张牌'{
		return {
			'动作类型':'额外摸牌处理',
			'符号': buff == '多' ? '+' : '-',
			'数量':number
		};
	} /
	'防止此伤害'{
		return {
			'动作类型':'普通动作',
			'动作':'防止之前提到的伤害'
		};
	} /
	'获得' object:(card / mark){
		return {
			'动作类型':'普通动作',
			'动作':'获得',
			'宾语':object
		};
	} /
	'摸' number:number '张'? '牌'{
		return {
			'动作类型':'摸牌',
			'数量':number
		}
	} /
	'弃置' card:card{
		return {
			'动作类型':'弃置',
			'弃置卡牌':card
		};
	} /
	'执行以下操作' x:number '次' statements:statements{
		return {
			'动作类型':'执行多次操作',
			'次数':x,
			'操作':statements
		};
	}

card_usage =
	'代替' card:card{
		return {
			'卡牌作用':'代替卡牌',
			'卡牌':card
		};
	}

option =
	literal_number:literal_number "." statements:statements{
		return {
			"序号":literal_number,
			"语句":statements
		};
	}

number_linear_op =
	number_increment / number_decrement

number_increment = 
	'加' {
		return '+';
	} / 
	'+'

number_decrement =
	'减' {
		return '-';
	} /
	'-'

literal_number =
	digits:[1-9]+ {
		return parseInt(digits.join(""), 10);
	} / 
	number:[一二三四五六七八九十] {
		var numbers = "一二三四五六七八九十";
		return numbers.indexOf(number)+1;
	} /
	'两' {
		return 2;
	}

number = 
	literal_number /
	var_name:var_name{
		return {
			'数值类型':'变量',
			'变量名':var_name
		}
	}

var_name =
	[A-Z]

decision = 
	'是否打出【闪】'

damage = 
	damage_modifier:damage_modifier '伤害'{
		return {
			"对象类型":"伤害",
			"修饰":damage_modifier
		};
	}

terminal_card = 
	mark_name:mark_name{
		return {
			'卡牌限定':'标记',
			'标记':mark_name
		};
	} /
	card_name:card_name {
		return {
			'卡牌限定':'名称限定',
			'名称':card_name
		};
	} /
	'牌' {
		return false;
	} /
	'手牌'{
		return {
			'卡牌限定':'位置限定',
			'位置':'手牌'
		}
	}

card =
	'之' {
		return {
			'卡牌限定':'之前提到的卡牌'
		}
	} /
 	card_modifier:card_modifier* terminal_card:terminal_card second_card:second_card? {
		if(terminal_card)
			card_modifier.push(terminal_card);

		if(second_card == ''){
			return {
				'对象类型':'卡牌',
				'卡牌限定':card_modifier
			};
		}else{
			var card1_modifier = card_modifier.pop();
			if(card1_modifier == undefined){
				return {
					'对象类型':'卡牌二元组',
					'卡牌1限定':card_modifier,
					'卡牌2限定':second_card['卡牌限定']
				};				
			}else{
				return {
					'对象类型':'卡牌二元组',
					'共同限定':card_modifier,
					'卡牌1限定':card1_modifier,
					'卡牌2限定':second_card['卡牌限定']
				};
			}
		}
	}

mark =
	mark_modifier:mark_modifier '枚' mark_name:mark_name '标记'{
		return {
			'对象类型':'标记',
			'标记名':mark_name,
			'标记限定':mark_modifier
		};
	}

mark_modifier =
	number

mark_name =
	left_quote name:[^\u0022\u300D\u201D]+ right_quote {
		return name;
	}

second_card =
	'/' card:card {
		return card;
	}

area =
	where:('场上' / '牌堆顶' / '弃牌堆' / '武将牌上') { 
		return {
			'区域':where,
		};
	} /
	player:player where:('区域里' / '装备区') {
		return {
			'区域':'角色区域里',
			'角色':player,
			'区域':where
		};
	} 

card_modifier =
	area:area {
		return {
			'卡牌限定':'位置限定',
			'位置':area
		};
	} /
	'至少' x:number '张'{
		return {
			'卡牌限定':'数量下限',
			'下限':x
		};
	} /
	'点数和' compare_op:compare_op x:number{
		return {
			'卡牌限定':'点数和限定',
			'比较符号':compare_op,
			'比较数':x
		};
	} /
	'所有' {
		return undefined;
	} /
	'造成此伤害' / 
	'其中' {
		return {
			'卡牌限定':'范围限定',
			'范围':'此前提到的多张牌',
		};
	} /
	'其余' /
	number:number '张' {
		return {
			'卡牌限定':'数量限定',
			'数量':number
		};
	} / 
	card_class:card_class{
		return {
			'卡牌限定':'类型限定',
			'类型':card_class
		};
	} /
	card_color:card_color {
		return {
			'卡牌限定':'颜色限定',
			'颜色':card_color
		};
	} /
	card_suit:card_suit{
		return {
			'卡牌限定':'花色限定',
			'花色':card_suit
		};
	} /
	'被弃置' /
	player:player {
		return {
			'卡牌限定':'拥有者限定',
			'拥有者':player
		};
	} /
	'此'

card_suit =
	('♠' / '黑桃') {
		return '黑桃';
	} /
	('♥' / '红桃' / '红心') {
		return '红桃';
	} /
	('♣' / '梅花' / '草花') {
		return '梅花';
	} /
	('♦' / '方块' / '方片') {
		return '方块';
	}

card_color =
	'红色' / '黑色' / '无色'

card_name =
	'【' name:[^】]+ '】'{
		return name.join();
	}

punctuation =
	comma / period / semicolon / colon

comma =
	"," / "，"

period =
	"。"

semicolon =
	";" / '；'

colon =
	':' / '：'

left_quote =
	'"' / '「' / '“'

right_quote =
	'"' / '」' / '”'

// end
player =
	'伤害'? '来源'{
		return {
			'角色':'伤害来源'
		}
	} /
	you:'你' {
		return {
			"角色":"你"
		};
	} /
	lord:'主公' {
		return {
			"角色":"主公"
		};
	} /
	player_modifiers:player_modifier+ '角色' {
		return {
			"角色":"普通角色",
			"修饰":player_modifiers
		};
	} /
	'其'{
		return {
			"角色":"代词",
			"指代":"上一次提到的角色"
		};
	}

player_modifier =
	'有手牌' {
		return {
			'角色修饰':'手牌数目限定',
			'操作符': '>',
			'数目':0
		};
	} /
	'每名'{
		return {
			'角色修饰':'范围限定',
			'范围':'所有符合条件的角色'
		};
	} /
	kingdom:kingdom '势力' {
		return {
			"角色修饰":"势力限定",
			"势力":kingdom
		};
	} /
	'其他' {
		return {
			"角色修饰":"排除自己"
		};
	} /
	min:number '至' max:number '名'{
		return {
			'角色修饰':'数量限定',
			'下限':min,
			'上限':max
		};
	} /
	x:number '名'{
		return {
			'角色修饰':'数量限定',
			'数目':x
		};
	} /
	'至少' x:number '名'{
		return {
			'角色修饰':'数量限定',
			'下限':x
		};
	} /
	'至多' x:number '名'{
		return {
			'角色修饰':'数量限定',
			'上限':x
		};
	} /
	'距离为' number:number {
		return {
			'角色修饰':"距离限定",
			'距离':number
		};
	} 

kingdom = 
	'魏' / '蜀' / '吴' / '群'

event =
	event:("受到伤害后" / '受到伤害时' / '需要使用/打出【闪】时' / '死亡时' / '翻面后' / '需要使用【酒】时' / '受到伤害结算结束后') {
		return {
			"事件类型":event,
		}
	} /
	"受到" damage_modifier:damage_modifier "伤害后" {
		return {
			"事件类型":"受到伤害后",
			"修饰":damage_modifier
		}
	} /
	phrase_name:phrase_name '阶段' endpoint:('开始时'/'结束时')?{
		return {
			'事件类型':'阶段触发',
			'哪个阶段':phrase_name,
			'开始还是结束':endpoint == '' ? '开始时' : endpoint
		};
	} /
	card_modifiers:card_modifier* what:('判定牌生效前' / '判定牌生效后' / '判定牌置入弃牌堆后' / '牌置入弃牌堆后') {
		return {
			'事件类型':what,
			'判定牌修饰':card_modifiers
		};
	} /
	action:action '时'?{
		return {
			'事件类型':'执行操作',
			'动作':action
		};
	}

phrase_name =
	'准备' / '判定' / '摸牌' / '出牌' / '弃牌' / '结束'

damage_modifier =
	number:number '点' {
		return {
			"修饰类型":"伤害修饰",
			"伤害点数":number
		};
	}

left_paren =
	'(' / '（'

right_paren =
	')' / '）'

