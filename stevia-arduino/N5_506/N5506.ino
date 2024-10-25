#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <Adafruit_PN532.h>

// WiFi 정보
const char* ssid = "Hanbat_WLAN_Guest";
const char* password = "";

// MQTT 브로커 정보
const char* mqtt_server = "broker.emqx.io";  // 브로커 주소
const int mqtt_port = 1883;                  // 브로커 포트
const char* topic = "stevia-mqtt/hbnu/request/#";
const char* req_key_topic = "stevia-mqtt/hbnu/request/key/N5506";
const char* res_key_topic = "stevia-mqtt/hbnu/response/key/N5506";
const char* req_door_topic = "stevia-mqtt/hbnu/request/door/N5506";
const char* res_door_topic = "stevia-mqtt/hbnu/response/door/N5506";
const char* req_lock_topic = "stevia-mqtt/hbnu/request/lock/N5506";
const char* res_lock_topic = "stevia-mqtt/hbnu/response/lock/N5506";

// MQTT 설정
WiFiClient espClient;
PubSubClient client(espClient);

// NFC 모듈 핀 설정 (SPI 사용)
#define SS_PIN 15    // GPIO15 (D8)
#define MOSI_PIN 13  // GPIO13 (D7)
#define MISO_PIN 12  // GPIO12 (D6)
#define SCK_PIN 14   // GPIO14 (D5)

Adafruit_PN532 nfc(SS_PIN);

// 초음파 센서 핀 설정
const int trigPin = D1;  // Trig 핀
const int echoPin = D2;  // Echo 핀

// Solenoid
const int solenoidPin = 16;  // Solenoid Pin

void setup_wifi() {
  delay(10);

  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}


void setup_nfc() {
  delay(10);

  // NFC 초기화
  nfc.begin();
  uint32_t versiondata = nfc.getFirmwareVersion();
  if (!versiondata) {
    Serial.print("Didn't find PN53x board");
    while (1)
      ;  // 무한 루프
  }
  nfc.SAMConfig();
  Serial.println("NFC Reader Initialized");
}

void setup_sonic() {
  delay(10);

  // 초음파 센서 설정
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  Serial.println("Sonic Sensor Initialized");
}

void setup_relay() {
  delay(10);

  // 릴레이 설정
  pinMode(solenoidPin, OUTPUT);
  digitalWrite(solenoidPin, LOW);
  Serial.println("Solenoid Initialized");
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("")) {
      Serial.println("connected");
      client.subscribe(topic);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println("try again in 5 seconds");
      delay(5000);
    }
  }
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");

  String message = "";
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  if (!strcmp(topic, req_key_topic)) {
    uint8_t success;
    uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };
    uint8_t uidLength;

    success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength, 1000);
    if (success) {
      String uidStr = "";
      for (uint8_t i = 0; i < uidLength; i++) {
        uidStr += String(uid[i], HEX) + " ";
      }
      Serial.print("NFC UID: ");
      Serial.println(uidStr);
      client.publish(res_key_topic, uidStr.c_str());
    } else {
      Serial.println("No NFC card detected");
      client.publish(res_key_topic, "No NFC card detected");
    }
  }

  if (!strcmp(topic, req_door_topic)) {
    long duration, distance;

    // Trig 핀을 10us 동안 HIGH로 설정
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);

    // Echo 핀의 펄스 길이 측정
    duration = pulseIn(echoPin, HIGH);

    distance = (duration / 2) / 29.1;  // 거리 계산 (cm 단위)
    String distanceStr = String(distance) + " cm";

    Serial.print("Distance: ");
    Serial.println(distanceStr);

    // 문이 닫힌 거리를 6이라고 임의로 지정
    if (distance > 6.5) {
      Serial.println("Door Not Closed");
      client.publish(res_door_topic, "Door Not Closed");
    }

    if (distance <= 6.5) {
      Serial.println("Door Closed");
      client.publish(res_door_topic, "Door Closed");
    }
  }

  if (!strcmp(topic, req_lock_topic)) {
    String command = "";
    for (int i = 0; i < length; i++) {
      command += (char)payload[i];
    }
    Serial.println(command);

    if (command.equals("ON") || command.equals("on") || command.equals("On")) {
      digitalWrite(solenoidPin, HIGH);  // 스위치를 누른 상태로 설정
      Serial.println("Solenoid On");    // 시리얼 모니터에 메시지 출력
      delay(1000);
      digitalWrite(solenoidPin, LOW);  // 스위치를 누르지 않은 상태로 설정

      client.publish(res_lock_topic, "OPEN");
    }
  }
}

void setup() {
  Serial.begin(9600);
  setup_wifi();
  setup_nfc();
  setup_sonic();
  setup_relay();

  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
}
