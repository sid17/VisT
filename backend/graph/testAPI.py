import yaml,json,requests
def PostWeaverQuery(query,number):
		query={'query':query,'number':number}
		myport=5000
		data=json.dumps(query)
		myURL = "http://127.0.0.1:%s/graph/getNode/" % (myport)
		headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
		r = requests.get(myURL, data=data,headers=headers)
		response=yaml.safe_load(r.text)
		print response
PostWeaverQuery('ayush',1)