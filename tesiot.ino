

#include <Servo.h>
#include <ESP8266WiFi.h>                                              
#include <FirebaseArduino.h>                                            



#define FIREBASE_HOST "megaboth007.firebaseio.com"                  
#define FIREBASE_AUTH "0hpnoqJQ5lQBFfnfWrSfplWa3ugIb71e4yO9ZZGN"                  
#define WIFI_SSID "S50"                                          
#define WIFI_PASSWORD "12345678"                                   


Servo myservo1;
Servo myservo2;

String fireStatus = "";                                                  
int led1 = D3;                                                              
int led2 = D4;    
int led3 = D8;  
int led4 = D7; 
   
 int trigPin = D9;  
  int echoPin = D8;  
    int distance;

      long duration;


void setup() {
     
  Serial.begin(9600);
  
 //delay(1000);

 // pinMode(LED_BUILTIN, OUTPUT);      
  pinMode(led1, OUTPUT); 
    pinMode(led2, OUTPUT); 
     pinMode(led3, OUTPUT); 
        pinMode(led4, OUTPUT); 
      pinMode(trigPin, OUTPUT);
       pinMode(echoPin, INPUT); 
   myservo1.attach(D1);
      myservo2.attach(D2);
  
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);                                      
        //Serial.print("Connecting to ");

  while (WiFi.status() != WL_CONNECTED) {
        //  Serial.print(".");
    delay(500);
  }
  //Serial.println();
 // Serial.print("Connected to ");
  //Serial.println(WIFI_SSID);
  //Serial.print("IP Address is : ");
                                                  
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);                                       
    Firebase.setString("LED_STATUS", "K90");

 

}

void loop() {
 
  fireStatus = Firebase.getString("LED_STATUS");                                     
if (fireStatus == "TG90") {                                                      
                                                           
      digitalWrite(led1, HIGH);   delay(100);  digitalWrite(led1,LOW);   
         digitalWrite(led2, HIGH); delay(100);  digitalWrite(led2,LOW);  
             myservo1.write(90);  delay(100); 
                myservo2.write(90);  delay(100); 
 
  } 
  if (fireStatus == "KIRI80") {                                                      
                            
  digitalWrite(led1, LOW);  
        digitalWrite(led2, HIGH); 
          myservo1.write(80);  delay(100); 
            myservo2.write(80);  delay(100); 
 
  } 
    if (fireStatus == "KIRI70") {                                                      
  digitalWrite(led1, LOW);  
        digitalWrite(led2, HIGH); 
          myservo1.write(70);  delay(100); 
            myservo2.write(70);  delay(100); 
 
  } 
    if (fireStatus == "KIRI60") {                                                      
   digitalWrite(led1, LOW);  
        digitalWrite(led2, HIGH); 
          myservo1.write(60);  delay(100); 
            myservo2.write(60);  delay(100); 
 
  } 
 
   if (fireStatus == "KANAN100") {                                                      
       digitalWrite(led1, HIGH);  
        digitalWrite(led2, LOW);           
          myservo1.write(100);  delay(100); 
            myservo2.write(100);  delay(100); 
 
  } 
   if (fireStatus == "KANAN110") {                                                      
           digitalWrite(led1, HIGH);  
              digitalWrite(led2, LOW);           
               myservo1.write(110);  delay(100); 
                myservo2.write(110);  delay(100); 
 
  } 
   if (fireStatus == "KANAN120") {                                                      
    digitalWrite(led1, HIGH);  
        digitalWrite(led2,LOW); 
          myservo1.write(120);  delay(100); 
            myservo2.write(120);  delay(100); 
 
  } 
  if (fireStatus == "SS") {                                                      
                                                                
      digitalWrite(led1, HIGH);   delay(100);  digitalWrite(led1,LOW);   myservo2.write(180);  delay(100); 
         digitalWrite(led2, HIGH); delay(100);  digitalWrite(led2,LOW);  myservo2.write(0);  delay(100);    
 
  }
  if (fireStatus == "api") {                                                      
                                                                
      digitalWrite(led1, HIGH); 
      digitalWrite(led2, HIGH);  
      digitalWrite(led3, LOW);  
      digitalWrite(led4, LOW);   
      
  }
  if (fireStatus == "normal") {                                                      
                                                                
       digitalWrite(led1, LOW); 
      digitalWrite(led2, LOW);     
       digitalWrite(led3, HIGH); 
        digitalWrite(led4, HIGH);
  }
 
digitalWrite(trigPin, LOW);
delayMicroseconds(2);
digitalWrite(trigPin, HIGH);
delayMicroseconds(10);
digitalWrite(trigPin, LOW);
duration = pulseIn(echoPin, HIGH);
distance= duration*0.034/2;
//Serial.print("Distance: ");
//Serial.println(distance);
Firebase.setFloat("Distance", distance);  


}
