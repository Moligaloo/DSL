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
	condition comma statements period?

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
	subject:target modal_verb:modal_verb? action:action {
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

// punctuation
comma =
	"," / "，"

period =
	"。"

// end

when = 
	'当'

target =
	you

you = 
	'你'

happened =
	"受到伤害后"
