exports.models = {
  "User":{
    "id":"User",
    "required": ["username","password"],
    "properties":{
      "username":{
        "type":"string",
        "description": "A user of the application"
      },
      "password":{
        "type":"string",
        "description":"Password for the user"
      }
    }
  }
}
