import os
import json,yaml
import subprocess
with open('config.json') as f:
	data=f.read()
	jsonData=yaml.safe_load(json.dumps(json.loads(data)))
os.system('cp config.json frontend/app/scripts/config.json ')
os.chdir('frontend/')
os.system('grunt serve > gruntLog 2>&1 & ')
os.chdir('../')
os.chdir('backend/')
os.system('./manage.py runserver {0}:{1} > djangoLog 2>&1 1>&1 &'.format(jsonData['djangoIP'],jsonData['djangoPort']))
os.chdir('../')

print 'Please wait till the server is initialised'

startedFrontEnd=False
while not startedFrontEnd:
	try:
		subprocess.check_output("lsof -i :"+str(4242), shell=True)
		startedFrontEnd=True
	except:
		startedFrontEnd=False
print 'Front End Server started'

startedBackEnd=False
while not startedBackEnd:
	try:
		subprocess.check_output("lsof -i :"+str(5000), shell=True)
		startedBackEnd=True
	except:
		startedBackEnd=False
print 'Back End Server started'


