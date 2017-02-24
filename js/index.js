var j = jQuery.noConflict();
var defaultPagePath='app/pages/';
var headerMsg = "Expenzing";
//var urlPath;
var urlPath = 'http://1.255.255.36:7003/TnEV1_0AWeb/WebService/Login/';
//var urlPath = 'http://1.255.255.169:8081/TnEV1_0AWeb/WebService/Login/';
var WebServicePath = 'http://1.255.255.169:8085/NexstepWebService/mobileLinkResolver.service';
var clickedFlagCar = false;
var clickedFlagTicket = false;
var clickedFlagHotel = false;
var clickedCarRound = false;
var clickedTicketRound = false;
var clickedHotelRound = false;
var perUnitDetailsJSON= new Object();
var ismodeCategoryJSON=new Object();
var exceptionStatus = 'N';
var exceptionMessage='';
var expenseClaimDates=new Object();
var successMessage;
var pictureSource,destinationType;
var camerastatus;
var voucherType;
var fileTempCameraBE ="";
var fileTempCameraTS ="";
var fileTempGalleryBE ="";
var fileTempGalleryTS ="";
var mapToCalcERAmt = new Map();
var barCodeStatus = "false";

function login(){
   	if(document.getElementById("userName")!=null){
		var userName = document.getElementById("userName");
	}else if(document.getElementById("userName")!=null){
		var userName = document.getElementById("userNameId");
	}
	var password = document.getElementById("pass");
    
    var jsonToBeSend=new Object();
    jsonToBeSend["user"] = userName.value;
    jsonToBeSend["pass"] = password.value;
   	var headerBackBtn=defaultPagePath+'backbtnPageWithoutGoBack.html';
	var pageRef=defaultPagePath+'category.html';
	//urlPath=window.localStorage.getItem("urlPath");
	setUrlPathLocalStorage(urlPath);
	j('#loading').show();
    j.ajax({
         url: urlPath+"LoginWebService",
         type: 'POST',
         dataType: 'json',
         crossDomain: true,
         data: JSON.stringify(jsonToBeSend),
         success: function(data) {
        	 if (data.type == 'S'){
        		 j('#mainHeader').load(headerBackBtn);
        		 j('#mainContainer').load(pageRef);
        		 appPageHistory.push(pageRef);
        		 setUserSessionDetails(data,jsonToBeSend);
        		 setUserStatusInLocalStorage("Valid");
        	 }else if(data.type == 'R'){
        		 successMessage = data.message;
        		 if(successMessage.length == 0)
        			 successMessage = "Asset Owner Role Missing";
        		 document.getElementById("loginErrorMsg").innerHTML = successMessage;
        		 j('#loginErrorMsg').hide().fadeIn('slow').delay(2000).fadeOut('slow');
        		 j('#loading').hide();
        	 }else if(data.type == 'L'){
        		 successMessage = data.message;
        		 if(successMessage.length == 0)
        			 successMessage = "Your account is already locked. Please contact system administrator.";
        		 document.getElementById("loginErrorMsg").innerHTML = successMessage;
        		 j('#loginErrorMsg').hide().fadeIn('slow').delay(2000).fadeOut('slow');
        		 j('#loading').hide();
        	 }else if(data.type == 'E'){
        		 successMessage = data.message;
        		 if(successMessage.length == 0)
        			 successMessage = "Wrong UserName or Password";
        		 document.getElementById("loginErrorMsg").innerHTML = successMessage;
        		 j('#loginErrorMsg').hide().fadeIn('slow').delay(2000).fadeOut('slow');
        		 j('#loading').hide();
        	 }else{
        	 	 successMessage = "Wrong UserName or Password";
			 document.getElementById("loginErrorMsg").innerHTML = successMessage;
        		 j('#loading').hide();
        	 }},
         error:function(data) {
		   j('#loading').hide();
         }
   });
 }
 
  function barcodeWebservice(cancelledStatus,assetNo)
{
	/*var pageRef=defaultPagePath+'barcodeInformation.html';*/
	//alert("barcodewebservice");
   	if(cancelledStatus == false){
		var jsonToBeSend=new Object();
		jsonToBeSend["assetNo"] = assetNo;
		jsonToBeSend["employeeId"] = window.localStorage.getItem("EmployeeId");
		//alert("employee id : "+window.localStorage.getItem('EmployeeId'));
		jsonToBeSend["command"] = "getBarcodeInformation";
		jsonToBeSend["initiationId"] = "";
		j('#loading').show();
		 j.ajax({
         url: urlPath+"BarcodeWebservice",
         type: 'POST',
         dataType: 'json',
         crossDomain: true,
         data: JSON.stringify(jsonToBeSend),
         success: function(data) {
					if (data.status == 'SUCESS_WITH_VALID_EMP'){
						if(data.assetPhysicalVerificationStatus == 'S' || data.assetPhysicalVerificationStatus == 'C'){
							getBarcodeInformation(data);
						}else if(data.assetPhysicalVerificationStatus == 'N'){
							alert("Physical Verification Process for this asset has already been completed.");
							cancel();
						}else{
							alert("This Asset has not been allocated to you or has not been sent for Physical Verification to you.");
							cancel();
						}
					}else if(data.status == 'NO_DATA_FOUND'){
						alert("No Data Found against this Barcode.");
						cancel();
					}else if(data.status == 'SUCESS_WITH_INVALID_EMP'){
						alert("This Asset has not been allocated to you.");
						cancel();
					}
				},
			 error:function(data) {
			   j('#loading').hide();
			 }
		});
	}
}

function createBarcode(){
//	if(barCodeStatus == "false"){
		var headerBackBtn=defaultPagePath+'backbtnPage.html';
			var pageRef=defaultPagePath+'barcode.html';
			j(document).ready(function() {
				j('#mainHeader').load(headerBackBtn);
				j('#mainContainer').load(pageRef);
			});
		appPageHistory.push(pageRef);
		barCodeStatus = "true";
//	}
}
	
function commanLogin(){
 	var userName = document.getElementById("userName");
 	var userNameValue = userName.value; 
 	var domainName = userNameValue.split('@')[1];
	var jsonToDomainNameSend = new Object();
	jsonToDomainNameSend["userName"] = domainName;
	jsonToDomainNameSend["mobilePlatform"] = device.platform;
	//alert("platform : "+device.platform);
	if(device.platform == "Android"){
		jsonToDomainNameSend["mobilePlatform"] = "ANDROID_FOR_ASSET";
	}else if(device.platform == "Window"){
		jsonToDomainNameSend["mobilePlatform"] = "WINDOWS_FOR_ASSET";
	}else if(device.platform == "iOS"){
		jsonToDomainNameSend["mobilePlatform"] = "IOS_FOR_ASSET";
	}
  	//var res=JSON.stringify(jsonToDomainNameSend);
	var requestPath = WebServicePath;
	j.ajax({
         url: requestPath,
         type: 'POST',
         contentType : "application/json",
         dataType: 'json',
         crossDomain: true,
         data: JSON.stringify(jsonToDomainNameSend),
         success: function(data) {
         	if (data.status == 'Success'){
         		urlPath = data.message;
         		setUrlPathLocalStorage(urlPath);
         		login();
        	}else if(data.status == 'Failure'){
				successMessage = data.message;
				document.getElementById("loginErrorMsg").innerHTML = successMessage;
 			   j('#loginErrorMsg').hide().fadeIn('slow').delay(2000).fadeOut('slow');
 			}else{
 				successMessage = data.message;
 				if(successMessage == "" || successMessage == null){
					alert("Please enter correct username or password");				
				}else{
					alert(successMessage);	
 				}	
 			}
         },
         error:function(data) {
		   j('#loading').hide();
         }
   });
}

 function init() {
	 var pgRef;
	var headerBackBtn;
	if(window.localStorage.getItem("EmployeeId")!= null){
		if(window.localStorage.getItem("UserStatus")=='ResetPswd'){
			headerBackBtn=defaultPagePath+'expenzingImagePage.html';
			pgRef=defaultPagePath+'loginPageResetPswd.html';
		}else if(window.localStorage.getItem("UserStatus")=='Valid'){
			pgRef=defaultPagePath+'category.html';
			headerBackBtn=defaultPagePath+'backbtnPageWithoutGoBack.html';
		}else{
			headerBackBtn=defaultPagePath+'expenzingImagePage.html';
		pgRef=defaultPagePath+'loginPage.html';
		}

	}else{
		headerBackBtn=defaultPagePath+'expenzingImagePage.html';
		pgRef=defaultPagePath+'loginPage.html';
	}
	
	j(document).ready(function() {
		j('#mainHeader').load(headerBackBtn);
			j('#mainContainer').load(pgRef);
			j('#mainContainer').load(pgRef,function() {
  						if(window.localStorage.getItem("UserStatus")!=null
  							&& window.localStorage.getItem("UserStatus")=='ResetPswd'){
  							document.getElementById("userNameLabel").innerHTML=window.localStorage.getItem("UserName");
  							document.getElementById("userName").value=window.localStorage.getItem("UserName");
  						}
		 			  
					});
			j('#mainContainer').swipe({
				swipe:function(event,direction,distance,duration,fingercount){
					switch (direction) {
						case "right":
								goBack();
								break;
						default:

					}
				},
				 threshold:200,
				allowPageScroll:"auto"
			});
	});
	appPageHistory.push(pgRef);
 }
 
	function getBarcodeInformation(data){
		mytable = j('<table></table>');
		var tBody = j("<tbody>").appendTo(mytable).attr('id','tbody');
			
			var trClassCode = j("<tr>").appendTo(tBody).attr('id','trClassCode');
				
				j("<td style='height:5%; width:30%'><div style='border-bottom: 0px; text-align: left;'><label style='font-weight: 800'> Class Code</label>" +
								"</div></td>").appendTo(trClassCode);
								
				j("<td style='height:5%; width:10%'><div style='border-bottom: 0px;'><label style='font-weight: 800'> : </label>" +
								"</div></td>").appendTo(trClassCode);
		
				j("<td style='height:5%; width:60%'><div style='border-bottom: 0px; text-align: left;'><label style='font-weight: 800'>"+data.classCode+"</label>" +
						"</div></td>").appendTo(trClassCode);
						
			j("</tr>").appendTo(tBody);
					
			var trSubClassCode = j("<tr>").appendTo(tBody).attr('id','trSubClassCode');
				
				j("<td style='height:5%; width:30%'><div style='border-bottom: 0px; text-align: left;'><label style='font-weight: 800'> Sub Class Code</label>" +
								"</div></td>").appendTo(trSubClassCode);
								
				j("<td style='height:5%; width:10%'><div style='border-bottom: 0px;'><label style='font-weight: 800'> : </label>" +
								"</div></td>").appendTo(trSubClassCode);
		
				j("<td style='height:5%; width:60%'><div style='border-bottom: 0px; text-align: left;'><label style='font-weight: 800'>"+data.subClassCode+"</label>" +
						"</div></td>").appendTo(trSubClassCode);
						
			j("</tr>").appendTo(tBody);

			var trUniqueCode = j("<tr>").appendTo(tBody).attr('id','trUniqueCode');
				
				j("<td style='height:5%; width:30%'><div style='border-bottom: 0px; text-align: left;'><label style='font-weight: 800'> Unique Code</label>" +
								"</div></td>").appendTo(trUniqueCode);
		
				j("<td style='height:5%; width:10%'><div style='border-bottom: 0px;'><label style='font-weight: 800'> : </label>" +
								"</div></td>").appendTo(trUniqueCode);
								
				j("<td style='height:5%; width:60%'><div style='border-bottom: 0px; text-align: left;'><label style='font-weight: 800'>"+data.uniqueCode+"</label>" +
						"</div></td>").appendTo(trUniqueCode);
						
			j("</tr>").appendTo(tBody);

			var trTypeOfAllocation = j("<tr>").appendTo(tBody).attr('id','trTypeOfAllocation');
				
				j("<td style='height:5%; width:30%'><div style='border-bottom: 0px; text-align: left;'><label style='font-weight: 800'> Type of Allocation</label>" +
								"</div></td>").appendTo(trTypeOfAllocation);
				
				j("<td style='height:5%; width:10%'><div style='border-bottom: 0px;'><label style='font-weight: 800'> : </label>" +
								"</div></td>").appendTo(trTypeOfAllocation);
		
				j("<td style='height:5%; width:60%'><div style='border-bottom: 0px; text-align: left;'><label style='font-weight: 800'>"+data.typeOfAllocation+"</label>" +
						"</div></td>").appendTo(trTypeOfAllocation);
						
			j("</tr>").appendTo(tBody);	
			
			var trRejectionComment = j("<tr>").appendTo(tBody)
							.attr('id','trRejectionComment')
							.attr('style','display:none;');
				
				j("<td style='height:1%; width:100%; padding-left:5%;'><div style='border-bottom: 0px'><label style='font-weight: 800'> Rejection Comment</label>" +
								"</div></td>").appendTo(trRejectionComment);
			
			j("</tr>").appendTo(tBody);	

			var trRejectionCommentTextArea = j("<tr>").appendTo(tBody)
								.attr('id','trRejectionCommentTextArea')
								.attr('style','display:none;');
											
				j("<td style='height:1%; width:100%; padding-left:5%;'><div style='border-bottom: 0px; padding-top: 0px;'><textarea rows='4' cols='40' onkeyup='checkMaxSize();' id='rejectionComments' style='height:1%; width:100%'></textarea>"+
						"</div></td>").appendTo(trRejectionCommentTextArea);
						
			j("</tr>").appendTo(tBody);		
		
			if(data.assetPhysicalVerificationStatus == 'S'){
				var trApprove = j("<tr>").appendTo(tBody).attr('id','trApprove');		
					var tdApprove = j("<td colspan='4'; style='height:1%; width:100%'>").appendTo(trApprove).attr('id','tdApprove');	
						var myButtonTable = j("<table style='width:100%'>").appendTo(tdApprove).attr('id','myButtonTable');		
							var tButtonBody = j("<tbody>").appendTo(myButtonTable).attr('id','tButtonBody');
								var trButtons = j("<tr>").appendTo(tButtonBody).attr('id','trButtons');
								
									j("<td style='height:20%; width:30%' id='approveTd'><div style='border-bottom: 0px'><input type='button' style='width:80%' class='btn btn-info' id='approve' value='Verify'><br/>" +
										"</div></td>").appendTo(trButtons);
											
									j("<td style='height:20%; width:40%' id='getRejectionCommentTd'><div style='border-bottom: 0px'><input type='button' style='width:80%' class='btn btn-info' id='getRejectionComment' value='Not Verify'><br/>" +
										"</div></td>").appendTo(trButtons);
										
									j("<td style='height:20%; width:30%' id='cancelTd'><div style='border-bottom: 0px'><input type='button' class='btn btn-info' style='width:80%' id='cancel' value='Cancel'><br/>" +
										"</div></td>").appendTo(trButtons);
									
									j("<td style='display:none; height:20%; width:50%; text-align: right;' id='rejectTd'><div style='border-bottom: 0px'><input type='button' style='width:60%' class='btn btn-info' id='reject' value='Submit'><br/>" +
										"</div></td>").appendTo(trButtons);
									
									j("<td style='display:none; height:20%; width:40% text-align: left;' id='backToInfoPageTd'><div style='border-bottom: 0px'><input type='button' style='width:50%' class='btn btn-info' id='backToInfoPage' value='Back'><br/>" +
										"</div></td>").appendTo(trButtons);
							
								j("</tr>").appendTo(tButtonBody);	
							j("</tbody>").appendTo(myButtonTable);
						j("</table>").appendTo(tdApprove);
					j("</td>").appendTo(trApprove);	
				j("</tr>").appendTo(tBody);		
			}
		
		j("</tbody>").appendTo(mytable);
		
		
			var headerBackBtn=defaultPagePath+'backbtnPage.html';
			var pageRef=defaultPagePath+'barcodeInformation.html';
			j(document).ready(function() {
				j('#mainHeader').load(headerBackBtn, function() {
					j('#mainContainer').load(pageRef, function() {
						mytable.appendTo("#barcodebox");
						j("#approve").attr("onclick", "updatePhysicalVerification('"+data.uniqueCode+"','"+data.initiationId+"','C')");
						j("#getRejectionComment").attr("onclick", "getRejectionComment()");
						j("#cancel").attr("onclick", "cancel()");
						j("#reject").attr("onclick", "updatePhysicalVerification('"+data.uniqueCode+"','"+data.initiationId+"','N')");
						j("#backToInfoPage").attr("onclick", "backToInfoPage()");
					});
					
				});
			});
		appPageHistory.push(pageRef);
		
	}

function updatePhysicalVerification(uniqueCode,initiationId,physicalVerificationStatus,rejectionComment){
	if(physicalVerificationStatus == 'C' || 
	   (physicalVerificationStatus == 'N' && document.getElementById('rejectionComments').value != ""
	    && document.getElementById('rejectionComments').value.length > 350)){
		var jsonToBeSend=new Object();
		jsonToBeSend["assetNo"] = uniqueCode;
		jsonToBeSend["employeeId"] = window.localStorage.getItem("EmployeeId");
		jsonToBeSend["initiationId"] = initiationId;
		jsonToBeSend["command"] = "updateBarcodeInformation";
		jsonToBeSend["physicalVerificationStatus"] = physicalVerificationStatus;
		jsonToBeSend["rejectionComment"] = document.getElementById('rejectionComments').value;
		j('#loading').show();
		 j.ajax({
			 url: urlPath+"BarcodeWebservice",
			 type: 'POST',
			 dataType: 'json',
			 crossDomain: true,
			 data: JSON.stringify(jsonToBeSend),
			 success: function(data) {
				if (data.status == 'SUCESS'){
					if(physicalVerificationStatus == 'N'){
						successMessage = "Assets have been Successfully sent to Gap Report.";
					}else{
						successMessage = "Asset Physical Verification Done Sucessfully.";
					}
				}else if(data.status == 'FAILURE'){
					successMessage = "Oops!! Something went wrong. Please contact system administrator";
				}else{
					successMessage = "Oops!! Something went wrong. Please contact system administrator";
				}
				var headerBackBtn=defaultPagePath+'backbtnPage.html';
				var pageRef=defaultPagePath+'success.html';
				 j('#mainHeader').load(headerBackBtn);
				 j('#mainContainer').load(pageRef);
				  appPageHistory.push(pageRef);
				},
			 error:function(data) {
			   j('#loading').hide();
			 }
		});
		}else{
			if(document.getElementById('rejectionComments').value != ""
			   && document.getElementById('rejectionComments').value.length > 350 ){
				alert("Rejection comments must be less than 350 charachter");
				document.getElementById('rejectionComments').value = document.getElementById('rejectionComments').value.substring(0, 350);
			}else{
				alert("Please fill Proper Rejection comments.");
			}
		}
	}
	
	function cancel(){
		var backbtnPageWithoutGoBack=defaultPagePath+'backbtnPageWithoutGoBack.html';
		var pageRef=defaultPagePath+'category.html';
		 j('#mainHeader').load(backbtnPageWithoutGoBack);
		 j('#mainContainer').load(pageRef);
		  appPageHistory.push(pageRef);
	}

function validateValidMobileUser(){
		var pgRef;
		var headerBackBtn;
		var jsonToBeSend=new Object();
		if(window.localStorage.getItem("EmployeeId")!= null
			&& (window.localStorage.getItem("UserStatus")==null || window.localStorage.getItem("UserStatus")=='Valid')){
			jsonToBeSend["user"]=window.localStorage.getItem("UserName");
			jsonToBeSend["pass"]=window.localStorage.getItem("Password");
			var urlPath = window.localStorage.getItem("urlPath");
			j.ajax({
			 url: urlPath+"ValidateUserWebservice",
		         type: 'POST',
		         dataType: 'json',
		         crossDomain: true,
		         data: JSON.stringify(jsonToBeSend),
		         success: function(data) {
		           if(data.type == 'S'){
		         	 	setUserStatusInLocalStorage("Valid");
		           }else if(data.type == 'R'){
		         	 	successMessage = data.message;
		         	 	headerBackBtn=defaultPagePath+'expenzingImagePage.html';
						pgRef=defaultPagePath+'loginPage.html';
						setUserStatusInLocalStorage("Invalid");
						j('#mainHeader').load(headerBackBtn);
	             		j('#mainContainer').load(pgRef,function() {
							document.getElementById("loginErrorMsg").innerHTML = successMessage;
			 			   j('#loginErrorMsg').hide().fadeIn('slow').delay(4000).fadeOut('slow');
			 			   j('#loading').hide();
						});
					  
		           }else if(data.Status == 'InactiveUser'){
					   successMessage = data.message;
		         	 	headerBackBtn=defaultPagePath+'expenzingImagePage.html';
						pgRef=defaultPagePath+'loginPage.html';
						 j('#mainHeader').load(headerBackBtn);
						 setUserStatusInLocalStorage("Inactive");
						 resetUserSessionDetails();
	             		j('#mainContainer').load(pgRef,function() {
	  						document.getElementById("loginErrorMsg").innerHTML = successMessage;
			 			   j('#loginErrorMsg').hide().fadeIn('slow').delay(4000).fadeOut('slow');
			 			   j('#loading').hide();
						});
		           }else if(data.Status == 'ChangedUserCredentials'){
					    successMessage = data.message;
		         	 	headerBackBtn=defaultPagePath+'expenzingImagePage.html';
						pgRef=defaultPagePath+'loginPageResetPswd.html';
						 setUserStatusInLocalStorage("ResetPswd");
						j('#mainHeader').load(headerBackBtn);
	             		j('#mainContainer').load(pgRef,function() {
	  						document.getElementById("loginErrorMsg").innerHTML = successMessage;
	  						document.getElementById("userNameLabel").innerHTML=window.localStorage.getItem("UserName");
	  						document.getElementById("userName").value=window.localStorage.getItem("UserName");
			 			   j('#loginErrorMsg').hide().fadeIn('slow').delay(4000).fadeOut('slow');
			 			   j('#loading').hide();
						});
		           }

		         },
		         error:function(data, textStatus, errorThrown) {
				j('#loading').hide();   
		         }
		   });
		}
}

function getRejectionComment(){
	document.getElementById('approveTd').style.display = "none";
	document.getElementById('getRejectionCommentTd').style.display = "none";
	document.getElementById('cancelTd').style.display = "none";
	document.getElementById('trClassCode').style.display = "none";
	document.getElementById('trSubClassCode').style.display = "none";
	document.getElementById('trUniqueCode').style.display = "none";
	document.getElementById('trTypeOfAllocation').style.display = "none";
	document.getElementById('trRejectionComment').style.display = "";
	document.getElementById('trRejectionCommentTextArea').style.display = "";
	document.getElementById('rejectTd').style.display = "";
	document.getElementById('backToInfoPageTd').style.display = "";
}

function backToInfoPage(){
	document.getElementById('approveTd').style.display = "";
	document.getElementById('getRejectionCommentTd').style.display = "";
	document.getElementById('cancelTd').style.display = "";
	document.getElementById('trClassCode').style.display = "";
	document.getElementById('trSubClassCode').style.display = "";
	document.getElementById('trUniqueCode').style.display = "";
	document.getElementById('trTypeOfAllocation').style.display = "";
	document.getElementById('trRejectionComment').style.display = "none";
	document.getElementById('trRejectionCommentTextArea').style.display = "none";
	document.getElementById('rejectTd').style.display = "none";
	document.getElementById('backToInfoPageTd').style.display = "none";
	document.getElementById('rejectionComments').value = "";
}

function checkMaxSize(){
	if(document.getElementById('rejectionComments').value.length > 350 ){
		alert("Rejection comments must be less than 350 charachter");
		document.getElementById('rejectionComments').value = document.getElementById('rejectionComments').value.substring(0, 350)
	}
}
