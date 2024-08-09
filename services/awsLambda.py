import json
import boto3
from datetime import datetime, timezone
from botocore.exceptions import ClientError
from decimal import Decimal
from boto3.dynamodb.conditions import Key
from boto3.dynamodb.conditions import Attr
# Initialize the DynamoDB client
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
dynamodb_table = dynamodb.Table('usersTable')

status_check_path = '/status'
user_path = '/user'
users_path = '/users'
user_session_path = '/user/sessions'
user_session_comments_path = '/user/sessions/comments'
user_session_likes_path = '/user/sessions/likes'
user_following_path = '/user/following'
user_followers_path = '/user/followers'
user_pfp_path = '/user/pfp'
user_comment_likes_path = '/user/sessions/comments/likes'
user_specific_session_path = '/user/session'
user_noti_path = '/user/notis'
user_exercises_path = '/user/exercises'

# This lambda handler takes in an event and context
# and generates a response depending on the specified path.
# an error is sent to the response on error
def lambda_handler(event, context):
    print('Request event: ', event)
    response = None
   
    # generates the response and calls a function based on the path and http_method
    try:
        http_method = event.get('httpMethod')
        path = event.get('path')

        if http_method == 'GET' and path == status_check_path:
            response = build_response(200, 'Service is operational')
            
        elif http_method == 'GET' and path == user_path:
            user_id = event['queryStringParameters']['userID']
            response = get_user(user_id)
            
        elif http_method == 'GET' and path == user_session_path:
            user_id = event['queryStringParameters']['userID']
            response = get_user_sessions(user_id)
             
        elif  http_method == 'GET' and path == user_session_comments_path:
            user_id = event['queryStringParameters']['userID']
            session_id = event['queryStringParameters']['sessionID']
            response = get_session_comments(user_id, session_id)
            
        elif  http_method == 'GET' and path == user_session_likes_path:
            user_id = event['queryStringParameters']['userID']
            session_id = event['queryStringParameters']['sessionID']
            response = get_session_likes(user_id, session_id)
            
        elif  http_method == 'GET' and path == user_following_path:
            user_id = event['queryStringParameters']['userID']
            response = get_user_following(user_id)
            
        elif  http_method == 'GET' and path == user_followers_path:
            user_id = event['queryStringParameters']['userID']
            response = get_user_followers(user_id)
            
        elif http_method == 'GET' and path == users_path:
            query = event['queryStringParameters']['q']
            response = get_users(query)
            
        elif http_method == 'GET' and path == user_pfp_path:
            user_id = event['queryStringParameters']['userID']
            response = get_user_pfp(user_id)
            
        elif http_method == 'GET' and path == user_specific_session_path:
            user_id = event['queryStringParameters']['userID']
            session_id = event['queryStringParameters']['sessionID']
            response = get_specific_session(user_id, session_id)
            
        elif http_method == 'GET' and path == user_noti_path:
            user_id = event['queryStringParameters']['userID']
            response = get_notis(user_id)
            
        elif http_method == 'GET' and path == user_exercises_path:
            user_id = event['queryStringParameters']['userID']
            session_id = event['queryStringParameters']['sessionID']
            response = get_exercise_info(user_id, session_id)
            
        elif http_method == 'POST' and path == user_path:
            response = post_user(json.loads(event['body']))
            
        elif http_method == 'PATCH' and path == user_comment_likes_path:
            user_id = event['queryStringParameters']['userID']
            session_id = event['queryStringParameters']['sessionID']
            comment_index = event['queryStringParameters']['index']
            body = json.loads(event['body'])
            response = append_comment_likes(user_id, session_id, comment_index, body)
            
        elif http_method == 'PATCH' and path == user_path:
            user_id = event['queryStringParameters']['userID']
            body = json.loads(event['body'])
            session_key = body.get('sessionKey')
            session_data = body.get('sessionData')
            response = append_user_session(user_id, session_key, session_data)
              
        elif http_method == 'PATCH' and path == user_session_comments_path:
            user_id = event['queryStringParameters']['userID']
            session_id = event['queryStringParameters']['sessionID']
            body = json.loads(event['body'])
            response = append_session_comment(user_id, session_id, body)
            
        elif http_method == 'PATCH' and path == user_session_likes_path:
            user_id = event['queryStringParameters']['userID']
            session_id = event['queryStringParameters']['sessionID']
            body = json.loads(event['body'])
            response = append_session_likes(user_id, session_id, body)
            
        elif http_method == 'PATCH' and path == user_following_path:
            user_id1 = event['queryStringParameters']['userID1']
            user_id2 = event['queryStringParameters']['userID2']
            body = json.loads(event['body'])
            response = append_user_following_followers(user_id1, user_id2, body)
            
        elif http_method == 'PATCH' and path == user_noti_path:
            user_id = event['queryStringParameters']['userID']
            body = json.loads(event['body'])
            response = append_to_notis(user_id, body)
            
        elif http_method == 'DELETE' and path == user_path:
            body = json.loads(event['body'])
            response = delete_user(body['userID'])
        else:
            response = build_response(404, '404 Not Found')

    except Exception as e:
        print('Error:', e)
        response = build_response(400, 'Error processing request')
   
    return response

def get_exercise_info(user_id, session_id):
    """
    get_exercise_info returns a response of a user's exercises

    :param user_id: The unique identifier of the user.
    :param session_id: The unique identifier of the session.
    :return: This function returns a response with the exercises of a user
    """
    try:
        response = dynamodb_table.get_item(Key={'userID': user_id})
        user_data = response.get('Item', {})
        respList = [] # will hold a list of responses that contain a PR field, and an exerciseInfo field
        
        sessions = user_data.get('sessions', {})
        exercises = user_data.get('exercises', {}) # exercise list for a user
        if session_id in sessions:
            session_data = sessions[session_id] # got correct session
        
            for exercise in session_data['exercises']: # exercise list for session
                 resp = {}
                 resp['name'] = exercise
                 resp['PR'] = exercises[exercise]['PR'] # setting up response obj with appropriate fields...
                 resp['exerciseInfo'] = exercises[exercise]['sessions'][session_id]
                 respList.append(resp)
        
            return build_response(200, respList) 
        else:
            return build_response(404, f"Session {session_id} not found")
    except ClientError as e:
        print('Error:', e)
        return build_response(400, e.response['Error']['Message'])
   
    
def get_notis(user_id):
    """
    get_notis returns a response of a user's notifications

    :param user_id: The unique identifier of the user.
    :return: This function returns a response with the notifications corresponding to a user_id
    """
    try:
        response = dynamodb_table.get_item(Key={'userID': user_id})
        user_data = response.get('Item', {})
        notis = user_data.get('notis', {})
        return build_response(200,  notis) # returns the list of notis
    except ClientError as e:
        print('Error:', e)
        return build_response(400, e.response['Error']['Message'])
   

def append_to_notis(user_id, body):
    """
    append_to_notis appends a notification to a user's notification field

    :param user_id: The unique identifier of the user.
    :param body: The JSON body
    :return: This function returns a response after appending the notification to a user
    """
    try:
        response = dynamodb_table.update_item(
            Key={'userID': user_id},
            UpdateExpression='SET notis = list_append(notis, :new_comment)',
            ExpressionAttributeValues={
                ':new_comment': [body],
            },
            
            ReturnValues='UPDATED_NEW')
        
        body = {
            'Operation': 'UPDATE',
            'Message': 'SUCCESS',
            'UpdatedAttributes': response
        }
        return build_response(200, response)
    except ClientError as e:
        print('Error:', e)
        return build_response(400, e.response['Error']['Message'])
    
def append_user_following_followers(user_id1, user_id2, body):
    """
    append_user_following_followers appends userID2 to the following list of userID1, and append userID1 to the followers list of userID2 

    :param user_id: The unique identifier of user1.
    :param user_id: The unique identifier of user2.
    :return: This function returns a response with both the following and followers list of userID1 and userID2 updated
    """
    try:
        current_time = datetime.now(timezone.utc).isoformat()
       
        # append userID2 to the following list of userID1
        response = dynamodb_table.update_item(
            Key={'userID': user_id1},
            UpdateExpression='SET following = list_append(following, :new_user)',
            ConditionExpression='attribute_not_exists(following) OR NOT contains(following, :user_id2)',
            ExpressionAttributeValues={
                ':new_user': [body['userID2']], 
                ':user_id2': user_id2
            },
            
            ReturnValues='UPDATED_NEW')
        
        # append userID1 to the followers list of userID2
        dynamodb_table.update_item(
            Key={'userID': user_id2},
            UpdateExpression='SET followers = list_append(followers, :new_user)',
            ConditionExpression='attribute_not_exists(followers) OR NOT contains(followers, :user_id1)',
            ExpressionAttributeValues={
                ':new_user': [body['userID1']],  
                ':user_id1': user_id1
            },
            ReturnValues='UPDATED_NEW')
        
         # update notificatons list to get a FOLLOW REQUEST notification
        dynamodb_table.update_item(
            Key={'userID': user_id2},
            UpdateExpression='SET notis = list_append(notis, :new_noti)',
            ExpressionAttributeValues={
                ':new_noti': [{'userID': user_id1, 'date': current_time, 'sessionID': '', 'type': 1}],  
            },
            ReturnValues='UPDATED_NEW')
        
        body = {
            'Operation': 'UPDATE',
            'Message': 'SUCCESS',
            'UpdatedAttributes': response
        }
        return build_response(200, response)
    except ClientError as e:
        error_code = e.response['Error']['Code']
        if error_code == 'ConditionalCheckFailedException':
            return build_response(200, {'Message': 'User already in the list'})
        elif error_code == 'ValidationException':
            return build_response(400, 'Invalid data format')
        elif error_code == 'ItemCollectionSizeLimitExceededException':
            return build_response(400, 'Item size limit exceeded')
        
def append_comment_likes(user_id, session_id, comment_index, body):
    """
    append_comment_likes returns a response of a user's exercises

    :param user_id: The unique identifier of the user.
    :param session_id: The unique identifier of the session.
    :param comment_index: The index of a comment(number).
    :param body: The body (JSON).
    :return: This function returns a response with the body after appending  a like to the specified comment
    """
    try:
        comment_index = int(comment_index)
        response = dynamodb_table.update_item(
            Key={'userID': user_id},
            UpdateExpression='SET sessions.#session_id.comments[%d].likes = list_append(sessions.#session_id.comments[%d].likes, :new_like)' % (comment_index, comment_index),
            ExpressionAttributeNames={
                '#session_id': session_id
            },
            ExpressionAttributeValues={
                ':new_like': [body['userID']],  # Use the body directly as the new like
            },
            ReturnValues='UPDATED_NEW'
        )
        body = {
            'Operation': 'UPDATE',
            'Message': 'SUCCESS',
            'UpdatedAttributes': response
        }
        return build_response(200, response)
    except ClientError as e:
        print('Error:', e)
        return build_response(400, e.response['Error']['Message'])
    
def get_user_pfp(user_id):
    """
    get_user_pfp returns a response that contains the pfp url of the user

    :param user_id: The unique identifier of the user.
    :return: This function returns a response containing the pfp url
    """
    try:
        response = dynamodb_table.get_item(Key={'userID': user_id})
        user_data = response.get('Item', {})
        pfp = user_data.get('pfp', {})
        return build_response(200, pfp) # returns pfp url
    except ClientError as e:
        print('Error:', e)
        return build_response(400, e.response['Error']['Message'])

   
def append_session_comment(user_id, session_id, body):
    """
    append_session_comment

    :param user_id: The unique identifier of the user.
    :param session_id: The unique identifier of the session.
    :param session_data: JSON data.
    :return: This function appends session(JSON) to the user's sessions field
    """
    current_time = datetime.now(timezone.utc).isoformat()
    try:
        # if session_id in sessions:
        response = dynamodb_table.update_item(
            Key={'userID': user_id},
            UpdateExpression='SET sessions.#session_id.comments = list_append(sessions.#session_id.comments, :new_comment)',
            ExpressionAttributeNames={
                '#session_id': session_id
            },
            ExpressionAttributeValues={
                ':new_comment': [body]  # Use the body directly as the new comment
            },
            ReturnValues='UPDATED_NEW'
        )
        if user_id != body['userID']:
            dynamodb_table.update_item(
                Key={'userID': user_id},
                UpdateExpression='SET notis = list_append(notis, :new_noti)',
                ExpressionAttributeValues={
                    ':new_noti': [{'userID': body['userID'], 'date': current_time, 'sessionID': session_id, 'type': 3}],  
                },
                ReturnValues='UPDATED_NEW'
            )
        
        body = {
            'Operation': 'UPDATE',
            'Message': 'SUCCESS',
            'UpdatedAttributes': response
        }
        return build_response(200, response)
    except ClientError as e:
        print('Error:', e)
        return build_response(400, e.response['Error']['Message'])
        
def append_session_likes(user_id, session_id, body):
    """
    append_session_likes

    :param user_id: The unique identifier of the user.
    :param session_id: The unique identifier of the session.
    :param body: JSON data.
    :return: This function appends likes to a user's session
    """
    current_time = datetime.now(timezone.utc).isoformat()
    user_id2 = session_id.split('session')[0]
    user_id1 = body['userID']

    try:
        response = dynamodb_table.update_item(
            Key={'userID': user_id},
            UpdateExpression='SET sessions.#session_id.likes = list_append(if_not_exists(sessions.#session_id.likes, :empty_list), :new_like)',
            ExpressionAttributeNames={
                '#session_id': session_id
            },
            ExpressionAttributeValues={
                ':new_like': [body['userID']],  # Use the body directly as the new like
                ':empty_list': []
            },
            ReturnValues='UPDATED_NEW'
        )
        if user_id1 != user_id:
            dynamodb_table.update_item(
                Key={'userID': user_id2},
                UpdateExpression='SET notis = list_append(notis, :new_noti)',
                ExpressionAttributeValues={
                    ':new_noti': [{'userID': user_id1, 'date': current_time, 'sessionID': session_id, 'type': 2}],  
                },
                ReturnValues='UPDATED_NEW'
            )
        body = {
            'Operation': 'UPDATE',
            'Message': 'SUCCESS',
            'UpdatedAttributes': response
        }
        return build_response(200, response)
    except ClientError as e:
        print('Error:', e)
        return build_response(400, e.response['Error']['Message'])
        
def append_user_session(user_id, session_key, session_data):
    """
    append_user_session 

    :param user_id: The unique identifier of the user.
    :param session_key: The unique identifier of the session.
    :param session_data: JSON data.
    :return: This function appends session(JSON) to the user's sessions field
    """
    current_time = datetime.now(timezone.utc).isoformat()
    
    try:
        response = dynamodb_table.update_item(
          Key={'userID': user_id},
            UpdateExpression='SET sessions.#session_key = :session_data',
            ExpressionAttributeNames={
                '#session_key': session_key
            },
            ExpressionAttributeValues={
                ':session_data': session_data
            },
            ReturnValues='UPDATED_NEW'
        )
        dynamodb_table.update_item(
            Key={'userID': user_id},
            UpdateExpression='SET notis = list_append(notis, :new_noti)',
            ExpressionAttributeValues={
                ':new_noti': [{'userID': user_id, 'date': current_time, 'sessionID': session_key, 'type': 4}],  
            },
            ReturnValues='UPDATED_NEW'
        )
        body = {
            'Operation': 'UPDATE',
            'Message': 'SUCCESS',
            'UpdatedAttributes': response
        }
        return build_response(200, response)
    except ClientError as e:
        print('Error:', e)
        return build_response(400, e.response['Error']['Message'])

def get_user_following(user_id):
    """
    get_user_following returns a response that contains the user_ids of everyone who the user is following.
    The response will be extracted from the user_id located in the table.

    :param user_id: user_id is a unique identifier for a user.
    :return: This function returns a response with all the user_ids of those who the user is following.
    """
    try:
        response = dynamodb_table.get_item(Key={'userID': user_id})
        user_data = response.get('Item', {})
        following = user_data.get('following', {}) # returns the following list
        return build_response(200,  following)
    except ClientError as e:
        print('Error:', e)
        return build_response(400, e.response['Error']['Message'])
        
        
def get_user_followers(user_id):
    """
    get_user_followers returns a response that contains the user_ids of everyone who are following the user.
    The response will be extracted from the user_id located in the table.

    :param user_id: user_id is a unique identifier for a user.
    :return: This function returns a response with all the user_ids of those who are following the user.
    """
    try:
        response = dynamodb_table.get_item(Key={'userID': user_id})
        user_data = response.get('Item', {})
        followers = user_data.get('followers', {})
        return build_response(200,  followers) # returns the followers list
    except ClientError as e:
        print('Error:', e)
        return build_response(400, e.response['Error']['Message'])
    

def get_user(user_id):
    """
    get_user returns a response that contains information about a user from
    the DynamoDB table. The response will be extracted from the user_id located in the table.

    :param user_id: user_id is a unique identifier for a user.
    :return: This function returns a response with information from the DynamoDB table.
    """
    try:
        response = dynamodb_table.get_item(Key={'userID': user_id})
        return build_response(200, response.get('Item'))
    except ClientError as e:
        print('Error:', e)
        return build_response(400, e.response['Error']['Message'])

def get_session_comments(user_id, session_id):
    """
    get_session_comments returns a response that contains information about all the comments for a session.
    The response will be extracted from the user_id & session_id located in the table.

    :param user_id: user_id is a unique identifier for a user.
    :param session_id: user_id is a unique identifier for a user's session.
    :return: This function returns a response with all the comments for a session.
    """
    try:
        response = dynamodb_table.get_item(Key={'userID': user_id})
        user_data = response.get('Item', {})
        sessions = user_data.get('sessions', {})
        
        if session_id in sessions:
            session_data = sessions[session_id] # gets session corresponding to session_id
            comments = session_data.get('comments', {}) # grab the comments map, and return the response
            return build_response(200, comments) 
        else:
            return build_response(404, f"Session {session_id} not found")
    
    except ClientError as e:
        print('Error:', e)
        return build_response(400, e.response['Error']['Message'])
        
def get_session_likes(user_id, session_id):
    """
    get_session_likes returns a response that contains the user_ids of everyone who liked a session.
    The response will be extracted from the user_id & session_id located in the table.

    :param user_id: user_id is a unique identifier for a user.
    :param session_id: user_id is a unique identifier for a user's session.
    :return: This function returns a response with all the user_ids of those who liked a session.
    """
    try:
        response = dynamodb_table.get_item(Key={'userID': user_id})
        user_data = response.get('Item', {})
     
        sessions = user_data.get('sessions', {})
        
        if session_id in sessions:
            session_data = sessions[session_id] # gets session corresponding to session_id
            likes = session_data.get('likes', {}) # grab the likes map, and return the response
            return build_response(200, likes)
        else:
            return build_response(404, f"Session {session_id} not found")
    except ClientError as e:
        print('Error:', e)
        return build_response(400, e.response['Error']['Message'])
     
def get_specific_session(user_id, session_id):
    """
    get_specific_session returns a user's specific session
    
    :param user_id: user_id is a unique identifier for a user.
    :param session_id: user_id is a unique identifier for a user's session.
    :return: This function returns a response that contains the session corresponding to user_id & session_id
    """
    try:
        response = dynamodb_table.get_item(Key={'userID': user_id})
        user_data = response.get('Item', {})
        sessions = user_data.get('sessions', {})

        if session_id in sessions:
            session_data = sessions[session_id]
            session_data['likes'] = session_data['likes'][:3] # only getting 1st 3 chars]
            session_data['numLikes'] = len(session_data['likes'])
           
            return build_response(200, session_data)
        else:
            return build_response(404, f"Session {session_id} not found")
    except ClientError as e:
        print('Error:', e)
        return build_response(400, e.response['Error']['Message'])
        
def get_user_sessions(user_id):
    """
    get_user_sessions returns a response that contains information about all the sessions from a user.
    The response will be extracted from the user_id located in the table.

    :param user_id: user_id is a unique identifier for a user.
    :return: This function returns a response with information about all sessions of a user from the DynamoDB table.
    """
    try:
        response = dynamodb_table.get_item(Key={'userID': user_id})
        user_data = response.get('Item', {})
        sessions = user_data.get('sessions', {})
        # gets a specific session for each session key, modify session_data
        for session_id, session_data in sessions.items():
            if 'likes' in session_data:
                session_data['numLikes'] = len(session_data['likes'])
                session_data['likes'] = session_data['likes'][:3]
                session_data['comments'] = len(session_data['comments'])
            
        return build_response(200, sessions)
        
    except ClientError as e:
        print('Error:', e)
        return build_response(400, e.response['Error']['Message'])
 
def get_users(query):
    """
    get_users returns a response that contains {id, name, pfp} of all users who contain the query param
    the DynamoDB table. The response will be extracted from the user_id located in the table.

    :param query: user input
    :return: This function returns a response containing {id, name, pfp} for all users containing the query
    """
    userList = []
    queryLower = query.lower()
    # comparing searchName and queryLower, both are lowercase
    try:
        response = dynamodb_table.scan(
            FilterExpression=Attr('searchName').begins_with(queryLower)
        )
        users = response['Items']
        # go thru each elt in users, create a user(type), and add this to a list
        # return this list in response.
        # a user type has the following: {name: string, pfp: string, and id(userID): string}
        for item in users:
            user = {
                'id': item.get('userID', ''),
                'name': item.get('name', ''),
                'pfp': item.get('pfp', '')
            }
            userList.append(user)
        
        return build_response(200, userList)
    except ClientError as e:
        print('Error:', e)
        return build_response(400, e.response['Error']['Message'])

def scan_dynamo_records(scan_params, item_array):
    response = dynamodb_table.scan(**scan_params)
    item_array.extend(response.get('Items', []))
   
    if 'LastEvaluatedKey' in response:
        scan_params['ExclusiveStartKey'] = response['LastEvaluatedKey']
        return scan_dynamo_records(scan_params, item_array)
    else:
        return {dynamodb_table.name: item_array}

def post_user(request_body):
    """
    post_user posts a user to the DynamoDB table, and returns the body as a response

    :param request_body: JSON
    :return: This function returns a response containing {id, name, pfp} for all users containing the query
    """
    try:
        dynamodb_table.put_item(
            Item=request_body,
            ConditionExpression="attribute_not_exists(userID)"
        )
        
        body = {
            'Operation': 'SAVE',
            'Message': 'SUCCESS',
            'Item': request_body
        }
        return build_response(200, body)
    except ClientError as e:
        print('Error:', e)
        return build_response(400, e.response['Error']['Message'])

def delete_user(user_id):
    """
    delete_user deletes a user from the DynamoDB table

    :param user_id: user_id is a unique identifier for a user.
    :return: This function delete a user from the DB and returns the body
    """
    try:
        response = dynamodb_table.delete_item(
            Key={'userID': user_id},
            ReturnValues='ALL_OLD'
        )
        body = {
            'Operation': 'DELETE',
            'Message': 'SUCCESS',
            'Item': response
        }
        return build_response(200, body)
    except ClientError as e:
        print('Error:', e)
        return build_response(400, e.response['Error']['Message'])

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            # Check if it's an int or a float
            if obj % 1 == 0:
                return int(obj)
            else:
                return float(obj)
        # Let the base class default method raise the TypeError
        return super(DecimalEncoder, self).default(obj)

def build_response(status_code, body):
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': json.dumps(body, cls=DecimalEncoder)
    }