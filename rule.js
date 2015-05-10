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
	statements: statement+ { return pair('执行效果', statements);}

statement =
	subject:target modal_verb:modal_verb? action:action comment*{
		return pair(
			'语句',
			[
				pair('主语', subject),
				pair('情态', modal_verb),
				pair('动作', action),
			]
		);
	}

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
	'获得'

something =
	card

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
	"受到伤害后" / '需要使用/打出【闪】时'

comment = 
	( ('(' / '(') [^)]* (')' / '）') ){
		return undefined;
	}
