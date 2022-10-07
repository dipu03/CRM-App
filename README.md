
# CRM(Customer Relationship Managements) Application.

This is a back-end Project using Node.js and Express, in which user can register and raises a ticket with the details of their issue about the product. There is 3-types of user as ADMIN, CUSTOMER and ENGINEER. Admin is a super user, can do any type of operation that allow in our project. Customer only can raise their issue and update their issue. Engineer is responsible to track and update ticket status as the issue resolve or still in progress.
Also a Notification service is added, to notify the customer as their ticket created or updated.


# Features
### Account creation

- You can create accounts for user as well as Engineer.
- If the user is a customer, the account will automatically be approved on verification.
- In case of Engineer, an admin will have to approve the account.
- JSON Web Token used for authentication.
- Users can also update some details like name, password and email.
- Admin can update additional details like userType and userStatus.
- User search is also available for users with proper authorization.	
	

### Ticket API
-	All user can raise or create a ticket
-	For ticket Updating a customer can update his/her own ticket 
-	Engineer can update his/her ticket also the assigned ticket
-	Admin can update all ticket
-	Customer can fetch his/her all ticket
-	Engineer also fetch own ticket and assigned ticket
-	Admin can fetch all ticket


# Dependencies

**Language:** Javascript


**Server:** Node.js, Express

**npm modules:**
jsonwebtoken,
node-rest-client,
dotenv,
body-parser,
bcryptjs

**Database:** MongoDB, mongoose

**external applications:**
notification service application






# API Reference

## User creation and operations

- #### Sign-up

``` http
  POST /crm/api/v1/auth/signup
```
Register user with name, userId, email, password and user type.


- #### Sign-in

``` http
  POST /crm/api/v1/auth/signin
```
User Sign-in using userId and password.


- #### Get all users (Query params userType and userStatus supported)

``` http
  GET /crm/api/v1/users
```
An admin can get a list of all users. The list can also be filtered by userType and userStatus.


- ####	Get user by userId
``` http
GET /crm/api/v1/users/:id
```
A user or an admin can get the data of the user by userId.


- ####	Update user data
``` http
PUT /crm/api/v1/users/:id
```
A user or an admin can update the data of the user by userId.



## Ticket APIs


- ####	Create a Ticket
``` http
POST /crm/api/v1/create/tickets
```
A register user can create a ticket.


- ####	Find all Tickets
``` http
GET/crm/api/v1/tickets
```
Any user can fetch all their tickets.


- ####	Update a Ticket
``` http
PUT/crm/api/v1/tickets/:id	
```
Any user can update their ticket details.




## Run Locally

Clone the project

```bash
  git clone https://github.com/dipu03/CRM-App.git
```

Go to the project directory

```bash
  cd CRM-App
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```




