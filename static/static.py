import json, requests, csv

imgs = open('images.csv','w')

fieldnames = ['filename','cop','caption','url','location','year']
writer = csv.DictWriter(imgs, fieldnames=fieldnames)
writer.writeheader()

def getstatic(cop):
	
	with open(cop) as data_file:
		data = json.load(data_file)
	c = data['cop']
	# generate images 

	for d in data['features']:
		print d['properties']['location']
		token = "pk.eyJ1IjoibGlmZXdpbm5pbmciLCJhIjoiYWZyWnFjMCJ9.ksAPTz72HyEjF2AOMbRNvg"
		lat = str(d["geometry"]["coordinates"][0])
		lon = str(d["geometry"]["coordinates"][1])
		latlon = lat +","+lon
		#marker = 'geojson({"type":"Point","coordinates":['+latlon+']})'
		style = "styles/v1/lifewinning/cjd52cola5t0g2rnvua7d2frg"
		tbd = "food"
		zooms = [8, 9, 10, 11, 12]
		for z in zooms:
			imgURL = "https://api.mapbox.com/"+style+"/static/"+latlon+","+str(z)+"/1280x1280?access_token="+token
			tbd = imgURL
			r = requests.get(imgURL)
			filename = d['properties']['cop']+'-'+str(d['properties']['year'])+"-"+d['properties']['location'].replace(', ','')+'zoom'+str(z)
			with open('./'+c+'/'+filename+".png", 'wb') as f:
				f.write(r.content)

		writer.writerow({'filename':filename,'cop':c, 'caption': d['properties']['notes'].encode('utf-8'),'url':tbd,'location': d['properties']['location'],'year':d['properties']['year']})

getstatic('bratton-points.geojson')
getstatic('maple-points.geojson')
getstatic('timoney-points.geojson')


