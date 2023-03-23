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
			else if (this.readyState == 4 && this.status != 200){
				document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
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
	if(!fieldCheck())
	{
		return;
	}

	userId = 0;
	firstName = document.getElementById("firstName").value;
	lastName = document.getElementById("lastName").value;
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;

	let tmp = {
		firstname:firstName,
		lastname:lastName,
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
				window.location.href = "index.html";
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
				
			}
			else if (this.readyState == 4 && this.status == 409){
				document.getElementById("loginResult").innerHTML = "UserName already exists"
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
		return false;
	}
	else{
		//register();
		document.getElementById("loginResult").innerHTML = "";
		return true;
	}
}

function doCreateContact(){
    let firstname = document.getElementById("createFirstName").value;
    let lastname = document.getElementById("createLastName").value;
    let phone = document.getElementById("phone").value;
    let email = document.getElementById("email").value;

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
				//alert("Hello?");
				window.location.href='userPage.html';
			} 
			else if(xhr.readyState == 4 && xhr.status==409){
				//etTimeout(alert("coopy"),10000);
				let errorObj = JSON.parse(xhr.responseText);
				errorObj.errordescription = errorObj.errordescription.toLowerCase();
				if(errorObj.errordescription.includes("contacts.uc_email"))
				{
					document.getElementById("createContactResult").innerHTML = "Email already exists";
				}
				else
				{
					document.getElementById("createContactResult").innerHTML = "Phone number already exists";
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err){
		//setTimeout(alert("But y"), 10000);
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
	let contactObj; //get data from xhr.response
	let search ='';
	let tableHeader = document.getElementById("contactsTable_Header")
	let tableBody = document.getElementById("contactsTable-Body"); //reference table body
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
				displayAllHelper(contactObj, tableHeader, tableBody);
			}
            else if(this.readyState == 4 && this.status == 404){
                displayNone(tableBody)
            }
		};
		xhr.send(jsonPayload);
	}
	catch(err){
        displayNone(tableBody);
	}
	  
}

function displayNone(tableBody){
	let row = document.createElement("tr");
	let noContacts = document.createElement("td");
	noContacts.innerText = "No contacts yet, make some friends!";
	row.appendChild(noContacts);
	tableBody.appendChild(row);
}

function displayTableHeader(tableHeader){
	debugger;
    let row = document.createElement("tr");
    let firstname = document.createElement("th");
    firstname.innerText = "First Name";
    let lastname = document.createElement("th");
    lastname.innerText = "Last Name";
    let email = document.createElement("th");
    email.innerText =  "Phone";
    let phone = document.createElement("th");
    phone.innerText = "email";
    let delete_edit = document.createElement("th");
    delete_edit.innerText = "";

    row.appendChild(firstname);
    row.appendChild(lastname);
    row.appendChild(email);
    row.appendChild(phone);
    row.appendChild(delete_edit);
	tableHeader.appendChild(row);
}

function displayAllHelper(contactObj, tableHeader, tableBody){
	debugger;
	displayTableHeader(tableHeader);
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
        deleteButton.classList.add("deleteButton");

        deleteButton.setAttribute('type','button');
        deleteButton.setAttribute('value','Delete');
        //deleteButton.setAttribute('onclick', doDelete(contactObj.contacts[i].contactId));
		//trashcan image
		let trashcan = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		let trashcanPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		trashcan.setAttribute('width','24');
		trashcan.setAttribute('height','24');
		trashcan.setAttribute('fill', 'currentColor');
		trashcan.setAttribute('class', 'bi bi-trash-fill');
		trashcan.setAttribute('viewBox', '0 0 16 16');
		trashcanPath.setAttribute(
			'd',
			'M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z'
		  );
		trashcan.appendChild(trashcanPath);
		deleteButton.appendChild(trashcan);
        deleteButton.addEventListener("click", function(){doDelete(contactObj.contacts[i].id);});
        //addEventListener('deleteButton', )

        //Edit Button
        let editButton = document.createElement('button');
        editButton.classList.add("editButton");
        editButton.id = 'editButton';
        editButton.setAttribute('type','button');
        editButton.setAttribute('value','Edit');
        //editButton.setAttribute('onclick', 'doEdit()');
		//edit Icon image
		let editIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		let editIconPath1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		let editIconPath2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		editIcon.setAttribute('width','24');
		editIcon.setAttribute('height','24');
		editIcon.setAttribute('fill', 'currentColor');
		editIcon.setAttribute('class', 'bi bi-pencil-square');
		editIcon.setAttribute('viewBox', '0 0 16 16');
		editIconPath1.setAttribute(
			'd',
			'M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z'
			);
		editIconPath2.setAttribute('fill-rule', 'evenodd');
		editIconPath2.setAttribute(
			'd',
			'M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z'
			);	
		editIcon.appendChild(editIconPath1);
		editIcon.appendChild(editIconPath2);
		editButton.appendChild(editIcon);

		delete_edit_div.appendChild(deleteButton);
        delete_edit_div.appendChild(editButton);

        deleteTD.appendChild(delete_edit_div);

		// Add the cells to the row
		row.appendChild(firstname);
		row.appendChild(lastname);
        row.appendChild(phone);
		row.appendChild(email);
        row.appendChild(deleteTD);
        tableBody.appendChild(row);
	}   
    //alert(window.location.pathname);
}

function clickDeleteButton(contactId){
    
}

function doDelete(deleteParam)
{
	let temp = {userid:userId,contactid:deleteParam};
	let jsonPayload = JSON.stringify(temp);
	let url = urlBase + '/DeleteContacts.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try{
		xhr.onreadystatechange = function()
		{
			if(this.readyState == 4 && this.status == 200)
			{
                doSearch();
			}
			
		}
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		//document.getElementById("colorAddResult").innerHTML = err.message;
	}
}

function doEdit()
{

}

function doSearch()
{
	$("#contactsTable tr").remove();
	let tableHeader = document.getElementById("contactsTable_Header")
    let tableBody = document.getElementById("contactsTable-Body");
	let srch = document.getElementById("search").value;
    let contactObject;
	let tmp = {userid:userId, search:srch,perpage:100,page:1};
	let jsonPayload = JSON.stringify( tmp );
	let url = urlBase + '/ReadContacts.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if(this.readyState == 4 && this.status == 200) 
			{
				contactObject = JSON.parse( xhr.responseText );
				displayAllHelper(contactObject, tableHeader, tableBody);
		    }
            else if(this.readyState == 4 && this.status == 404){
                displayNone(tableBody);
            }
	    }
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        displayNone(contactObject, tableBody);
    }   
}