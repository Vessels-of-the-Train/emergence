extends Node

# NEXUS LINK - VESSEL TYPE: 01 INGRESS
# Connects the Simulation (Godot) to the Operating System (Next.js)

signal pulse_received(data)

var timer: Timer
var http_request: HTTPRequest
var base_url = "http://localhost:3000/api/nexus/status"

func _ready():
	print("NEXUS LINK: Initializing...")
	
	# Setup HTTP Request Node
	http_request = HTTPRequest.new()
	add_child(http_request)
	http_request.request_completed.connect(_on_request_completed)
	
	# Setup Timer for Polling (Every 2 seconds)
	timer = Timer.new()
	add_child(timer)
	timer.wait_time = 2.0
	timer.timeout.connect(_on_timer_timeout)
	timer.start()
	
	print("NEXUS LINK: Listening on " + base_url)
	_ping_nexus()

func _on_timer_timeout():
	_ping_nexus()

func _ping_nexus():
	var error = http_request.request(base_url)
	if error != OK:
		print("NEXUS LINK: Connection Error!")

func _on_request_completed(result, response_code, headers, body):
	if response_code == 200:
		var json = JSON.new()
		var error = json.parse(body.get_string_from_utf8())
		if error == OK:
			var data = json.get_data()
			emit_signal("pulse_received", data)
			print("NEXUS HEARTBEAT: Pulse " + str(data.pulse) + " | State: " + data.somatic_state)
			
			if data.has("command") and data.command == "SPAWN":
				print("NEXUS COMMAND RECEIVED: SPAWN LIFEFORM")
				# Future: Call a Spawner node here
		else:
			print("NEXUS LINK: JSON Parse Error")
	else:
		print("NEXUS LINK: Server Error " + str(response_code))
