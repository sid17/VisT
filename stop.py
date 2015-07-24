import subprocess
import os
import json,yaml
with open('config.json') as f:
	data=f.read()
	jsonData=yaml.safe_load(json.dumps(json.loads(data)))

def killAtPort(port):
	try:
		output = subprocess.check_output("netstat -lpn |grep :"+str(port), shell=True)
		output=output.split(' ')
		for i in output:
			if 'grunt' in i or 'python' in i:
				os.system('kill -9 '+i.split('/')[0])
	except:
		print 'Server at port '+str(port)+' is not running' 
killAtPort(jsonData['angularPort'])
killAtPort(jsonData['djangoPort'])