#!/usr/bin/env ruby

require 'json'

json_file = 'skills.json'

dict = JSON.parse(IO.read(json_file))

for kingdom in dict.keys
	generals = dict[kingdom]
	for g in generals
		skill_map = g['技能']

		for skill_name in skill_map.keys
			skill_content = skill_map[skill_name]
			skill_map[skill_name] = skill_content.gsub(',','，').sub(/[ ]+/,'').sub(/\n/, '')
		end
	end
end

IO.write(json_file, JSON.pretty_generate(dict))