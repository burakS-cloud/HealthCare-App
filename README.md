# HealthCare-Web-App
*Hospital web application that user, doctor user types that can seperately authenticate and can do different operations based on their user type and authorization.*

This was my fullstack project experience and also first graduation project of the computer engineering program that i was studying at.

### Features:
          * Different authentication & authorization for different type of users (users, doctors).
          * Appointment creating functionality.
          * The created appointments can be seen by the user and can be cancelled whenever they wish to.
          * The patient's appointments can be seen from the corresponding doctor's perspective.
          * Doctors can cancel the appointments, as well as deleting them all together. Only doctors can delete the appointments.
          * Cancelled appointments can be seen by the users and doctors on a dedicated page for each of them, separately.

To run the project on your machine, make sure you have node.js and mongoDB installed & configured ( add path environment variable ). Then all you have to do is run 'npm install' command in the terminal, it will download all the dependencies needed.

Project's live url: https://pacific-lake-98495.herokuapp.com/

To register and login as a doctor, please type in the following:

To register: https://pacific-lake-98495.herokuapp.com/doctors/registerDoc
To login: https://pacific-lake-98495.herokuapp.com/doctors/loginDoc

