from weaver import client
import json
from auth import APPCONFIGPARAMS
try:
    c = client.Client(APPCONFIGPARAMS['weaverIP'],int(APPCONFIGPARAMS['weaverPort']))
except:
    c=None
def dictElement(d):
    for key,val in d.iteritems():
        return key

def getWeaverProps(props):
    for key,val in props.iteritems():
        props[key]=val[0]
    return props

def ProcessNodeData(dataObj,name):
    data=getWeaverProps(dict(dataObj))
    data['__weaver__handle__']=name
    propName=APPCONFIGPARAMS["nodeTypes"]
    if propName in data:
        data['type']=data[propName]
    return data

def ProcessEdgeData(edge):
    props=getWeaverProps(dict(edge.properties))
    props['source']=edge.start_node
    props['target']=edge.end_node
    props['__weaver__handle__']=edge.handle
    propName=APPCONFIGPARAMS["edgeCategory"]
    if propName in props:
        props['type']=props[propName]
    return props

def getNodeEdge(name='ayush',num=5):
    if not c:
        print 'Client nor found'
        return False
    retVal=dict()
    retVal['nodes']=list()
    retVal['edges']=list()
    nodeList=list()
    nodename=name

    try:
        nodeOb=c.get_node(node=name)
        print 'Node Found, traversing one hop neighbors'
    except client.WeaverError:
        return False
    
    retVal['nodes'].append(ProcessNodeData(nodeOb.properties,nodename))
    nodeList.append(nodename)
    for edgeKey,edge in nodeOb.out_edges.iteritems():
        if not edge.end_node in nodeList:
            nodeList.append(edge.end_node)
        nodeOb=c.get_node(node=edge.end_node)
        retVal['nodes'].append(ProcessNodeData(nodeOb.properties,edge.end_node))
        retVal['edges'].append(ProcessEdgeData(edge))
        if len(nodeList) == num:
            break
    return retVal

if __name__ == "__main__":
    print getNodeEdge()

        
