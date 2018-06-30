var iframe = document.getElementsByTagName('iframe')[0];
var innerDoc;

function selectElement(row)
{
	var itemSelected = row.getElementsByTagName('td')[1].innerHTML;
	var itemQuality = row.getElementsByTagName('td')[0].innerHTML;
	var searchText = itemSelected
	if(itemQuality === 'Strange')
		searchText = 'Strange ' + itemSelected
	var inputText = innerDoc.getElementsByClassName('inventory-search')[0]
	inputText.value = searchText;
	url = "https://backpack.tf/stats/" + itemQuality + "/" + itemSelected.split(' ').join('+').split("'").join("%27") + "/Tradable/Craftable";
	window.open(url)
}

iframe.onload = function ()
{
	innerDoc = iframe.contentWindow.document;
}

function refreshFrame()
{
	iframe.contentWindow.location.reload(true);
	iframe.contentWindow.location.href = "https://scrap.tf/buy/hats";
}

function loadItems()
{
	var hats = [];
	var divList = innerDoc.getElementsByTagName('div');
	for(var i = 0; i < divList.length; ++i)
    {
    	if(divList[i].classList.contains('item'))
		{
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
		for(var i=0; i<data.length; ++i)
		{
			var row = '<tr onclick="selectElement(this)">';
			row += '<td>' + data[i]['Quality'] + '</td>';
			row += '<td>' + data[i]['Name'] + '</td>';
			row += '<td>' + data[i]['Price'] + '</td>';
			row += '</tr>';
			$('#table-body').append(row);
		}
	});
}