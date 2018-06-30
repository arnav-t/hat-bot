from bs4 import BeautifulSoup
import requests


def getPrice(quality, name):
	url = "https://backpack.tf/stats/{}/{}/Tradable/Craftable".format(quality, name.replace(' ', '+').replace("'","%27"))
	
	soup = BeautifulSoup(requests.get(url).text, "html.parser")
	price = 0

	for i, element in enumerate(soup.findAll(attrs={"data-listing_intent" : "0"})):
		if __name__ == '__main__':
			print(element['data-listing_price'])
		if i<3:
			price = element['data-listing_price']


	return price

def string2scrap(strPrice):
	if strPrice == 0:
		return 0

	ref = 9
	key = 36*ref
	l = []
	for t in strPrice.split():
		try:
			l.append(float(t))
		except ValueError:
			pass

	price = 0
	if "key" in strPrice:
		try:
			price += l[0]*key + l[1]*ref
		except IndexError:
			price += l[0]*key
	else:
		price += l[0]*ref

	return int(round(price))


if __name__ == '__main__':
	quality = input('Quality: ')
	name = input('Name: ')
	print('Quick-sell Price: ' + str(string2scrap(getPrice(quality, name))) + ' scrap')
