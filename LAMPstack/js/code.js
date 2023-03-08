const urlBase = 'https://spg7cop4331.com/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "userPage.html";
				displayAll();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		//document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function register()
{
	console.log();
	//Initialize data
	userId = 0;
	firstName = document.getElementById("firstName").value;
	lastName = document.getElementById("lastName").value;
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;

	let tmp = {
		firstName:firstName,
		lastName:lastName,
		login:login,
		password:password
	};
	let jsonPayload = JSON.stringify( tmp );
	let url = urlBase + '/SignUp.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) //api successfully connected
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
				window.location.href = "index.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function fieldCheck(){
	firstName = document.getElementById("firstName").value;
	lastName = document.getElementById("lastName").value;
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	if(firstName=="" || lastName=="" || login=="" || password==""){
		document.getElementById("loginResult").innerHTML = "One or more fields missing";
		return;
	}
	else{
		register();
		document.getElementById("loginResult").innerHTML = "";
	}
}

function doCreateContact(){
	debugger;
    let firstname = document.getElementById("createFirstName").value;
    let lastname = document.getElementById("createLastName").value;
    let phone = document.getElementById("phone").value;
    let email = document.getElementById("email").value;

	let flag; //
    let tmp = {firstname:firstname, lastname:lastname, email:email, phone:phone, userid:userId}
    let jsonPayload = JSON.stringify( tmp );
    let url = urlBase + '/CreateContacts.' + extension;
    let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if(xhr.readyState == 4 && xhr.status == 200){
				console.log(JSON.parse(xhr.responseText));
				window.location.href='userPage.html'
			} 
			if(xhr.status==409){
				doOpenModal();
				console.log(`Error: ${xhr.status}`);
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err){

	}
}

function doOpenModal(){
	$('#createContactModal').modal('hide')
	$('#createContactModal').on('hidden.bs.modal', function () {
		// Load up a new modal...
		$('#createError').modal('show')
	  })
}

function displayAll(){
	debugger;
	let contactObj; //get data from xhr.response
	let search ='';
	const tableBody = document.getElementById("contactsTable-Body"); //reference table body
	let tmp = {userid:userId, search:search};
	let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + '/ReadContacts.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open('POST', url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200){
				contactObj = JSON.parse( xhr.responseText );
				if(contactObj.contactcount==0){
					displayNone(contactObj, tableBody)
				}
				else{
					displayAllHelper(contactObj, tableBody);
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err){

	}
	  
}

function displayNone(contactObj, tablebody){
	let row = document.createElement("tr");
	let noContacts = document.createElement("td");
	noContacts.innerText = "No contacts yet, make some friends!";
	row.appendChild(noContacts);
	tableBody.appendChild(row);
}

/**
 * Function does xys
 * @param {*} contactObj - param holds x information 
 * @param {*} tableBody - holds taBle body elem
 */
function displayAllHelper(contactObj, tableBody){
	
	for(let i=0; i < contactObj.contactcount; i++){
		// Create a new row element
		let row = document.createElement("tr");
		// Create a new cell for each property in the object
		let firstname = document.createElement("td");
		firstname.innerText = contactObj.contacts[i].firstname;
		let lastname = document.createElement("td");
		lastname.innerText =  contactObj.contacts[i].lastname;
		let email = document.createElement("td");
		email.innerText =  contactObj.contacts[i].email;
		let phone = document.createElement("td");
		phone.innerText = contactObj.contacts[i].phone;

        let deleteTD = document.createElement("td");
        let delete_edit_div = document.createElement("div");
        delete_edit_div.classList.add('delete_edit_div');

        //Delete Button
		let deleteButton = document.createElement("button");
        deleteButton.id = 'deleteButton';
        deleteButton.rel = 'stylesheet';
        deleteButton.href = "css/styles.css";
        deleteButton.classList.add('deleteButton');
        deleteButton.innerText = "Delete";
        deleteButton.setAttribute('type','button');
        deleteButton.setAttribute('value','Delete');
        //deleteButton.setAttribute('onclick', 'doDelete()');
        delete_edit_div.appendChild(deleteButton);

        //Edit Button
        let editTD = document.createElement("td");
        let editButton = document.createElement('button');
        editButton.classList.add("editButton");
        editButton.id = 'editButton';
        editButton.rel = 'stylesheet';
        editButton.type = 'text/css';
        editButton.href = 'css/styles.css';
        editButton.innerText = ". . .";
        editButton.setAttribute('type','button');
        editButton.setAttribute('value','Edit');
        //editButton.setAttribute('onclick', 'doEdit()');
        delete_edit_div.appendChild(editButton);

        deleteTD.appendChild(delete_edit_div);

		// Add the cells to the row
		row.appendChild(firstname);
		row.appendChild(lastname);
        row.appendChild(phone);
		row.appendChild(email);
        row.appendChild(deleteTD);
        //row.appendChild(editTD);
        tableBody.appendChild(row);
	}   
    //alert(window.location.pathname);
}

function doDelete()
{

}

function doEdit()
{

}

function addColor()
{
	let newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	let tmp = {color:newColor,userId,userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddColor.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
	
}

function searchColor()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";
	
	let colorList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchColors.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
}