#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <Wire.h>

const char* ssid = ""; //NOME DI WI-FI
const char* password = ""; //PASSWORD DI WI-FI
void setup() {
  pinMode(A0,INPUT);
  Serial.begin(115200);
  connecting();
  sendStatus();
  Serial.println("finito");
}
 
void loop() {
  if(WiFi.status()== WL_CONNECTED)
  {
      sendStatus();
      delay(5000);
  }
  else
  {
    Serial.println("Error in WiFi connection");  
    connecting();
    delay(100);
  }
  
  delay(1000);
  }
 
void connecting(){
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) 
  {
    delay(500);
    Serial.println("Waiting for connection");
  }
  Serial.print("Connected to ");
  Serial.println(ssid);
}

void sendStatus(){
  int k=analogRead(A0);
  String dataToSite=String(k);
  String url = "http://provaiota.herokuapp.com/"+dataToSite;
  Serial.println(url);
  HTTPClient http;
  http.begin(url);
  int httpCode = http.GET();
  String payload = http.getString();
  
  Serial.println(httpCode);
  Serial.println(payload);
  http.end();
  
}


