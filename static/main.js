var iframe = document.getElementsByTagName('iframe')[0];
var innerDoc;
var timer;
var time;

function selectElement(row)
{
	var itemSelected = row.getElementsByTagName('td')[1].innerHTML;
	var itemQuality = row.getElementsByTagName('td')[0].innerHTML;
	var searchText = itemSelected
	if(itemQuality === 'Strange')
		searchText = 'Strange ' + itemSelected
	var inputText = innerDoc.getElementsByClassName('inventory-search')[0]
	inputText.value = searchText;
	// url = "https://backpack.tf/stats/" + itemQuality + "/" + itemSelected.split(' ').join('+').split("'").join("%27") + "/Tradable/Craftable";
	// window.open(url)
}

function refreshFrame()
{
	iframe.contentWindow.location.reload(true);
	iframe.contentWindow.location.href = "https://scrap.tf/buy/hats";
}

function notifyUser()
{
	window.open('/notify');
}

function loadItems()
{
	document.getElementById('table-body').innerHTML = '<h3 class="text-center text-muted">Loading...</h3>';
	var hats = [];
	var divList = innerDoc.getElementsByTagName('div');
	for(var i = 0; i < divList.length; ++i)
    {
    	if(divList[i].classList.contains('item'))
		{
			if(divList[i].parentNode.parentNode.id == 'user-bp-440')
				continue;
			var itemName = divList[i].getAttribute("data-title").split("&apos;").join("'");
			var itemValue = parseInt(divList[i].getAttribute("data-item-value"));
			var quality = "Unique";
			if(divList[i].classList.contains("quality1"))
				quality = "Genuine";
			else if(itemName.includes("<span class='quality11'>"))
            {
                itemName = itemName.replace("<span class='quality11'>Strange ", "");
                itemName = itemName.replace("</span>", "");
                quality = "Strange";
            }
			//alert(quality + ' ' + itemName + ': ' + String(itemValue/9));
			hats.push({ 
		        "Quality" : quality,
		        "Name"    : itemName,
		        "Price"   : String(itemValue) 
		    });
		}
    }
    req = $.ajax({
	 	type: "POST",
	 	contentType: "application/json; charset=utf-8",
	 	url: "/ajax",
	 	data: JSON.stringify(hats),
	  	dataType: "json"
	});
	req.done(function(data) {
		document.getElementById('table-body').innerHTML = '';
		var minProfit = document.getElementById('min-input').value;
		var notify = false;
		for(var i=0; i<data.length; ++i)
		{
			if(data[i]['Profit'] >= minProfit)
				notify = true;
			var row = '<tr onclick="selectElement(this)">';
			row += '<td>' + data[i]['Quality'] + '</td>';
			row += '<td>' + data[i]['Name'] + '</td>';
			row += '<td>' + data[i]['strProfit'] + '</td>';
			row += '<td>' + data[i]['Price'] + '</td>';
			row += '<td>' + '<button type="button" class="my-0 btn btn-primary" onclick=window.open("' + data[i]['Listing'] + '")>Check</button>'+ '</td>';
			row += '</tr>';
			$('#table-body').append(row);
		}
		if(notify && document.getElementById('enable-check').checked)
			notifyUser();
	});
}

iframe.onload = function ()
{
	try
	{
		innerDoc = iframe.contentWindow.document;
		innerDoc.getElementsByClassName('inventory-search')[0].value = ''
	}
	catch(e)
	{
		console.log('Frame error detected. Reloading...');
		refreshFrame();
		return;
	}
	loadItems();
}

function timerHandler()
{
	if(document.getElementById('enable-check').checked)
	{
		time -= 1;
		document.getElementById('time-text').innerHTML = String(time);
		if(time == 0)
		{
			delay = document.getElementById('delay-input').value;
			if(!delay) {
				delay = 15;
				document.getElementById('delay-input').value = delay;
			}
			time = delay; 
			refreshFrame();
		}
	}
}

function toggleAR(inputBox)
{
	if(inputBox.checked)
	{
		delay = document.getElementById('delay-input').value;
		if(!delay) {
			delay = 15;
			document.getElementById('delay-input').value = delay;
		}
		time = delay;
		timer = setInterval(timerHandler, 1000);
	}
	else
	{
		clearInterval(timer);
		document.getElementById('time-text').innerHTML = '...';
	}
}