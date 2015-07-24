import os
import json,yaml
import subprocess

def changeGruntFile(host,port):
	import re
	pattern1 = re.compile("port:")
	pattern2 = re.compile("hostname:")
	contents=""
	for i, line in enumerate(open('frontend/Gruntfile.js')):
		portFound=False
		hostFound=False
		for match in re.finditer(pattern1, line):
			# print 'Found port on line %s: %s' % (i+1, match.groups(0))
			contents=contents+line.split('port')[0]+'port: {0} ,'.format(str(port))+'\n'
			portFound=True
		for match in re.finditer(pattern2, line):
			# print 'Found hostname on line %s: %s' % (i+1, match.groups(0))
			contents=contents+line.split('hostname')[0]+'hostname: "{0}" ,'.format(str(host))+'\n'
			hostFound=True
		if not portFound and not hostFound:
			contents=contents+line
	with open('frontend/Gruntfile.js','w') as f:
		f.write(contents)

with open('config.json') as f:
	data=f.read()
	jsonData=yaml.safe_load(json.dumps(json.loads(data)))

changeGruntFile(jsonData['angularIP'],jsonData['angularPort'])
print 'Starting angular server at',jsonData['angularIP'],jsonData['angularPort']
print 'Starting django server at',jsonData['djangoIP'],jsonData['djangoPort']
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


