#!/usr/bin/env ruby

require 'json'

json_file = 'skills.json'

dict = JSON.parse(IO.read(json_file))

dict.each_value do |generals|
	generals.each do |g|
		skill_map = g['技能']

		for skill_name in skill_map.keys
			skill_content = skill_map[skill_name]
			skill_map[skill_name] = skill_content.gsub(',','，').sub(/[ ]+/,'').sub(/\n/, '')
		end
	end
end

IO.write(json_file, JSON.pretty_generate(dict))