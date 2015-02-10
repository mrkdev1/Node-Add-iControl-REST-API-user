Demonstrates how an admin on the BIG-IP can add a new partition and then add a new user on that partition with permissions
to use the iControl REST API.  The new user is made a Manager and added to "/mgmt/shared/authz/roles/iControl_REST_API_User" 
to have sufficient permission to use the iControl REST API.

icU5.js - Example script

ictrlPart.json - JSON that specifies the new partition. In this example the new partition is named ictrl_part.
 
newUser.json - JSON that specifies the new user. In this example the new user's username is "ictrlUser". This file includes an 
"encryptedPassword" for the 'temporary password' used by the admin. The newUser.json in this example uses the string 
for the unencrypted password: "somePassword". This is a temporary password which the new user (a Manager) can change.

ictrlREST.json -  The value of "userReferences" used to add "ictrlUser" to the set of users having access to iControl REST API.

readme.txt - The readme file you are reading now.

After running icU5.js

node icU5.js

On the BIG-IP, there will be a new partition: ictrl_part and a new user, ictrlUser with access to use the iControl REST API.

The sample writes the following to the console:


Add JSON in ictrlPart.json to sys/folder

STATUS: 200

NEW PARTITION: ictrl_part



Add JSON in newUser.json to auth/user

STATUS: 200
NEW-USER: ictrlUser

temporary password: somePassword



Patch JSON in ictrlREST.json into iControl_REST_API_User

STATUS: 200

ACCESS to iControl REST API: ictrlUser



Verify new-user access to iControl REST API

CONFIRMED: New-user has access to the iControl REST API



EXAMPLE COMPLETE
      