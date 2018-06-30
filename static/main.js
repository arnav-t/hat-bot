var iframe = document.getElementsByTagName('iframe')[0];
var innerDoc;


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
    $.ajax({
	 	type: "POST",
	 	contentType: "application/json; charset=utf-8",
	 	url: "/ajax",
	 	data: JSON.stringify(hats),
	  	dataType: "json"
	});
}