{
	function pair(type,value){
		if(value){
			return {
				'type':type,
				'value':value,
			};
		}else{
			return null;
		}
	}
}

skill =
	skill_spec condition comma statements period?

skill_spec =
	skill_type:skill_type* {
		return pair('技能类型', skill_type);
	}

skill_type =
	type:('主公技' / '锁定技' / '限定技' / '觉醒技') comma{
		return type;
	}

condition =
	when:when target:target happened:happened {
		return pair(
			'发动条件', 
			[
				pair('目标', target),
				pair('事件', happened)
			]
		);
	}

statements =
	statements: (statement comment* comma?)+ { 
		return pair('执行效果', statements);
	}

statement =
	subject:target modal_verb:modal_verb? action:action{
		return pair(
			'普通语句',
			[
				pair('主语', subject),
				pair('情态', modal_verb),
				pair('动作', action),
			]
		);
	} /
	if_condition_statement /
	'然后' action:action {
		return pair(
			'然后语句',
			[
				pair('动作', action)
			]
		);
	}

if_condition_statement =
	'若' if_condition:if_condition {
		return pair('条件语句', [pair('条件', if_condition)]);
	}
	
if_condition =
	'至少一名其他角色的区域里有牌'

action = 
	verb:verb object:object?{
		return [
			pair('类型', '普通动作'),
			pair('动词',verb),
			pair('宾语',object)
		];
	} /
	'令' target:target action:action{
		return [
			pair('类型', '使动动作'),
			pair('使动对象', target), 
			pair('使动动作', action)
		];
	} /
	'选择' decision:decision{
		return [
			pair('决定', decision)
		];
	} /
	'选择一项' colon? options:option+{
		return [
			pair('类型', '作出选择'),
			pair('可选项', options)
		];
	}

option =
	number:number "." action:action (semicolon / period) {
		return [
			pair('类型','选项'),
			pair('序号', number),
			pair('动作', action)
		];
	}

number = 
	number:[1-9] {
		return Number.parseInt(number);
	} / 
	number:[一二三四五六七八九十] {
		var numbers = "一二三四五六七八九十";
		return numbers.indexOf(number)+1;
	}

decision = 
	'是否打出【闪】'

object =
	modifier:modifier? '的'? something:something{
		return [
			pair('修饰', modifier),
			pair('对象', something)
		];
	}

modal_verb =
	'可以' / '必须' / '须'

verb = 
	'获得' / '摸' / '翻面'

something =
	card_modifier? card /
	'每名其他角色区域里的一张牌'

card_modifier =
	'一张'

modifier =
	'造成此伤害'

card =
	'牌'

card_name =
	'【' name:[^】] '】'{
		return pair('卡牌名', name);
	}

// punctuation
comma =
	("," / "，"){
		return undefined;
	}

period =
	"。"{
		return undefined;
	}

semicolon =
	(";" / '；') {
		return undefined;
	}

colon =
	(':' / '：') {
		return undefined;
	}

// end

when = 
	'当'

target =
	you /
	lord / 
	modifier: player_modifier* '角色' {
		return pair('修饰', modifier);
	}

you = 
	'你'

lord = 
	'主公'

player_modifier =
	kingdom_specifier / other

other = 
	'其他'

kingdom_specifier = 
	kingdom:kingdom '势力' {
		return '势力=' + kingdom;
	}

kingdom = 
	'魏' / '蜀' / '吴' / '群'


happened =
	"受到" damage_modifier* "伤害后" {

	} / '需要使用/打出【闪】时'

damage_modifier =
	number '点'

comment = 
	( ('(' / '(') [^)]* (')' / '）') ){
		return undefined;
	}
