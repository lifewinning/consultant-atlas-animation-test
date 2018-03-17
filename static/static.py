import json, requests, csv

imgs = open('images.csv','w')

fieldnames = ['filename','cop','caption','url']
writer = csv.DictWriter(imgs, fieldnames=fieldnames)
writer.writeheader()

def getstatic(cop):
	
	with open(cop) as data_file:
		data = json.load(data_file)
	c = data['cop']
	# generate images 

	for d in data['features']:
		token = "pk.eyJ1IjoibGlmZXdpbm5pbmciLCJhIjoiYWZyWnFjMCJ9.ksAPTz72HyEjF2AOMbRNvg"
		lat = str(d["geometry"]["coordinates"][0])
		lon = str(d["geometry"]["coordinates"][1])
		latlon = lat +","+lon
		style = "styles/v1/lifewinning/cjd52cola5t0g2rnvua7d2frg"
		imgURL = "https://api.mapbox.com/"+style+"/static/"+latlon+",10/1280x1280?access_token="+token
		print imgURL
		r = requests.get(imgURL)
		filename = d['properties']['cop']+'-'+str(d['properties']['year'])+"-"+d['properties']['location'].replace(', ','')
		with open('./'+c+'/'+filename+".png", 'wb') as f:
			f.write(r.content)

		writer.writerow({'filename':filename,'cop':c, 'caption': d['properties']['notes'].encode('utf-8'),'url':imgURL})

getstatic('bratton-points.geojson')
getstatic('maple-points.geojson')
getstatic('timoney-points.geojson')


