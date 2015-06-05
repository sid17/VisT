import hashlib
from weaver import client
import json
c = client.Client('128.84.167.152', 2002)

def _get_unique_id(node_handle):
    m = hashlib.md5(node_handle.encode())
    return str(str(int(m.hexdigest(), 16))[0:16])

def ProcessNodeData(dataObj,name):
    data=dict(dataObj)
    data['id']=_get_unique_id(name)
    data['caption']=name
    data['type']=data['labels'][0][1:]
    return data

def ProcessEdgeData(edge,edgeProperties):
    props=dict(edgeProperties)
    if 'directionVal' in edgeProperties:
        if edgeProperties['directionVal']=='B':
            props['source']=_get_unique_id(edge.end_node)
            props['target']=_get_unique_id(edge.start_node)
        else:
            props['source']=_get_unique_id(edge.start_node)
            props['target']=_get_unique_id(edge.end_node)
    else:
        props['source']=_get_unique_id(edge.start_node)
        props['target']=_get_unique_id(edge.end_node)

    props['type']=edge.properties['label'][0]
    props['handle']=edge.handle
    return props


def getNodeEdge(name='phone',num=5,edgeProperties={}):
    retVal=dict()
    retVal['nodes']=list()
    retVal['edges']=list()
    nodeList=list()
    nodename=name

    try:
        onehop=c.traverse(nodename).out_edge(edgeProperties).node().execute()
        print 'Node Found, traversing one hop neighbors'
    except client.WeaverError:
        return False

    nodeOb=c.get_node(node=name)
    retVal['nodes'].append(ProcessNodeData(nodeOb.properties,name))
    counter=0
    nodeList.append(name)

    for node in onehop:
        counter=counter+1
        nodeOb=c.get_node(node=node)
        data=dict(nodeOb.properties)
        retVal['nodes'].append(ProcessNodeData(nodeOb.properties,node))
        nodeList.append(node)
        if counter==num:
            break

    edges=c.get_edges(node=nodename,properties=edgeProperties.items())

    for edge in edges:
        if edge.start_node in nodeList and edge.end_node in nodeList:
            retVal['edges'].append(ProcessEdgeData(edge,edgeProperties))

    return retVal

if __name__ == "__main__":
    print getNodeEdge()

        
