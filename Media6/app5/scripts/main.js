/**
 * @returns {{initialize: Function, focus: Function, blur: Function}}
 */
geotab.addin.mediaBlock = function () {
    'use strict';

    let api;
    let state;
    let times;
    let idling;
    let fuel;
    let volumeConversionFactor;
    let volumeLabel;


    let elAddin;
    let isAuthValid;
    let mediaList;
    let elSendHistory;
    let videoUrl;

    function populateMedia(callback) {

        let divId = Date.now(),
            headerElement = document.createElement('h4'),
            textElement = document.createTextNode('Sent: ' + new Date());

        headerElement.setAttribute('id', divId);
        headerElement.appendChild(textElement);
        elSendHistory.appendChild(headerElement);

        // Building the table with Events Data
        var myTableDiv = document.getElementById("myDynamicTable");
      
        var table = document.createElement('TABLE');
        table.border='1';
    
        var tableBody = document.createElement('TBODY');
        table.appendChild(tableBody);
      
        //for (var i=0; i< mediaList.length; i++){ }
        videoUrl = mediaList[0].videos[0].blobUrl;
        myTableDiv.appendChild(table);
        var vidContainer = document.getElementById("vidContainer");
        vidContainer.innerHTML = '';
        for (var i=0; i< mediaList[0].videos.length; i++){ 
            var vid = document.createElement('video');
            vid.setAttribute("autoplay", "");
            vid.setAttribute("loop", "");
            vid.setAttribute("controls", "");
            vid.setAttribute("id", "video" + i);
            vid.setAttribute("src", mediaList[0].videos[i].blobUrl);
            vid.setAttribute("width", "640");
            vid.setAttribute("height", "360");
            vidContainer.appendChild(vid);
        }
        //Building the Video Tag
        /*
        var vidContainer = document.getElementById("vidContainer");
        vidContainer.innerHTML = '';
        var vid = document.createElement('video');
        vid.setAttribute("autoplay", "");
        vid.setAttribute("loop", "");
        vid.setAttribute("controls", "");
        vid.setAttribute("id", "video");
        vid.setAttribute("src", videoUrl);
        vid.setAttribute("width", "640");
        vid.setAttribute("height", "360");
        vidContainer.appendChild(vid);
        */
    }

    return {
        /**
         * initialize() is called only once when the Add-In is first loaded. Use this function to initialize the
         * Add-In's state such as default values or make API requests (MyGeotab or external) to ensure interface
         * is ready for the user.
         * @param {object} freshApi - The GeotabApi object for making calls to MyGeotab.
         * @param {object} freshState - The page state object allows access to URL, page navigation and global group filter.
         * @param {function} initializeCallback - Call this when your initialize route is complete. Since your initialize routine
         *        might be doing asynchronous operations, you must call this method when the Add-In is ready
         *        for display to the user.
         */
        initialize: function (freshApi, freshState, initializeCallback) {
            api = freshApi;
            state = freshState;
			elAddin = document.getElementById('mediaBlock');
			api.getSession(function (session,server) {
				var RequestParameter = new Object();
						RequestParameter.userName = session.userName;
						RequestParameter.dbName = session.database;
						RequestParameter.serverName = server;
						RequestParameter.sessionId = session.sessionId;
				$.ajax({
					type: 'POST',
					dataType: 'json',
					contentType: "application/json",
					url: 'https://localhost:44355/Geotab/api/validateAuth',
					data: JSON.stringify(RequestParameter),
					success: function (Data) {
						window.alert(Data.userName);
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
			
					}
				});
			});
			elSendHistory = document.getElementById('ioxoutput-history');
            initializeCallback();
        },

        /**
         * focus() is called whenever the Add-In receives focus.
         *
         * The first time the user clicks on the Add-In menu, initialize() will be called and when completed, focus().
         * focus() will be called again when the Add-In is revisited. Note that focus() will also be called whenever
         * the global state of the MyGeotab application changes, for example, if the user changes the global group
         * filter in the UI.
         *
         * @param {object} freshApi - The GeotabApi object for making calls to MyGeotab.
         * @param {object} freshState - The page state object allows access to URL, page navigation and global group filter.
         */
        focus: function (freshApi, freshState) {
            api = freshApi;
            state = freshState;

            api.getSession(function (session,server) {
                let currentUser = session.userName;
                console.log(session.userName);
                console.log(session.sessionId);
                console.log(server);
                console.log(server.name);
                
                var RequestParameter = new Object();
                RequestParameter.userName = session.userName;
                RequestParameter.dbName = session.database;
                RequestParameter.serverName = server;
                RequestParameter.sessionId = session.sessionId;
                localStorage.setItem("userName", session.userName);
		        localStorage.setItem("dbName", session.database);
                localStorage.setItem("serverName", server);
		        localStorage.setItem("sessionId", session.sessionId);

                $.ajax({
                    type: 'POST',
                    url: 'https://localhost:44355/Geotab/api/DeviceVideoList',
                    data: JSON.stringify(RequestParameter),
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json',
                    success: function (Data) {
                        mediaList = Data;
                        populateMedia();
                        elAddin.style.display = 'block';
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
        
                    }
                });
            });
        },

        /**
         * blur() is called whenever the user navigates away from the Add-In.
         *
         * Use this function to save the page state or commit changes to a data store or release memory.
         *
         * @param {object} freshApi - The GeotabApi object for making calls to MyGeotab.
         * @param {object} freshState - The page state object allows access to URL, page navigation and global group filter.
         */
        blur: function () {
            // hide main content
            elAddin.style.display = 'none';
        }
    };
};
