import json,yaml
with open('config.json') as f:
	data=f.read()
	jsonData=yaml.safe_load(json.dumps(json.loads(data)))
print jsonData