var appPageHistory=[];
var jsonToBeSend=new Object();
var jsonBEArr = [];
var budgetingStatus;
var gradeId;
var unitId;
var employeeId;
var empFirstName;
var successSyncStatusBE =false;
var successSyncStatusTR =false;

var successMsgForCurrency = "Currency synchronized successfully.";
var errorMsgForCurrency = "Currency not synchronized successfully.";

var app = {
    // Application Constructor
    initialize: function() {
		this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
		document.addEventListener("deviceready", this.onDeviceReady, false);
    },
	
	onDeviceReady: function() {
       		  if (navigator.notification) { // Override default HTML alert with native dialog
			  window.alert = function (message) {
				  navigator.notification.alert(
					  message,   	 // message
					  null,       	// callback
					  "Alert", 	   // title
					  'OK'        // buttonName
				  );
			  };
		  }
		  document.addEventListener("backbutton", function(e){
		  	goBackEvent();
		  }, false);
		 validateValidMobileUser();  
		  }
};

function onConfirmExit(button) {
    if (button == 2) { //If User select a No, then return back;
        return;
    } else {
        navigator.app.exitApp(); // If user select a Yes, quit from the app.
    }
}

  //Local Database Create,Save,Display

function setUserSessionDetails(val,userJSON){
	 //window.localStorage.setItem("TrRole",val.TrRole);
	 window.localStorage.setItem("EmployeeId",val.empId);
	 window.localStorage.setItem("LastName",val.empName);
	 window.localStorage.setItem("UserName",userJSON["user"]);
	 window.localStorage.setItem("Password",userJSON["pass"]);
}


function resetUserSessionDetails(){
	 //window.localStorage.removeItem("TrRole");
	 window.localStorage.removeItem("EmployeeId");
	 window.localStorage.removeItem("LastName");
	 window.localStorage.removeItem("UserName");
	 window.localStorage.removeItem("Password");
	
}

function setUserStatusInLocalStorage(status){
	window.localStorage.setItem("UserStatus",status);
}
function setUrlPathLocalStorage(url){
	window.localStorage.setItem("urlPath",url);
}

function getUserID() {
	userKey=window.localStorage.getItem("EmployeeId");
	if(userKey==null) return  "";
	else return userKey;
}

	function goBack() {
	var currentUser=getUserID();
	
	var loginPath=defaultPagePath+'loginPage.html';
	var headerBackBtn=defaultPagePath+'backbtnPage.html';
	var headerBackBtnWithoutGoBack=defaultPagePath+'backbtnPageWithoutGoBack.html';
	if(currentUser==''){
		j('#mainContainer').load(loginPath);
	}else{
		//To check if the page that needs to be displayed is login page. So 'historylength-2'
		var historylength=appPageHistory.length;
		var goToPage=appPageHistory[historylength-2];
		if(goToPage!==null && goToPage==loginPath){
			return 0;
		}else{
			appPageHistory.pop();
			var len=appPageHistory.length;
			var pg=appPageHistory[len-1];
			if(pg=="app/pages/category.html"){
				j('#mainHeader').load(headerBackBtnWithoutGoBack);
			}
			if(pg=="app/pages/barcodeInformation.html"){
				j('#mainContainer').load("app/pages/category.html");
				j('#mainHeader').load(headerBackBtnWithoutGoBack);
			}
			if(!(pg==null) && !(pg == "app/pages/barcodeInformation.html")){ 
				j('#mainContainer').load(pg);
			}
		}
	}
	}
 
function goBackEvent() {
	var currentUser=getUserID();
	var loginPath=defaultPagePath+'loginPage.html';
	var headerBackBtn=defaultPagePath+'backbtnPage.html';
	var headerBackBtnWithoutGoBack=defaultPagePath+'backbtnPageWithoutGoBack.html';
	
	if(currentUser==''){
		j('#mainContainer').load(loginPath);
	}else{
		//To check if the page that needs to be displayed is login page. So 'historylength-2'
		var historylength=appPageHistory.length;
		var goToPage=appPageHistory[historylength-2];
		if(goToPage!==null && goToPage==loginPath){
			return 0;
		}else{
			appPageHistory.pop();
			var len=appPageHistory.length;
			if(len == 0){
				navigator.app.exitApp();
				navigator.notification.confirm("Are you sure want to exit from App?", onConfirmExit, "Confirmation", "Yes,No");
			}else{
				var pg=appPageHistory[len-1];
				alert(pg);
				if(pg=="app/pages/category.html"){
					j('#mainHeader').load(headerBackBtnWithoutGoBack);
				}
				if(pg=="app/pages/barcodeInformation.html"){
					j('#mainContainer').load("app/pages/category.html");
					j('#mainHeader').load(headerBackBtnWithoutGoBack);
				}
				if(!(pg==null) && !(pg == "app/pages/barcodeInformation.html")){ 
					j('#mainContainer').load(pg);
				}
			}
		}
	}
}

