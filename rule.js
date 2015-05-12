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
	when:when target:target event:event comma? {
		return {
			"目标": target,
			"事件": event
		};
	} 

statements =
	statements:statement_with_comment+ period? { 
		return statements;
	}

statement_with_comment = 
	statement:statement comment* comma?{
		return statement;
	}

statement =
	'然后' statement:statement{
		return statement;
	} /
	subject:target? modal_verb:modal_verb? action:action{
		return {
			"语句类型":"普通语句",
			"主语":subject,
			"情态":modal_verb,
			"动作":action
		};
	} /
	'若' if_condition:if_condition {
		return {
			"语句类型":"条件语句",
			"条件": if_condition
		};
	} /
	from:target '与' to:target '的距离' modify:distance_modify{
		return {
			"语句类型":'距离修正',
			"源":from,
			"目标":to,
			"修正":modify
		};
	}

distance_modify =
	sign:[+-] number:number {
		return {
			"符号":sign,
			"数值":number
		};
	}	
	
if_condition =
	'至少一名其他角色的区域里有牌'

action = 
	verb:verb object:object?{
		return {
			"动作类型":"普通动作",
			"动词":verb,
			"宾语":object
		};
	} /
	'令' target:target action:action{
		return {
			"动作类型":"使动动作",
			"对象":target,
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
	'置入弃牌堆'

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
	}

decision = 
	'是否打出【闪】'

object =
	card_modifiers:card_modifier_with_de* '牌'{
		return {
			"对象类型":"卡牌",
			"修饰":card_modifiers
		};
	}

modal_verb =
	'可以' / '必须' / '须'

verb = 
	'获得' / '摸' / '翻面'

card_modifier_with_de =
	card_modifier:card_modifier '的'? {
		return card_modifier;
	}

card_modifier =
	'一张' / '每名其他角色区域里的一张' / '造成此伤害' / '其中的' / '至少一张点数和不大于13' / '其余'

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

target =
	you:'你' {
		return {
			"角色类型":"你"
		};
	} /
	lord:'主公' {
		return {
			"角色类型":"主公"
		};
	} /
	player_modifiers:player_modifier+ '角色' {
		return {
			"角色类型":"普通角色",
			"修饰":player_modifiers
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
	}

kingdom = 
	'魏' / '蜀' / '吴' / '群'

event =
	event:("受到伤害后" / '需要使用/打出【闪】时') {
		return {
			"事件类型":event,
		}
	} /
	"受到" damage_modifier:damage_modifier "伤害后" {
		return {
			"事件类型":"受到伤害后",
			"修饰":damage_modifier
		}
	}

damage_modifier =
	number:number '点' {
		return {
			"修饰类型":"伤害修饰",
			"伤害点数":number
		};
	}

comment = 
	comment_start [^)）]* comment_end

comment_start =
	'(' / '（'

comment_end =
	')' / '）'

