import re
pattern1 = re.compile("port:")
pattern2 = re.compile("hostname:")
contents=""
for i, line in enumerate(open('frontend/Gruntfile.js')):
	portFound=False
	hostFound=False
	for match in re.finditer(pattern1, line):
		print 'Found port on line %s: %s' % (i+1, match.groups(0))
		contents=contents+line.split('port')[0]+'port: {0} ,'.format('will change')+'\n'
		portFound=True
	for match in re.finditer(pattern2, line):
		print 'Found hostname on line %s: %s' % (i+1, match.groups(0))
		contents=contents+line.split('hostname')[0]+'hostname: {0} ,'.format('will change')+'\n'
		hostFound=True
	if not portFound and not hostFound:
		contents=contents+line
with open('frontend/Gruntfile.js','w') as f:
	f.write(contents)
