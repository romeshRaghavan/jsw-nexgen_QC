var j = jQuery.noConflict();
var defaultPagePath='app/pages/';
var headerMsg = "Expenzing";
var urlPath = 'http://1.255.255.169:8080/TnEV1_0AWeb/WebService/Login/';
var WebServicePath = 'http://1.255.255.188:8088/NexstepWebService/mobileLinkResolver.service';
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

function login()
   {

   	if(document.getElementById("userName")!=null){
    var userName = document.getElementById("userName");
	}else if(document.getElementById("userName")!=null){
		var userName = document.getElementById("userNameId");
	}
	var password = document.getElementById("pass");
    
    var jsonToBeSend=new Object();
    jsonToBeSend["user"] = userName.value;
    jsonToBeSend["pass"] = password.value;
   	var headerBackBtn=defaultPagePath+'categoryMsgPage.html';
	var pageRef=defaultPagePath+'category.html';
	//urlPath=window.localStorage.getItem("urlPath");
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
			  //addEmployeeDetails(data);
			 // setUserStatusInLocalStorage("Valid");
			  setUserSessionDetails(data,jsonToBeSend);
			}else if(data.type == 'E'){
 			   successMessage = data.Message;
			   if(successMessage.length == 0){
					successMessage = "Wrong UserName or Password";
				}
				document.getElementById("loginErrorMsg").innerHTML = successMessage;
 			   j('#loginErrorMsg').hide().fadeIn('slow').delay(2000).fadeOut('slow');
 			   j('#loading').hide();
           }else{
			    j('#loading').hide();
             alert("Please enter correct username or password");
           }

         },
         error:function(data) {
		   j('#loading').hide();
         }
   });

 }
 
  function barcodeWebservice(cancelledStatus,assetNo)
{
	/*var pageRef=defaultPagePath+'barcodeInformation.html';*/
   	if(cancelledStatus == false){
		var jsonToBeSend=new Object();
		jsonToBeSend["assetNo"] = assetNo;
		jsonToBeSend["employeeId"] = window.localStorage.getItem("EmployeeId");
		j('#loading').show();
		 j.ajax({
         url: urlPath+"BarcodeWebservice",
         type: 'POST',
         dataType: 'json',
         crossDomain: true,
         data: JSON.stringify(jsonToBeSend),
         success: function(data) {
					if (data.status == 'SUCESS_WITH_VALID_EMP'){
						getBarcodeInformation(data);
					}else if(data.status == 'NO_DATA_FOUND'){
						alert("No Data Found against this Barcode.");
					}else if(data.status == 'SUCESS_WITH_INVALID_EMP'){
						alert("Asset not allocated to you");
					}
				},
			 error:function(data) {
			   j('#loading').hide();
			 }
		});
	}
}

function createBarcode(){
		var headerBackBtn=defaultPagePath+'backbtnPage.html';
			var pageRef=defaultPagePath+'barcode.html';
			j(document).ready(function() {
				j('#mainHeader').load(headerBackBtn);
				j('#mainContainer').load(pageRef);
			});
		appPageHistory.push(pageRef);
		/*var data1 = 'Cla Ed-EC--Calddc-28-07-00984C12-35';
		createBarcodeInformationTable(data1);*/
	}
	
function commanLogin(){
 	var userName = document.getElementById("userName");
 	var userNameValue = userName.value; 
 	var domainName = userNameValue.split('@')[1];
	var jsonToDomainNameSend = new Object();
	jsonToDomainNameSend["userName"] = domainName;
	jsonToDomainNameSend["mobilePlatform"] = device.platform;
	//jsonToDomainNameSend["mobilePlatform"] = "Android";
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
			headerBackBtn=defaultPagePath+'categoryMsgPage.html';
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
		/*var rowThead = j("<thead></thead>").appendTo(mytable);
		var rowTh = j('<tr></tr>').appendTo(rowThead);
		
		j('<th></th>').text("Barcode Information").appendTo(rowTh);
		
		//ClassCode = j('<tr></tr>').appendTo(mytable);
		
		j('<td></td>').text("Class Code").appendTo(classCode);	
		j('<td></td>').text(data).appendTo(classCode);*/
		var tBody = j("<tbody>").appendTo(mytable).attr('id','ttbody');
			
			var trBreak = j("<tr>").appendTo(tBody).attr('id','trBreak');
			
				j("<td style='height:10%; width:35%'><div ><label style='font-weight: 800'></label>" +
								"</div></td>").appendTo(trBreak);
			j("</tr>").appendTo(tBody);	
			
			var trClassCode = j("<tr>").appendTo(tBody).attr('id','classCode');
				
				j("<td style='height:10%; width:35%'><div ><label style='font-weight: 800'> Class Code : </label>" +
								"</div></td>").appendTo(trClassCode);
								
				j("<td style='height:10%; width:65%'><div ><label style='font-weight: 800'>"+data.classCode+"</label>" +
						"</div></td>").appendTo(trClassCode);
						
			j("</tr>").appendTo(tBody);
					
			var trBreak = j("<tr>").appendTo(tBody).attr('id','trBreak');
		
				j("<td style='height:10%; width:35%'><div ><label style='font-weight: 800'></label>" +
								"</div></td>").appendTo(trBreak);
			
			j("</tr>").appendTo(tBody);	
			
			var trSubClassCode = j("<tr>").appendTo(tBody).attr('id','trSubClassCode');
				
				j("<td style='height:10%; width:35%'><div ><label style='font-weight: 800'> Sub Class Code : </label>" +
								"</div></td>").appendTo(trSubClassCode);
								
				j("<td style='height:10%; width:65%'><div ><label style='font-weight: 800'>"+data.subClassCode+"</label>" +
						"</div></td>").appendTo(trSubClassCode);
						
			j("</tr>").appendTo(tBody);

			var trBreak = j("<tr>").appendTo(tBody).attr('id','trBreak');
			
				j("<td style='height:10%; width:35%'><div ><label style='font-weight: 800'></label>" +
								"</div></td>").appendTo(trBreak);
								
			j("</tr>").appendTo(tBody);
			
			var trUniqueCode = j("<tr>").appendTo(tBody).attr('id','trUniqueCode');
				
				j("<td style='height:10%; width:35%'><div ><label style='font-weight: 800'> Unique Code : </label>" +
								"</div></td>").appendTo(trUniqueCode);
								
				j("<td style='height:10%; width:65%'><div ><label style='font-weight: 800'>"+data.uniqueCode+"</label>" +
						"</div></td>").appendTo(trUniqueCode);
						
			j("</tr>").appendTo(tBody);

			var trBreak = j("<tr>").appendTo(tBody).attr('id','trBreak');
			
				j("<td style='height:10%; width:35%'><div ><label style='font-weight: 800'></label>" +
								"</div></td>").appendTo(trBreak);
								
			j("</tr>").appendTo(tBody);	
			
			var trTypeOfAllocation = j("<tr>").appendTo(tBody).attr('id','trTypeOfAllocation');
				
				j("<td style='height:10%; width:35%'><div ><label style='font-weight: 800'> Type of Allocation : </label>" +
								"</div></td>").appendTo(trTypeOfAllocation);
								
				j("<td style='height:10%; width:65%'><div ><label style='font-weight: 800'>"+data.typeOfAllocation+"</label>" +
						"</div></td>").appendTo(trTypeOfAllocation);
						
			j("</tr>").appendTo(tBody);			
			
			var trBreak = j("<tr>").appendTo(tBody).attr('id','trBreak');
			
				j("<td style='height:10%; width:35%'><div ><label style='font-weight: 800'></label>" +
								"</div></td>").appendTo(trBreak);
			
			j("</tr>").appendTo(tBody);				
			
			var trApprove = j("<tr>").appendTo(tBody).attr('id','trApprove');		
			
				j("<td style='height:20%; width:15%'><div class='leftTD'><input type='button' class='btn btn-info' id='approve' value='Approve'><br/>" +
					"</div></td>").appendTo(tBody);
						
				j("<td style='height:20%; width:15%'><div class='leftTD'><input type='button' class='btn btn-info' id='cancel' value='Cancel'><br/>" +
					"</div></td>").appendTo(tBody);
					
			j("</tr>").appendTo(tBody);			
			
			var trBreak = j("<tr>").appendTo(tBody).attr('id','trBreak');
			
				j("<td style='height:10%; width:50%'><div ><label style='font-weight: 800'></label>" +
								"</div></td>").appendTo(trBreak);
			
			j("</tr>").appendTo(tBody);	
			
		j("</tbody>").appendTo(mytable);
		
		
			var headerBackBtn=defaultPagePath+'backbtnPage.html';
			var pageRef=defaultPagePath+'barcodeInformation.html';
			j(document).ready(function() {
				j('#mainHeader').load(headerBackBtn, function() {
					j('#mainContainer').load(pageRef, function() {
						mytable.appendTo("#barcodebox");
							j("#approve").attr("onclick", "physicalVerification('"+data+"')");
							j("#cancel").attr("onclick", "cancelPhysicalVerification('"+data+"')");
					});
					
				});
			});
		appPageHistory.push(pageRef);
		
	}

	function physicalVerification(data){
		alert("inside physicalVerification");
		alert(data);
	}
	
	function cancelPhysicalVerification(data){
		alert("inside cancelPhysicalVerification");
		alert(data);
	}
