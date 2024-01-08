# Dentist_Service

## Getting started

Our service is designed for the general public to book appointments with dentists. To facilitate appointments, we require dentists to create appointment slots within the system. Dentists are critical stakeholders in the system, and we've developed this service for them to sign up, log in, and modify their information.

## Technology used

Instead of traditional CRUD methods through HTTP, we've opted to use MQTT for communication between systems. <br>

TODO:
(You can just copy paste whatever you wrote on user-service)

- MQTT is chosen for its low bandwidth usage, real-time communication, and asynchronous messaging, making it well-suited for efficient and timely updates in distributed systems like dentist appointment management.
- MQTT offers low bandwidth usage, real-time communication, asynchronous messaging, reliability, persistent connections, scalability, and a small code , making it ideal for distributed systems handling appointments with several independent components which required communication.
- MQTT may pose security concerns if not configured properly, lacks inherent statefulness, is not designed for strict request-response interactions, and might require a learning curve for development teams unfamiliar with the publish/subscribe paradigm.

## The controllers

Various functionalities such as creating accounts, modifying them, logging in, and updating accounts require controllers to manage them. Therefore, we've implemented controllers for dentists with several methods (endpoints).<br>

### CreateDentist Method

The createDentist method is designed to allow administrators to add new dentists to the system. When an administrator invokes this method, they provide essential details such as the dentist's name, email address, Social Security Number (SSN), affiliated clinic, and information regarding whether the dentist has administrative privileges. This information is crucial for maintaining a comprehensive database of dentists within the system. The method is secured to only allow administrators to execute it, ensuring proper access control.<br>

### Login Method

The login method is responsible for authenticating dentists into the system. Dentists can log in by providing their email address and password. The system verifies the provided credentials against the stored information in the database. Successful authentication allows the dentist to access personalized features and functionalities within the system. The email address serves as the unique identifier during the login process, ensuring the correct dentist's account is retrieved.<br>

### GetDentist Method

The getDentist method facilitates the retrieval of a specific dentist's information from the database. Dentists are identified based on their email address. This method is particularly useful after a successful login. When a dentist logs in, the system uses their email address to fetch the corresponding dentist's details, ensuring that the correct information is displayed to the authenticated user. <br>

### DeleteDentist Method

The deleteDentist method enables administrators to remove a dentist from the system. It requires the dentist's ID as a parameter for identification. If the provided ID matches a valid dentist in the system, the method proceeds to delete the corresponding dentist's record. However, if the provided ID is invalid or doesn't exist in the database, the system throws an "Invalid ID" error. <br>
### UpdateDentist Method

The updateDentist method allows dentists to modify their information within the system. Dentists can update details such as their name, email address, SSN, affiliated clinic, and administrative privileges. This functionality ensures that the system's database reflects the most accurate and up-to-date information about each dentist. <br>

## Test

Through the gitlab ci/cd pipeline system, our project is automatically tested whenever a new commit is pushed to the remote repository. <br>
Our group has decided to use jest as the features for the unit testing. <br>

### CI pipeline

Our pipeline uses node version 18 as the image because that's what our project is using. <br>
It is consisted of two stages which are the "build stage" and the "test stage". <br>

#### Build Stage

Just like the normal pipelines, we just install the npm dependencies to the gitlab shared runner.

#### Test Stage

We currently have only the unit tests. The script npm tun test:ci is used to test the whole project. <br>
In the future, integration test stage may be implemented as well.

### Tests for Create Dentist

#### Should throw "Input missing data, All data required" when more then one mandatory data is missing.

To avoid extremely long test time, we have decided to only test the case where the user forgot to provide the password information. <br>
When one of the mandatory data is missing, our system throws a message exception that says "Input missing data, All data required". <br>
Therefore, we test if the messageExceptionError is caught as an instance of MessageException and if the message of it is the same as expected. <br>

#### Should throw "Forbidden" when a nonadmin tries to create a dentist.

We test to figure out whether the system throws the error "Forbidden" when a non admin tries to register a dentist. <br>
We expect to receive a MessageException with the error code 403 and message "Forbidden". <br>

### Tests for Create Dentist DB

#### Should throw "Dentist already exists" when an existing dentist is trying to be registered.

We test to figure out whether the system throws the error "Dentist already exists" when a dentist that already exists is trying to be registered. <br>
We expect to receive a MessageException with the error code 403 and message "Dentist already exists". <br>

#### Should check if the password has been hashed before being saved to our DB.

We test to figure out whether the hash function has been called with the provided password and whether it has been called only once. <br>

### Tests for Delete Dentist

#### Should delete the dentist when an admin requests with the right dentist id

We test to figure out whether the system deletes an existing dentist from the DB when an admin requests to delete the dentist with the correct id. <br?>

#### Should throw "Invalid id" when given a wrong dentistID.

We test to figure out whether the system throws the error "Invalid id" when the given id is not registered in our database. <br>
We expect to receive a MessageException with the error code 400 and message "Invalid id" <br>

### Tests for Login Dentist

#### Should throw "Invalid data type" when the provided password type is not a string.

We test to figure our whether the system throws the error "Invalid data type" when the given password is in a non-string format. <br>
We expect to receive a MessageException "Invalid Data type" when provided a password in a format such as Number. <br>

#### Should throw "All input is required" when either email or SSN is not provided.

We test to figure out whether the system throws the error "All input is required" when the SSN or Email is not provided. <br>
We expect to receive a MessageException "All input is required". <br>

### Tests for Get Dentist

#### Should throw "Invalid user ID" when the provided a user id that does not exist in our DB.

We test to figure out whether the system throws the error "Invalid user ID" when the given id is not registered in our database. <br>
We expect to receive a MessageException with the error code 400 and message "Invalid user ID". <br>

#### Should return the dentist if found in our DB.

We test to figure out whether the system returns the dentist information when a correct dentist id is provided. <br>
We expect the result of the method getDentist to be the same as the mockDentist. <br>

## Contributions

#### Dentists-Controller & Dentist Schema

Ahmed Ebrahim Ahmed Al Gabri has created all of the methods for the dentists-controller and dentistSchema.

#### Jest Tests & CI Pipeline

David Boram Hong(guscholcda@student.gu.se) has created all of the tests and CI pipeline.

#### DentistDocumentation

David Boram Hong(guscholcda@student.gu.se) and Tehreem ASif (gusasite@student.gu.se) has taken care of all the documentation for this service.