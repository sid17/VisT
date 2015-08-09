from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.views.decorators.csrf import csrf_exempt
from auth.models import Token
from auth.utils import json_response, token_required
from weaverUpdateFns import parseQuery
@csrf_exempt
def register(request):
    if request.method == 'POST':
        username = request.POST.get('username', None)
        password = request.POST.get('password', None)

        if username is not None and password is not None:
            try:
                user = User.objects.create_user(username, None, password)
            except IntegrityError:
                return json_response({
                    'error': 'User already exists'
                }, status=400)
            token = Token.objects.create(user=user)
            print 'success'
            return json_response({
                'token': token.token,
                'username': user.username
            })
        else:
            return json_response({
                'error': 'Invalid Data'
            }, status=400)
    elif request.method == 'OPTIONS':
        return json_response({})
    else:
        return json_response({
            'error': 'Invalid Method'
        }, status=405)

@csrf_exempt
def login(request):
    if request.method == 'POST':
        username = request.POST.get('username', None)
        password = request.POST.get('password', None)

        if username is not None and password is not None:
            user = authenticate(username=username, password=password)
            if user is not None:
                if user.is_active:
                    token, created = Token.objects.get_or_create(user=user)
                    return json_response({
                        'token': token.token,
                        'username': user.username
                    })
                else:
                    return json_response({
                        'error': 'Invalid User'
                    }, status=400)
            else:
                return json_response({
                    'error': 'Invalid Username/Password'
                }, status=400)
        else:
            return json_response({
                'error': 'Invalid Data'
            }, status=400)
    elif request.method == 'OPTIONS':
        return json_response({})
    else:
        return json_response({
            'error': 'Invalid Method'
        }, status=405)

@csrf_exempt
@token_required
def logout(request):
    if request.method == 'POST':
        request.token.delete()
        return json_response({
            'status': 'success'
        })
    elif request.method == 'OPTIONS':
        return json_response({})
    else:
        return json_response({
            'error': 'Invalid Method'
        }, status=405)


@csrf_exempt
@token_required
def process(request):
    if request.method == 'POST':
        print ('Authentic');
        query = request.POST.get('query', None)
        output=parseQuery(query)
        with open("weaverUpdates.LOG", "a") as myfile:
            myfile.write(query)
        return json_response({
            'status': 'success','handle':output
        })
    elif request.method == 'OPTIONS':
        return json_response({})
    else:
        return json_response({
            'error': 'Invalid Method'
        }, status=405)

def my_replace(match):
    match=match.group()
    print match
    return match[1:-2]+':'

@csrf_exempt
@token_required
def setconfig(request):
    if request.method == 'POST':
        print ('Authentic');
        query = request.POST.get('query', None)
        # config = request.POST.get('config', None)
        print (query)
        print type(query)
        print dir(query)
        # print (config)
        import os
        import os.path
        import yaml
        import json
        import re
        parentDir=os.path.abspath(os.path.join(os.path.dirname(os.path.realpath(__file__)), os.pardir))
        my_list = parentDir.split('/')
        my_list=my_list[0:-1]
        configFile="/".join(my_list)+'/frontend/app/scripts/config.json'
        print configFile
       
        # r=re.sub(r'\"[A-Za-z]+\":',my_replace,config)
        # print r

        with open(configFile,'w') as f:
            f.write(json.dumps(yaml.safe_load(json.dumps(json.loads(query)))))

        configFile="/".join(my_list)+'/config.json'
        print configFile
       
        # r=re.sub(r'\"[A-Za-z]+\":',my_replace,config)
        # print r

        with open(configFile,'w') as f:
            f.write(json.dumps(yaml.safe_load(json.dumps(json.loads(query)))))


        # json_data=open(configFile).read()
        # index=json_data.index('=')
        # print index
        # prefix=json_data[0:index]
        # # print prefix
        # suffix=json_data[index+1:]
        # print suffix
        # CONFIG = json.loads(suffix)
        # print CONFIG
        # query= yaml.safe_load(query)
        # for key,val in query.iteritems():
        #     print key,val
        
        # print ppDir
        # with open("weaverUpdates.LOG", "a") as myfile:
        #     myfile.write(query)
        return json_response({
            'status': 'success'
        })
    elif request.method == 'OPTIONS':
        return json_response({})
    else:
        return json_response({
            'error': 'Invalid Method'
        }, status=405)
