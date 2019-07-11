# Introduction
The REST API is implemented for the new [GOKb Client](https://github.com/openlibraryenvironment/gokb-ui)
and covers all needed services to implement the Application as a Single Page Application (SPA).

# General
* request header should contain `Accept: application/json`
* add `Authorization: Bearer` to the request header with the token from login has to be set to use
the API - except LOGIN/REGISTER
* use status code 200 to mark that the operation has been successful,
  400 to mark a bad request, 401 for authorization failure
* use method GET to request a resource, POST to create a resource, 
  PUT/PATCH to update a resource and DELETE to delete a resource
* ![](http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/32/Actions-dialog-ok-apply-icon.png) marks implemented methods
* ![](http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/32/Actions-dialog-close-icon.png) marks not yet implemented or wrong implemented methods

<!--------------------------------------------------------------------------------------------------------------------->
# LOGIN ![](http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/32/Actions-dialog-ok-apply-icon.png)
## Request 
    POST ./rest/login
### Request Payload
````sear
{
  "username": "?",
  "password": "?"
}
````
## Response
````
Status Code: 200

{
  "username": "?",
  "expires_in": 3600,
  "roles":["?"],
  "token_type":"Bearer",
  "access_token": "?",
  "refresh_token": "?"
}
````
````
Status Code: 401  

-
````

# REFRESH TOKEN ![](http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/32/Actions-dialog-ok-apply-icon.png)
## Request 
````
POST ./oauth/access_token
````

### Query String Parameters
````
grant_type=refresh_token
refresh_token="?"
````

## Response
see LOGIN
  
# LOGOUT
## Request 
````
GET ./logoff  
````

![](http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/32/Actions-dialog-close-icon.png) should be a POST, not a GET.
## Response
![](http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/32/Actions-dialog-close-icon.png) No Response, instead we get redirected to /.

# REGISTER ![](http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/32/Actions-dialog-close-icon.png)
## Request
````
POST ./rest/register
````
### Request Payload
````
{
  "username": "?",
  "email":"?",
  "password":"?",
  "password2":"?"
}
````
## Response
````
Status Code: 200
````
````
Status Code: 400
````

<!--------------------------------------------------------------------------------------------------------------------->  
# Load Profile
## Request 
````
GET ./home/profile
````
### Query String Parameters
````
format=json
````
![](http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/32/Actions-dialog-close-icon.png)
We should check, if we could get rid of this parameter simply by using the header.    
## Response
````
Status Code: 200

{
  "id": ?,
  "email": "?",
  "curatoryGroups": [
     {
       "name": "?",
       "id": ?,
       "uuid": "?"
     }, ...
  ]
}
````

# Create Profile ![](http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/32/Actions-dialog-close-icon.png)
## Request 
````
POST ./home/profile
````
### Query String Parameters
````
format=json
````
### Request Payload
````
{
  "email": "?",
  "curatoryGroups": [
     {
       "id": ?
     }, ...
  ]
}
````
## Response
````
Status Code: 201

Location: ./home/profile/<id>
````

# Update Profile ![](http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/32/Actions-dialog-close-icon.png)
## Request 
````
PUT ./home/profile/<id>
````
### Query String Parameters
````
format=json
````
### Request Payload
````
{
  "email": "?",
  "curatoryGroups": [
     {
       "id": ?
     }, ...
  ]
}
````
## Response
````
Status Code: 200
````
<!--------------------------------------------------------------------------------------------------------------------->
# Load User
## Request 
````
GET ./rest/users/<id>
````
## Response
````
Status Code: 200

{
}
````
# Create User
## Request 
````
POST ./rest/users
````
### Request Payload
````
````
## Response
````
Status Code: 201

Location: ./rest/users/<id>
````
# Update User 
## Request 
````
PUT ./rest/users/<id>
````
### Request Payload
````
````
## Response
````
Status Code: 200
````

<!--------------------------------------------------------------------------------------------------------------------->
# Load Package
## Request 
````
GET ./rest/packages/<id>
````
## Response
````
Status Code: 200
````
# Create Package
## Request 
````
POST ./rest/packages
````
### Request Payload
````
````
## Response
````
Status Code: 201

Location: ./rest/packages/<id>
````
# Update Package
## Request 
````
PUT ./rest/packages/<id>
````
### Request Payload
````
````
## Response
````
Status Code: 200
````
<!--------------------------------------------------------------------------------------------------------------------->

<!--------------------------------------------------------------------------------------------------------------------->
# Load Identifier
## Request 
````
GET ./rest/identifiers/<id>
````
## Response
````
Status Code: 200
````
# Create Identifier
## Request 
````
POST ./rest/identifiers
````
### Request Payload
````
````
## Response
````
Status Code: 201

Location: ./rest/identifiers/<id>
````
# Update Identifier
## Request 
````
PUT ./rest/identifiers/<id>
````
### Request Payload
````
````
## Response
````
Status Code: 200
````
<!--------------------------------------------------------------------------------------------------------------------->

Organization
Platform
Provider
Title
Review
Curatory Group




<!---
![](http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/32/Actions-dialog-ok-apply-icon.png)
![](http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/32/Actions-dialog-close-icon.png)

# Load User
## Request 
````
GET ./rest/users/<id>
````
## Response
````
Status Code: 200

{
}
````
# Create User
## Request 
````
POST ./rest/users
````
### Request Payload
````
````
## Response
````
Status Code: 201

Location: ./rest/users/<id>
````
# Update User 
## Request 
````
PUT ./rest/users/<id>
````
### Request Payload
````
````
## Response
````
Status Code: 200
````

https://www.predic8.de/post-put-patch-beispiel.htm
--->
