<?php


// Set some headers for proper delivery
header("Access-Control-Allow-Origin: *");
header("content-type: application/json");


// Database connection setup
include_once "configuration.php";

// Set some variables
$func = isset($_GET['func']) ? $_GET['func'] : '';

// The array to be converted to JSON in the end
$dataset = array();

// Create connection
$conn = new mysqli($servername, $dbusername, $dbpassword, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// print ":".$token.":";
// exit;







/*
   #########################################################################################
  #                                                                                         #
  #                                                                                         #
  #                                        SHOOTINGS                                        #
  #                                                                                         #
  #                                                                                         #
   #########################################################################################
*/

if ($func == 'shootings') {


//  ######################################
//  #  SHOOTINGS : YEAR
//  ######################################

    // Set the query with Heredoc (<<<EOF to EOF;) syntax
    $sql = <<<EOF
SELECT
year
FROM
SQLShootings
GROUP BY year
ORDER BY year DESC
EOF;

    // Run query
    $result = $conn->query($sql);

    // Is the data available?
    if ($result->num_rows > 0) {

        // Loop through each row...
        while($r = mysqli_fetch_assoc($result)) {

            // and push its data to the dataset
            $dataset[] = $r;
        }

        // Now we need to run a sub-query on each row
        foreach ($dataset as $key => $rowData) {

            // grab the classID for the sub-query
            $thisYear = $rowData['year'];

            

//  ######################################
//  #  SHOOTINGS : YEAR : INCIDENT
//  ######################################

            // Setting the sub-query with Heredoc (<<<EOF to EOF;) syntax
            $sql = <<<EOF
SELECT
shootings,
DATE_FORMAT(date, '%b %D, %Y') as cleanDate,
Address,
Summary,
fatalities,
totalVictims,
typeOfWeapons,
latitude,
longitude,
__pk_location
FROM
SQLShootings
WHERE year='{$thisYear}'
ORDER BY date DESC
EOF;

            // Run query
            $result = $conn->query($sql);

            // Is the data available?
            if ($result->num_rows > 0) {

                // Loop through each row...
                while($r = mysqli_fetch_assoc($result)) {

                    // and push its data to the dataset for this row
                    $dataset[$key]['incidents'][] = $r;
                }

                // Now we need to run a sub-query on each row
                foreach ($dataset[$key]['incidents'] as $key2 => $rowData2) {

                    // grab the classID for the sub-query
                    $thisLocation = $rowData2['__pk_location'];



//  ######################################
//  #  SHOOTINGS : YEAR : INCIDENT : REP
//  ######################################

                    $sql = <<<EOF
SELECT
c.__pk_contact,
c.NameFirst,
c.NameLast,
c.Party,
CASE
WHEN (c.Party = "R") THEN 'red'
WHEN (c.Party = "D") THEN 'blue'
END AS Color,
c.Title,
c.NRADonations,
FORMAT(c.SumNRA,0) AS SumNRA,
CASE 
WHEN (c.NRADonations = 'Yes') THEN CONCAT('Received $',FORMAT(c.SumNRA,0),' in donations from the NRA')
ELSE 'No NRA donations'
END AS NRAtext
FROM
SQLContacts c
LEFT JOIN SQLjoinConSho j ON j._fk_contact=c.__pk_contact
WHERE j._fk_location = '{$thisLocation}'
ORDER BY c.Title DESC, c.NameLast ASC, c.NameFirst ASC
EOF;

                    // Run query
                    $result = $conn->query($sql);

                    // Is the data available?
                    if ($result->num_rows > 0) {

                        // Loop through each row...
                        while($r = mysqli_fetch_assoc($result)) {

                            // and push its data to the dataset for this row
                            $dataset[$key]['incidents'][$key2]['reps'][] = $r;
                        }

                    // the representatives result isn't available
                    } else {

                        $dataset[$key]['incidents'][$key2]['reps'] = [];
                    }
                }

            // the incident result isn't available
            } else {

                $dataset[$key]['incidents'] = [];
            }
        }

    // The years result isn't available
    } else {

        // The dataset becomes empty for delivery
        $dataset = [];
    }







/*
   #########################################################################################
  #                                                                                         #
  #                                                                                         #
  #                                         CONGRESS                                        #
  #                                                                                         #
  #                                                                                         #
   #########################################################################################
*/

} elseif ($func == 'congress') {

    // Set the query with Heredoc (<<<EOF to EOF;) syntax
    $sql = <<<EOF
SELECT
__pk_contact,
NameFirst,
NameLast,
JobTitle,
Party,
PartyAffiliation,
NRADonations,
NRARating,
FORMAT(SumNRA,0) AS SumNRA,
Website,
Facebook,
twitter,
Instagram,
Video,
ElectionYear,
Notes,
Position
FROM SQLContacts
GROUP BY __pk_contact
ORDER BY __pk_contact ASC
EOF;

    // Run query
    $result = $conn->query($sql);

    // Is the data available?
    if ($result->num_rows > 0) {

        // Loop through each row...
        while($r = mysqli_fetch_assoc($result)) {

            // and push its data to the dataset
            $dataset['reps'][] = $r;
        }

        // Now we need to run a sub-query on each row
        foreach ($dataset['reps'] as $key => $rowData) {

            // grab the classID for the sub-query
            $thisRepID = $rowData['__pk_contact'];

            // Setting the sub-query with Heredoc (<<<EOF to EOF;) syntax
            $sql = <<<EOF

SELECT 
LocationSite,
PhoneLocal,
CONCAT('tel:+1',TRIM(REPLACE(REPLACE(REPLACE(REPLACE(PhoneLocal,'(',''),'-',''),')',''),' ',''))) AS PhoneLink,
OfficeActivity,
CONCAT(AddressCity,', ',AddressState,' ',AddressZip) AS AddressCSZ,
AddressStreet1,
AddressStreet2,
AddressCity,
AddressState,
AddressZip
FROM SQLAddress
WHERE _fk_contact='{$thisRepID}' 
ORDER BY LocationSite ASC
EOF;

            // Run query
            $result = $conn->query($sql);

            // Is the data available?
            if ($result->num_rows > 0) {

                // Loop through each row...
                while($r = mysqli_fetch_assoc($result)) {

                    // and push its data to the dataset for this row
                    $dataset['reps'][$key]['addresses'][] = $r;
                }
            } else {

                $dataset['reps'][$key]['addresses'] = [];
            }
            
        }
    // The result isn't available
    } else {

        // The dataset becomes empty for delivery
        $dataset['reps'] = [];

    }







/*
   #########################################################################################
  #                                                                                         #
  #                                                                                         #
  #                                     SHOOTINGS (ALT)                                     #
  #                                                                                         #
  #                                                                                         #
   #########################################################################################
*/

} elseif ($func == 'shootingsalt') {

    // Set the query with Heredoc (<<<EOF to EOF;) syntax
    $sql = <<<EOF
SELECT
__pk_location,
shootings,
DATE_FORMAT(date, '%b %D, %Y') as cleanDate,
Address,
Summary,
fatalities,
totalVictims,
typeOfWeapons,
latitude,
longitude,
venue,
state,
year
FROM
SQLShootings
WHERE Address IS NOT NULL
ORDER BY date DESC
EOF;

    // Run query
    $result = $conn->query($sql);

    // Is the data available?
    if ($result->num_rows > 0) {

        // Loop through each row...
        while($r = mysqli_fetch_assoc($result)) {

            // and push its data to the dataset
            $dataset['incidents'][] = $r;
        }

        // Now we need to run a sub-query on each row
        foreach ($dataset['incidents'] as $key => $rowData) {

            // grab the classID for the sub-query
            $thisLocation = $rowData['__pk_location'];

            // Setting the sub-query with Heredoc (<<<EOF to EOF;) syntax
            $sql = <<<EOF

SELECT
c.__pk_contact,
c.NameFirst,
c.NameLast,
c.Party,
CASE
WHEN (c.Party = "R") THEN 'red'
WHEN (c.Party = "D") THEN 'blue'
END AS Color,
c.Title,
c.NRADonations,
FORMAT(c.SumNRA,0) AS SumNRA,
CASE 
WHEN (c.NRADonations = 'Yes') THEN CONCAT('Received $',FORMAT(c.SumNRA,0),' in donations from the NRA')
ELSE 'No NRA donations'
END AS NRAtext
FROM
SQLContacts c
LEFT JOIN SQLjoinConSho j ON j._fk_contact=c.__pk_contact
WHERE j._fk_location = '{$thisLocation}'
ORDER BY c.Title DESC, c.NameLast ASC, c.NameFirst ASC
EOF;

            // Run query
            $result = $conn->query($sql);

            // Is the data available?
            if ($result->num_rows > 0) {

                // Loop through each row...
                while($r = mysqli_fetch_assoc($result)) {

                    // and push its data to the dataset for this row
                    $dataset['incidents'][$key]['reps'][] = $r;
                }
            } else {

                $dataset['incidents'][$key]['reps'] = [];
            }
            
        }
    // The result isn't available
    } else {

        // The dataset becomes empty for delivery
        $dataset['incidents'] = [];

    }






/*
   #########################################################################################
  #                                                                                         #
  #                                                                                         #
  #                                        References                                       #
  #                                                                                         #
  #                                                                                         #
   #########################################################################################
*/

} elseif ($func == 'ref') {

    $sql = <<<EOF
  SELECT
  OrganizationName,website,Notes,priority
  FROM
  SQLRef
  ORDER BY priority ASC
  EOF;
  
      // Run query
      $result = $conn->query($sql);
  
      // Is the data available?
      if ($result->num_rows > 0) {
  
          // Loop through each row...
          while($r = mysqli_fetch_assoc($result)) {
  
              // and push its data to the dataset
              $dataset['ref'][] = $r;
          }
  
          // Now we need to run a sub-query on each row
       }  else {
  
          // The dataset becomes empty for delivery
          $dataset['ref'] = [];
  
      }
  


}

// we should have a dataset object/array of some variety now...

// Close connection
$conn->close();

// convert array to utf8
$dataset = utf8_converter($dataset);

// JSON-ify the final dataset and deliver it
print json_encode($dataset);














//  ######################################
//  #  UTILITY FUNCTIONS
//  ######################################


function get_rnd_iv($iv_len)
{
  $iv = '';
  while ($iv_len-- > 0) {
      $iv .= chr(mt_rand() & 0xff);
  }
  return $iv;
}

function md5_encrypt($plain_text, $iv_len = 16)
{
  global $md5_salt;
  $plain_text .= "\x13";
  $n = strlen($plain_text);
  if ($n % 16) $plain_text .= str_repeat("\0", 16 - ($n % 16));
  $i = 0;
  $enc_text = get_rnd_iv($iv_len);
  $iv = substr($md5_salt ^ $enc_text, 0, 512);
  while ($i < $n) {
      $block = substr($plain_text, $i, 16) ^ pack('H*', md5($iv));
      $enc_text .= $block;
      $iv = substr($block . $iv, 0, 512) ^ $md5_salt;
      $i += 16;
  }
  return base64_encode($enc_text);
}

function md5_decrypt($enc_text, $iv_len = 16)
{
  global $md5_salt;
  $enc_text = base64_decode($enc_text);
  $n = strlen($enc_text);
  $i = $iv_len;
  $plain_text = '';
  $iv = substr($md5_salt ^ substr($enc_text, 0, $iv_len), 0, 512);
  while ($i < $n) {
      $block = substr($enc_text, $i, 16);
      $plain_text .= $block ^ pack('H*', md5($iv));
      $iv = substr($block . $iv, 0, 512) ^ $md5_salt;
      $i += 16;
  }
  return preg_replace('/\\x13\\x00*$/', '', $plain_text);
}

function array_push_assoc($array, $key, $value){
    $array[$key] = $value;
    return $array;
}

function utf8_converter($array)
{
    array_walk_recursive($array, function(&$item, $key){
        if(!mb_detect_encoding($item, 'utf-8', true)){
                $item = utf8_encode($item);
        }
    });
 
    return $array;
}


?>
