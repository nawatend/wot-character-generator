'''
Sensehat Dashboard
=========================================
Author: The Great Nawang Tendar
Modified: 01-11-2019
-----------------------------------------
Installation:

-----------------------------------------

=========================================
'''
# Import the libraries

from sense_hat import SenseHat
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from ast import literal_eval
import time
import json



# Create an instance of the sensehat
sense = SenseHat()

    
# Fetch the service account key JSON file contents
cred = credentials.Certificate('./credentials.json')

# Initialize the app with a service account, granting admin privileges
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://wot-character-generator.firebaseio.com/'
})

ref = db.reference('/characters/')
refLive = db.reference('/characters/live/')



			
#hex color to rgb
hex2rgb = lambda hx: (int(hx[1:3],16),int(hx[3:5],16),int(hx[5:7],16))


			
# read color from firebase
def readLiveChar():
    
    # get color 
    # set sense color to that color
    # eazy pizzy
    charColor = literal_eval(ref.get()["live"])
 
    #rgbColor = hex2rgb("#999100")
    sense.set_pixels(charColor)

 
def loopChars():
    savedChars = ref.get()["saved"]
    savedCharsKeys  = list(reversed(sorted(savedChars.keys())))
    for x in savedCharsKeys:
	    #print(x)
        if ref.get()["loop"] == True:
            sense.set_pixels(literal_eval(savedChars[x]))
            time.sleep(0.3)
    

while True:
    if ref.get()["loop"] == False:
        readLiveChar()
    else:
        loopChars()

