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
			pair('动词',verb),
			pair('宾语',object)
		];
	}

object =
	modifier:modifier? '的'? something:something{
		return [
			pair('修饰', modifier),
			pair('对象', something)
		];
	}

modal_verb =
	'可以' / '必须'

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
	you

you = 
	'你'

happened =
	"受到伤害后" / '需要使用/打出【闪】时'

comment = 
	( ('(' / '(') [^)]* (')' / '）') ){
		return undefined;
	}
