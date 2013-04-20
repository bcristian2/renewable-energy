import json
from itertools import izip

def createJSONfile():
	solarDataFile=open("global_radiation.txt", "r")

	for _ in range(0,14):
		solarDataFile.readline()

	windDataFile=open("wind_data.txt", "r")

	for _ in range(0,8):
		windDataFile.readline()

	popDataFile=open("pop_data.txt", "r")

	jsonList=[]
	for windLine, solarLine, popData in izip(windDataFile, solarDataFile, popDataFile):

		windList=windLine.split(" ")
		solarList=solarLine.split(" ")

		if(testValidCoords(windList[0],windList[1],popData)):
			currDict=generateJSON(windList, solarList, popData.strip())
			jsonList.append(currDict)

	outFile=open("data.json","w")
	outFile.write(json.dumps(jsonList).replace(" ",""))

def testValidCoords(lat, long, popData):
	if(int(popData)>5):
		return False

	invalidCoords=[ #enclosing all the 31 coordinates of water areas
					#1
					[-180,-75,-75, -15],
					[-180,-15, -80, 8],
					[-180, 8, -105, 23],
					[-180, 23, -120, 30],
					[-180, 30, -128, 45],
					[-180, 45, -135, 60],
					[-180, 60, -165, 75],
					[-180, 75, -120, 90],
					#2
					[-60, -75, -15, -60],
					[-60, -60, 180, -45],
					[-60, -45, 135, -37],
					[-45, -37, 15, -22],
					[-37, -22, 7, 0],
					[-52, 0, -22, 15],
					[-70, 15, -22, 30],
					[-70, 30, -10, 45],
					[-52, 45, -10, 60],
					[-15, 60, 7, 75],
					[-15, 75, 180, 90],
					#3
					[30,-37, 112,-30],
					[52, -30, 112,-7 ],
					[45, -7, 95, 5],
					[52, 5, 70, 15],
					[60, 15, 70, 22],
					#4
					[175, -90, 180, -60],
					[157, -45, 165, -30],
					[150, -30, 180, 0],
					[127, 0, 180, 15],
					[120, 15, 180, 30],
					[150, 30, 180, 45],
					[165, 45, 180, 60]
					]

	for long1,lat1,long2,lat2 in invalidCoords:
		if int(long)>=int(long1) and int(long)<=int(long2):
			if int(lat)>=int(lat1) and int(lat)<=int(lat2):
				return False

	return True

def generateJSON(windList, solarList, popData):
	if windList[0]!=solarList[0]:
		raise Exception("Latitude does not match!")	

	if windList[1]!=solarList[1]:
		raise Exception("Longitude does not match!")

	id=str(windList[0]+windList[1])

	windMonths=[]
	solarMonths=[]
	for x in range(2,15):
		windMonths.append(windList[x])
		solarMonths.append(solarList[x])

	coordinates=[[int(windList[0]),int(windList[1])],[int(windList[0])+1,int(windList[1])],
				 [int(windList[0])+1,int(windList[1])+1],[int(windList[0]),int(windList[1])+1]]

	windDict={"value":windList,"units":"m/s"}
	solarDict={"value":solarList,"units":"kWh/m^2/day"}
	geoDict={"type":"Polygon","coordinates":coordinates}
	popDict={"value":popData,"units":"people/km^2"}

	propertiesDict={"lat":windList[0],"long":windList[1],
					"wind":windDict,"solar":solarDict,"popDense":popDict,"geometry":geoDict}

	jsonDict={ "id":id,
			   "properties":propertiesDict}

	return jsonDict

createJSONfile()