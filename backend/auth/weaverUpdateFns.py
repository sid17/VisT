from weaver import client
import json
from auth import APPCONFIGPARAMS
c = client.Client(APPCONFIGPARAMS['weaverIP'],int(APPCONFIGPARAMS['weaverPort']))

def createNode(node):
	print 'Creating Node',node
	c.begin_tx()
	c.create_node(node)
	c.end_tx()
	return ""

def createEdge(source,target):
	print 'Creating Edge from {0} to {1}',source,target
	c.begin_tx()
	newEdge=c.create_edge(source,target)
	c.end_tx()
	return newEdge

def deleteEdge(handle):
	print 'delete Edge ',handle
	c.begin_tx()
	c.delete_edge(edge=handle)
	c.end_tx()
	return ""

def updateNode(props):
	print 'Update Node'
	if 'root' in props:
		del props['root']
	if 'id' in props:
		del props['id']
	if 'type' in props:
		del props['type']
	handle=props['__weaver__handle__']
	del props['__weaver__handle__']
	print props
	c.begin_tx()
	c.set_node_properties(node=handle,properties=props)
	c.end_tx()
	return ""

def updateEdge(props):
	if 'source' in props:
		del props['source']
	if 'target' in props:
		del props['target']
	if 'type' in props:
		del props['type']
	print props
	handle=props['__weaver__handle__']
	print handle
	del props['__weaver__handle__']
	print props
	c.begin_tx()
	c.set_edge_properties(edge=handle,properties=props)
	c.end_tx()
	return ""

def parseQuery(query):
	# {"type":"create","category":"node","props":{"__weaver__handle__":"c1","id":578584189}}
	query=json.loads(query)
	print query
	if query['type']=='create' and query['category']=='node':
		print 'Hello'
		return createNode(query['props']['__weaver__handle__'])
	elif query['type']=='create' and query['category']=='edge':
		return createEdge(query['props']['source'],query['props']['target'])
	elif query['type']=='delete':
		return deleteEdge(query['props']['__weaver__handle__'])
	elif query['type']=='update' and query['category']=='node':
		return updateNode(query['props'])
	elif query['type']=='update' and query['category']=='edge':
		return updateEdge(query['props'])
	else :
		print 'Unknown query'


	

