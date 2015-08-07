/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
// yay JS context!
var self = null;
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        this.client = new Keen({
            projectId: "PROJECTIDHERE",
            readKey: "READKEYHERE",
            writeKey: "WRITEKEYHERE"
        });
        self = this;
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.getElementById("button").addEventListener('click', this.onButtonClick, false);
        document.getElementById("view-stats").addEventListener('click', this.onStatsLinkClick, false);
        document.getElementById("view-button").addEventListener('click', this.onButtonLinkClick, false);
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    onStatsLinkClick: function() {
        document.getElementById("button-page").setAttribute('style', 'display:none');
        document.getElementById("stats-page").setAttribute('style', 'display:block');

        var count = new Keen.Query("count", {
            eventCollection: "button clicks",
            timeframe: "this_24_hours",
            interval: "hourly"
        });

        var countChart = new Keen.Dataviz()
            .el(document.getElementById("chart2"))
            .chartType("linechart")
            .height(200)
            .width(250)
            .prepare();

        self.client.run(count, function(err, res) {
            if (err) {
                countChart.error(err.message);
            }
            else {
                countChart
                    .parseRequest(this)
                    .title("Clicks per Hour")
                    .render();
            }
        });

        var allTimeCount = new Keen.Query("count", {
            eventCollection: "button clicks"
        });

        var allTimeCountChart = new Keen.Dataviz()
            .el(document.getElementById("chart1"))
            .chartType("metric")
            .height(150)
            .width(250)
            .prepare();

        self.client.run(allTimeCount, function(err, res) {
            if (err) {
                allTimeCountChart.error(err.message);
            }
            else {
                allTimeCountChart
                    .parseRequest(this)
                    .title("Total Clicks")
                    .render();
            }
        });

        return false;
    },
    onButtonLinkClick: function() {
        document.getElementById("stats-page").setAttribute('style', 'display:none');
        document.getElementById("button-page").setAttribute('style', 'display:block');

        return false;
    },
    onButtonClick: function() {
        document.getElementById("button").setAttribute('style', 'display:none');
        document.getElementById("pushed-text").setAttribute('style', 'display:block');

        var eventData = {
            color: "red",
            device: device
        };
        self.client.addEvent("button clicks", eventData, function(err, res) {
            if (err) {
                console.log("Error: " + err);
            }
            else {
                console.log("Event sent.");
            }

            document.getElementById("button").setAttribute('style', 'display:block');
            document.getElementById("pushed-text").setAttribute('style', 'display:none');
        });
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');


        console.log('Received Event: ' + id);
    }
};
