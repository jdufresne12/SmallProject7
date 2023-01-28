
<?php
//We need firstname, lastname, and the login and password
$inData = getRequestInfo();

$id = 0;
$firstName = "";
$lastName = "";

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
if( $conn->connect_error )
{
    returnWithError( $conn->connect_error );
}
else
{
    //$stmt = $conn->prepare("SELECT ID,firstName,lastName FROM Users WHERE Login=? AND Password =?");
    $stmt = $conn->prepare(("INSERT INTO COP4331.Users(FirstName, LastName, Login, Password) VALUES (?,?,?,?)");

    $stmt->bind_param("ss", $inData["firstname"],$inData["lastname"],$inData["login"], $inData["password"]);
    $stmt->execute();
    $result = $stmt->get_result();
    echo json_encode($result)
    $stmt->close();
    $conn->close();
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson( $obj )
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError( $err )
{
    $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
    sendResultInfoAsJson( $retValue );
}

function returnWithInfo( $firstName, $lastName, $id )
{
    $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
    sendResultInfoAsJson( $retValue );
}

?>
