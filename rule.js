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
	statements:statement_with_punc+ period? { 
		return statements;
	}

statement_with_punc = 
	statement:statement (comma/semicolon)?{
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
	card_class:card_class {
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
	'此牌' kind_op:kind_op card_class:card_class{
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
	name:('装备' / '武器' / '防具' / '坐骑' ) '牌'{
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
	}

property_value =
	number:number {
		return {
			"数字":number
		};
	}

action = 
	'回复' number:number '点体力' {
		return {
			"动作类型":"恢复体力",
			"恢复值": number
		};
	} /
	verb:verb object:object?{
		return {
			"动作类型":"普通动作",
			"动词":verb,
			"宾语":object
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
	'将' object:object placement:placement{
		return {
			"动作类型":"卡牌处理",
			"处理":placement,
			"对象":object
		}
	} 

placement = 
	'置入' ('弃牌堆' / '一名角色的装备区')

option =
	number:number "." action:action (semicolon / period) {
		return {
			"序号":number,
			"动作":action
		};
	}

number = 
	number:[1-9] {
		return parseInt(number);
	} / 
	number:[一二三四五六七八九十] {
		var numbers = "一二三四五六七八九十";
		return numbers.indexOf(number)+1;
	} /
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

object =
	card_modifiers:card_modifier_with_de* '牌'{
		return {
			"对象类型":"卡牌",
			"修饰":card_modifiers
		};
	} /
	damage_modifier:damage_modifier '伤害'{
		return {
			"对象类型":"伤害",
			"修饰":damage_modifier
		}
	}

verb = 
	'获得' /
	'摸' / 
	'翻面' / 
	'弃置' / 
	'防止' 

card_modifier_with_de =
	card_modifier:card_modifier '的'? {
		return card_modifier;
	}

card_modifier =
	'所有' /
	'每名其他角色区域里的' / 
	'造成此伤害' / 
	'其中的' / 
	'至少一张点数和不大于13' / 
	'其余' / 
	'装备' /
	'其距离为1的一名角色的区域里的一张' / 
	'其' /
	number:number '张' {
		return {
			'卡牌修饰':'数量修饰',
			'数量':number
		};
	}

card_name =
	'【' name:[^】] '】'{
		return {'卡牌名':name};
	}

// punctuation
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
	kingdom:kingdom '势力' {
		return {
			"角色修饰":"势力限定",
			"势力":kingdom
		};
	} /
	'其他' {
		return {
			"角色修饰":"排除限定"
		};
	} /
	number:number '名'{
		return {
			'角色修饰':"数量限定",
			'数量':number
		};
	}

kingdom = 
	'魏' / '蜀' / '吴' / '群'

event =
	event:("受到伤害后" / '受到伤害时' / '需要使用/打出【闪】时' / '死亡时') {
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
	phrase_name:phrase_name '阶段' endpoint:('开始'/'结束') '时'{
		return {
			'事件类型':'阶段触发',
			'哪个阶段':phrase_name,
			'开始还是结束':endpoint
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

