skill =
	skill_spec:skill_type* condition:condition? statements:statements{
		return {
			"技能类型": skill_spec,
			"发动条件": condition,
			"执行效果": statements
		};
	}

skill_type =
	type:('主公技' / '锁定技' / '限定技' / '觉醒技') comma{
		return type;
	}

condition =
	when:when? player:player? event:event comma? {
		return {
			"目标": player,
			"事件": event
		};
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
	from:player '与' to:player '的距离' modify:distance_modify{
		return {
			"语句类型":'距离修正',
			"源":from,
			"目标":to,
			"修正":modify
		};
	} /
	var_name:var_name '为' player:player '的'? player_property:player_property{
		return {
			'语句类型':'变量定义',
			'变量名':var_name,
			'角色':player,
			'属性':player_property
		};
	} /
	original_thing:thing '视为' view_as_thing:thing{
		return {
			'语句类型':'视为语句',
			'原始物件':original_thing,
			'视为物件':view_as_thing
		};
	} /
	'若如此做' {
		return undefined;
	}

thing =
	'其打出的【闪】结算完毕后' / '你使用/打出此【闪】'

distance_modify =
	sign:[+-] number:number {
		return {
			"符号":sign,
			"数值":number
		};
	}	
	
if_condition =
	'至少一名其他角色的区域里有牌' /
	player:player player_property:player_property compare_op:compare_op property_value:property_value{
		return {
			"判断类型":"角色属性判断",
			"对象":player,
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
	}

player_property = 
	'体力值' / '已损失的体力值'

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
	'为' {
		return '=';
	} /
	'不为' {
		return '!=';
	} /
	"大于" {
		return '>'
	} /
	"小于" {
		return '<'
	} /
	'不大于' {
		return '<=';
	} /
	'不小于'{
		return '>=';
	}

property_value =
	number:number {
		return {
			"数字":number
		};
	}

adverbial =
	'于此回合内' / '不能'

action = 
	adverbial:adverbial+ action:action{
		action['状语'] = adverbial;
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
	op:('使用或打出' / '使用') card:card{
		return {
			'动作类型':"普通动作",
			'动词':op,
			'宾语':card
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
	'选择一项' colon? options:option+{
		return {
			"动作类型":"多选动作",
			"可选项":options
		}
	} /
	'亮出牌堆顶的' number:number '张牌'{
		return{
			"动作类型":"亮出牌堆顶的牌",
			"张数":number
		};
	} /
	'将' card:card '置入' destination:destination{
		return {
			"动作类型":"卡牌置入处理",
			"目的地":destination,
			"对象":card
		};
	} /
	buff:('多'/'少') '摸' number:number '张牌'{
		return {
			'动作类型':'额外摸牌处理',
			'符号': buff == '多' ? '+' : '-',
			'数量':number
		};
	} /
	'防止' damage:damage{
		return {
			'动作类型':'普通动作',
			'动作':'防止',
			'宾语':damage
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
	}

destination =
	'弃牌堆' / '一名角色的装备区'

option =
	literal_number:literal_number "." statements:statements{
		return {
			"序号":literal_number,
			"语句":statements
		};
	}

literal_number =
	digits:[1-9]+ {
		return parseInt(digits.join(""), 10);
	} / 
	number:[一二三四五六七八九十] {
		var numbers = "一二三四五六七八九十";
		return numbers.indexOf(number)+1;
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

card =	
	card_modifier:card_modifier* '的'? '牌' second_card:second_card? {
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
	'【' name:[^】] '】' {
		return name;
	}

second_card =
	'/' card:card {
		return card;
	}

area =
	'场上'{
		return {
			'区域':'场上',
		};
	} /
	player:player '的'? '区域里'{
		return {
			'区域':'角色区域里',
			'角色':player
		};
	}

card_modifier =
	area:area '的'? {
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
	'点数和' compare_op:compare_op x:number '的'{
		return {
			'卡牌限定':'点数和限定',
			'比较符号':compare_op,
			'比较数':x
		};
	} /
	'所有' /
	'造成此伤害' / 
	'其中的' {
		return {
			'卡牌限定':'范围限定',
			'范围':'此前提到的多张牌',
		};
	} /
	'其余' / 
	'其' /
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
	} 

card_color =
	'红色' / '黑色' / '无色'

card_name =
	'【' name:[^】] '】'{
		return {'卡牌名':name};
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

// end

when = 
	'当'

player =
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
	number:number '名'{
		return {
			'角色修饰':"数量限定",
			'数量':number
		};
	} /
	'距离为' number:number '的'{
		return {
			'角色修饰':"距离限定",
			'距离':number
		};
	}

kingdom = 
	'魏' / '蜀' / '吴' / '群'

event =
	event:("受到伤害后" / '受到伤害时' / '需要使用/打出【闪】时' / '死亡时' / '翻面后') {
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
	'的' card_modifiers:card_modifier* '判定牌生效后' {
		return {
			'事件类型':'判定牌生效',
			'判定牌修饰':card_modifiers
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
	} /
	'此' {
		return {
			"修饰类型":"伤害修饰",
			"伤害指代":"之前提到的伤害"
		};
	}

left_paren =
	'(' / '（'

right_paren =
	')' / '）'

