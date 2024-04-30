sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/model/Sorter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
	"sap/ui/model/json/JSONModel"
 
], function (Controller, MessageBox, MessageToast, Sorter, Filter, FilterOperator, FilterType, JSONModel) {
	"use strict";

	console.log("Hello test")

	return Controller.extend("sap.ui.core.tutorial.odatav4.controller.App", {

		/**
		 *  Hook for initializing the controller
		 */
		onInit: function () {
			console.log('YO', 'OnInit')
			// Get the message manager instance from the SAPUI5 core
			var oMessageManager = sap.ui.getCore().getMessageManager();

			console.log("oMessageManager = sap.ui.getCore().getMessageManager() = ", oMessageManager);
		
			// Get the message model from the message manager
			var oMessageModel = oMessageManager.getMessageModel();

			console.log("oMessageModel = oMessageManager.getMessageModel() = ", oMessageModel)
		
			// Bind the message model to the root path ("/") with a filter for technical errors
			var oMessageModelBinding = oMessageModel.bindList("/", undefined, [],
				new Filter("technical", FilterOperator.EQ, true));
			
			
			console.log("oMessgaeModelBinding", oMessageModelBinding);
		
			// Create a JSON model for view-related data
			var oViewModel = new JSONModel({
				busy: false,
				hasUIChanges: false,
				usernameEmpty: false,
				order: 0
			});

			console.log("oViewModel", oViewModel)
		
			// Set the view model for application-wide data
			this.getView().setModel(oViewModel, "appView");

			console.log("this.getView().setModel(oViewModel, appView) = ", this.getView().setModel(oViewModel, "appView"))
		
			// Set the message model for displaying messages in the view
			this.getView().setModel(oMessageModel, "message");

			console.log("this.getView().setModel(oMessageModel, message) = ", this.getView().setModel(oMessageModel, "message"))
		
			// Attach a change event handler for the message model binding
			oMessageModelBinding.attachChange(this.onMessageBindingChange, this);

			console.log("oMessageModelBinding.attachChange(this.onMessageBindingChange, this);", oMessageModelBinding.attachChange(this.onMessageBindingChange, this));
		
			// Initialize a flag to track technical errors
			this._bTechnicalErrors = false;
		},

		// onCreate : function () {
		// 	var oList = this.byId("peopleList"),
		// 		oBinding = oList.getBinding("items"),
		// 		oContext = oBinding.create({
		// 			"UserName" : "",
		// 			"FirstName" : "",
		// 			"LastName" : "",
		// 			"Age" : "18"
		// 		});

		// 	this._setUIChanges();
		// 	this.getView().getModel("appView").setProperty("/usernameEmpty", true);

		// 	oList.getItems().some(function (oItem) {
		// 		if (oItem.getBindingContext() === oContext) {
		// 			oItem.focus();
		// 			oItem.setSelected(true);
		// 			return true;
		// 		}
		// 	});
		// },

		onCreate: function(){
			var oList = this.byId("peopleList"),
				oBinding = oList.getBinding("items"),
				oContext = oBinding.create({
					"UserName": "",
					"FirstName": "",
					"LastName": "",
					"Age": "18"
				});
			
			

			this._setUIChanges();
			this.getView().getModel("appView").setProperty("/usernameEmpty", true);

			oList.getItems().some(function(oItem){
				if(oItem.getBindingContext() === oContext){
					oItem.focus();
					oItem.setSelected(true);
					return true;
				}
			})

			console.log("oList", oList.getItems());

		},

		onDelete : function () {
		    var oContext,
		        oSelected = this.byId("peopleList").getSelectedItem(),
		        sUserName;
 
		    if (oSelected) {
		        oContext = oSelected.getBindingContext();
		        sUserName = oContext.getProperty("UserName");
				console.log("oSelected = this.byId(peopleList).getSelectedItem() :", oSelected)

		        oContext.delete().then(function () {
		            MessageToast.show(this._getText("deletionSuccessMessage", sUserName));
					console.log("oContext = oSelected.getBindingContext(); : ", oContext);

		        }.bind(this), function (oError) {
		            this._setUIChanges();
		            if (oError.canceled) {
		                MessageToast.show(this._getText("deletionRestoredMessage", sUserName));
					console.log("sUserName = oContext.getProperty(UserName) : ", sUserName)

		                return;
		            }
		            MessageBox.error(oError.message + ": " + sUserName);
		        }.bind(this));
				this._setDetailArea();
		        this._setUIChanges(true);
		    }
		},

		// onDelete : function () {
		    
		// 	//  check whether an item is selected in the table and if so, we retrieve the binding context of the selection and call its delete method
			
		// 	var oContext,
		//         oSelected = this.byId("peopleList").getSelectedItem();
		//         sUserName;
		// 		// console.log("oSelected = this.byId(peopleList).getSelectedItem() :", oSelected)

 
		//     if (oSelected) {
		//         oContext = oSelected.getBindingContext();
		// 		// console.log("oContext = oSelected.getBindingContext(); : ", oContext);
		//         sUserName = oContext.getProperty("UserName");
		// 		// console.log("sUserName = oContext.getProperty(UserName) : ", sUserName)
		//         oContext.delete().then(function () {
		//             MessageToast.show(this._getText("deletionSuccessMessage", sUserName));
		// 			console.log("MessageToast.show(this._getText(deletionSuccessMessage, sUserName) :", MessageToast.show(this._getText("deletionSuccessMessage", sUserName)))
		//         }.bind(this), function (oError) {
		//             this._setUIChanges();
		//             if (oError.canceled) {
		//                 MessageToast.show(this._getText("deletionRestoredMessage", sUserName));
		//                 return;
		//             }
		//             MessageBox.error(oError.message + ": " + sUserName);
		//         }.bind(this));
		//         this._setUIChanges(true);
		//     }
		// },


		// onInputChange : function (oEvt) {
		// 	if (oEvt.getParameter("escPressed")) {
		// 		console.log("oEvt.getParameter(escPressed) : ", oEvt.getParameter("escPressed"));
		// 		this._setUIChanges();
		// 	} else {
		// 		this._setUIChanges(true);
		// 		if (oEvt.getSource().getParent().getBindingContext().getProperty("UserName")) {
		// 			this.getView().getModel("appView").setProperty("/usernameEmpty", false);
		// 		}
		// 	}
		// },

		onInputChange : function (oEvt) {
			if (oEvt.getParameter("escPressed")) {
				this._setUIChanges();
			} else {
				this._setUIChanges(true);
				if (oEvt.getSource().getParent().getBindingContext().getProperty("UserName")) {
					this.getView().getModel("appView").setProperty("/usernameEmpty", false);
				}
			}
		},

		onRefresh : function(){
			var oBinding = this.byId("peopleList").getBinding("items");

			console.log("oBinding = this.byId(peopleList).getBinding(items); = ", oBinding = this.byId("peopleList").getBinding("items"));

			if(oBinding.hasPendingChanges()){
				MessageBox.error(this._getText("refreshNotPossibleMessage"));

				return;
			}
			oBinding.refresh();
			MessageToast.show(this._getText('refreshSuccessMessage'));

		},


		onResetChanges : function(){
			this.byID("peopleList").getBinding("items").resetChanges();
			// this._bTechnicalErrors = false;
			this._setUIChanges;
		},

		onResetDataSource : function(){
			var oModel = this.getView().getModel(),
				oOperation = oModel.bindContext("/ResetDataSource(...)");

			oOperation.execute().then(function(){
				oModel.refresh();
				MessageToast.show(this._getText("sourceResetSuccessMessage"));
			}.bind(this), function(oError){
				MessageBox.error(oError.message);
			})
		},

		onSave : function(){
			var fnSuccess = function (){
				this._setBusy(false);
				MessageToast.show(this._getText("changesSentMessage"));
				this._setUIChanges(false);
			}.bind(this);

			var fnError = function(oError){
				this._setBusy(false);
				this._setUIChanges(false);
				MessageBox.error(oError.message);

				this._setBusy(true); // Lock UI until submitBatch is resolved
				this.getView().getModel().submitBatch("peopleGroup").then(fnSuccess, fnError);
				this._bTechnicalErrros = false; // If there were technical errors, a new save resets them

			}
		},

		onSearch : function(){
			var oView = this.getView(),

				sValue = oView.byId("searchField").getValue(),
				oFilter = new Filter("LastName", FilterOperator.Contains, sValue);

				oView.byId("peopleList").getBinding("items").filter(oFilter, FilterType.Application);
		},


		onSort: function(){
			var oView = this.getView(),

				aStates=[undefined, "asc", "desc"],
				aStateTextIds = ["sortNone", "sortAscending", "sortDescending"],
				sMessgae,
				iOrder = oView.getModel("appView").getProperty("/order");

				iOrder = (iOrder + 1) % aStates.length;
				var sOrder = aStates[iOrder];

				oView.getModel("appView").setProperty("/order", iOrder);
				oView.byId("peopleList").getBinding("items").sort(sOrder && new Sorter("LastName", sOrder === 'desc'));

				sMessgae = this._getText("sortMessage", [this._getText(aStateTextIds[iOrder])]);
				MessageToast.show(sMessgae);
		},

		onMessageBindingChange : function(oEvent){
			var aContexts = oEvent.getSource().getContexts(),
				aMessages, 
				bMessageOpen = false;
			if(bMessageOpen || !aContexts.length){
				
				return;
			}

			console.log("aContexts", aContexts)

			// Extract and remove the technical messages

			aMessages = aContexts.map(function(oContext){
				console.log("oContext.getObjext() = ", oContext.getObjext())
				return oContext.getObjext();
			});

			sap.ui.getCore().getMessageManager().removeMessages(aMessages);

			this._setUIChanges(true);
			this._bTechnicalErrors = true;
			MessageBox.error(aMessages[0].message, {
				id: "serviceErrorMessageBox",
				onClose: function(){
					bMessageOpen = false;
				}
			});
			bMessageOpen = true;
		},

		onSelectionChange: function (oEvent){
			this._setDetailArea(oEvent.getParameter("listItem").getBindingContext());
		},

		
		_getText : function(sTextId, aArgs){
			console.log(" this.getOwnerComponent().getModel(i18n).getResourceBudnle().getText(sTextId, aArgs)",  this.getOwnerComponent().getModel("i18n").getResourceBudnle().getText(sTextId, aArgs))
			return this.getOwnerComponent().getModel("i18n").getResourceBudnle().getText(sTextId, aArgs);
		},

		_setUIChanges: function(bHasUIChanges) {
			// If there are technical errors, force 'true' for UI changes
			if (this._bTechnicalErrors) {
				bHasUIChanges = true;
			} else if (bHasUIChanges === undefined) {
				// If bHasUIChanges is not provided, check if there are pending changes in the model
				bHasUIChanges = this.getView().getModel().hasPendingChanges();
			}
			// Get the JSON model for the view
			var oModel = this.getView().getModel("appView");
			// Update the property "/hasUIChanges" in the model
			oModel.setProperty("/hasUIChanges", bHasUIChanges);
		},

		_setBusy : function(bIsBusy){
			var oModel = this.getView().getModel("appView");
			oModel.setProperty("/busy", bIsBusy)
		}, 

		  /**
         * Toggles the visibility of the detail area
         *
         * @param {object} [oUserContext] - the current user context
         */

		  _setDetailArea : function (oUserContext) {
			var oDetailArea = this.byId("detailArea"),
				oLayout = this.byId("defaultLayout"),
				oOldContext,
				oSearchField = this.byId("searchField");

			if (!oDetailArea) {
				return; // do nothing during view destruction
			}

			oOldContext = oDetailArea.getBindingContext();
			if (oOldContext && !oOldContext.isTransient()) {
				oOldContext.setKeepAlive(false);
			}
			if (oUserContext && !oUserContext.isTransient()) {
				oUserContext.setKeepAlive(true,
					// hide details if kept entity was refreshed but does not exist any more
					this._setDetailArea.bind(this));
			}
			oDetailArea.setBindingContext(oUserContext || null);
			// resize view
			oDetailArea.setVisible(!!oUserContext);
			oLayout.setSize(oUserContext ? "60%" : "100%");
			oLayout.setResizable(!!oUserContext);
			oSearchField.setWidth(oUserContext ? "40%" : "20%");
		}

	});
});
