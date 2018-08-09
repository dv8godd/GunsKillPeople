# GunsKillPeople
Development area for PWA of same name.

## Getting Started...

### app-server/configuration.php
The *configuration.php* file in this location will need to be configured to connect to the database. There are two functions that the script understands, each of which will return a specific data set in JSON format.  Visiting */index.php?func=congress* will produce contact, address, and other data for congressmen.  Visiting */index.php?func=schootings* will produce a list of shootings by year with subsets of data linking each to congressmen that can also be cross-referneced with the first data set.

### app.js
In the top of this file are two URL constants that will need to be changed to direct to the requisite server. They are currently pointing to a development server with script that returns the relevant JSON datasets. 
