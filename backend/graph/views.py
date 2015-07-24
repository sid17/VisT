from django.http import HttpResponse
import json
from threading import Lock
from weaverGetNode import *
clientLock=Lock()
import unicodedata
def getNode(request):
	val=unicodedata.normalize('NFKD', dict(request.GET)['query'][0]).encode('ascii','ignore').strip()
	number=int(unicodedata.normalize('NFKD', dict(request.GET)['number'][0]).encode('ascii','ignore'))
	result={}
	print val,number
	with clientLock:
		result=getNodeEdge(name=val,num=number)
		print result
	if result:
		result['nodes'][0]['root']='true'
	else:
		result={}
	print result
	return HttpResponse(json.dumps(result), content_type="application/json")
