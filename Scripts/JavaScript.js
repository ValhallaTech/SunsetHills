window.onload = function() {

    var chart = new CanvasJS.Chart("chartContainer",
        {
            animationEnabled: true,
            title: {
                text: "Try Dragging Any Building to Resize"
            },
            axisX: {
                minimum: 5,
                maximum: 95
            },
            axisY: {
                minimum: 10,
                maximum: 100
            },
            data: [
                {
                    type: "column",
                    dataPoints: [
                        { x: 10, y: 71, label: "Building 1" },
                        { x: 20, y: 55, label: "Building 2" },
                        { x: 30, y: 50, label: "Building 3" },
                        { x: 40, y: 65, label: "Building 4" },
                        { x: 50, y: 95, label: "Building 5" },
                        { x: 60, y: 68, label: "Building 6" },
                        { x: 70, y: 28, label: "Building 7" },
                        { x: 80, y: 34, label: "Building 8" },
                        { x: 90, y: 14, label: "Building 9" }
                    ]
                }
            ]
        });
    chart.render();

    var xSnapDistance = chart.axisX[0].convertPixelToValue(chart.get("dataPointWidth")) / 2;
    var ySnapDistance = 3;

    var xValue, yValue;

    var mouseDown = false;
    var selected = null;
    var changeCursor = false;

    var timerId = null;

    function getPosition(e) {
        var parentOffset = $("#chartContainer > .canvasjs-chart-container").offset();
        var relX = e.pageX - parentOffset.left;
        var relY = e.pageY - parentOffset.top;
        xValue = Math.round(chart.axisX[0].convertPixelToValue(relX));
        yValue = Math.round(chart.axisY[0].convertPixelToValue(relY));
    }

    function searchDataPoint() {
        var dps = chart.data[0].dataPoints;
        for (var i = 0; i < dps.length; i++) {
            if ((xValue >= dps[i].x - xSnapDistance && xValue <= dps[i].x + xSnapDistance) &&
                (yValue >= dps[i].y - ySnapDistance && yValue <= dps[i].y + ySnapDistance)) {
                if (mouseDown) {
                    selected = i;
                    break;
                } else {
                    changeCursor = true;
                    break;
                }
            } else {
                selected = null;
                changeCursor = false;
            }
        }
    }

    jQuery("#chartContainer > .canvasjs-chart-container").on({
        mousedown: function(e) {
            mouseDown = true;
            getPosition(e);
            searchDataPoint();
        },
        mousemove: function(e) {
            getPosition(e);
            if (mouseDown) {
                clearTimeout(timerId);
                timerId = setTimeout(function() {
                        if (selected != null) {
                            chart.data[0].dataPoints[selected].y = yValue;
                            chart.render();
                        }
                    },
                    0);
            } else {
                searchDataPoint();
                if (changeCursor) {
                    chart.data[0].set("cursor", "n-resize");
                } else {
                    chart.data[0].set("cursor", "default");
                }
            }
        },
        mouseup: function(e) {
            if (selected != null) {
                chart.data[0].dataPoints[selected].y = yValue;
                chart.render();
                mouseDown = false;
            }
        }
    });
}


//}

        //document.addEventListener(mouseup, function(){
        //    for (let loop = 0; loop <= 9; loop++) {
        //        let currentBldg = chart.data[loop];
        //        let outputArr = new Array();
        //        let tallestBldg = currentBldg;
        //        if (currentBldg > tallestBldg) {
        //            outputArr.push(currentBldg);
        //        }

        //}