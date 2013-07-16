<?php

$username = $_POST['username'];

$user_type = $username == 'customer' ? 'customer' : 'driver';

echo '{ "username": "' . $username . '", "firstName": "firstName1", "userType": "' . $user_type . '" }';
