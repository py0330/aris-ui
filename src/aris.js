
/* global BigInt */
/* global BigUint64Array */
class Msg{
	constructor(buffer) {this.buffer = buffer;}
	
	size(){	return new Uint32Array(this.buffer, 0, 4)[0];}
	
	get id(){return new Uint32Array(this.buffer, 4, 8)[0];}
	set id(value){new Uint32Array(this.buffer, 4, 8)[0] = value;}
	
	get type(){return new BigUint64Array(this.buffer, 8, 16)[0];}
	set type(value){new BigUint64Array(this.buffer, 8, 16)[0] = value;}
	
	get reserved1(){return new BigUint64Array(this.buffer, 16, 1)[0];}
	set reserved1(value){new BigUint64Array(this.buffer, 16, 1)[0] = value;}
	
	get reserved2(){return new BigUint64Array(this.buffer, 24, 8)[0];}
	set reserved2(value){new BigUint64Array(this.buffer, 24, 8)[0] = value;}
	
	get reserved3(){return new BigUint64Array(this.buffer, 32, 8)[0];}
	set reserved3(value){new BigUint64Array(this.buffer, 32, 8)[0] = value;}
	
	get data() { return String.fromCharCode.apply(null, new Uint8Array(this.buffer.slice(40)));}
	
	static make(str, head_buffer = null){
		if(head_buffer === null)head_buffer = new ArrayBuffer(40);
		let head_view = new Int32Array(head_buffer, 0, 1);
		head_view[0] = str.length;
		let data_sent = new Uint8Array(str.length + 40);
		data_sent.set(new Uint8Array(head_buffer), 0)
		for (let i=0, strLen=str.length; i<strLen; i++) {
			data_sent[i + 40] = str.charCodeAt(i);
		}
		return new Msg(data_sent.buffer);
	}
}
class Command{
	constructor(msg, callback) {
      this.msg = msg;
	  this.callback = callback;
    }
}
class Robot{
	constructor() {
		this.robot_web_sock = null;
		this.cmd_map = new Map();
		this.cmd_reserved1 = BigInt(1000);
		this.on_connected = null;
		this.on_sending_msg = null;
		this.on_received_msg = null;
		this.on_close = null;
	}
	
	setOnConnect(on_connected){this.on_connected = on_connected;}
	setOnReceivedMsg(on_received_msg){this.on_received_msg = on_received_msg;}
	setOnSendingMsg(on_sending_msg){this.on_sending_msg = on_sending_msg;}
	setOnClose(on_close){this.on_close = on_close;}
	
	connect(){
		try
		{
			this.cmd_map = new Map();
			this.cmd_reserved1 = BigInt(1000);
			this.robot_web_sock = new WebSocket("ws://" + window.location.host.split(":")[0] + ":5866");
		}
		catch(e)
		{
			console.log(e);
		}
	  
		this.robot_web_sock.onmessage = function(event) {
			event.data.arrayBuffer().then(buffer => {
				let msg = new Msg(buffer);
				let cmd = robot.cmd_map.get(msg.reserved1);
				robot.cmd_map.delete(msg.reserved1);
				if(cmd.callback === null)return;
				cmd.callback(msg);
			});
		};
	  
		this.robot_web_sock.onclose = (event) => this.connect();
	}
	
	send_cmd(cmd_str, callback = null){
		if(this.robot_web_sock.readyState !== WebSocket.OPEN)
		{
			alert("robot not connected...");
			return;
		}

		let msg = Msg.make(cmd_str);
		msg.reserved1 = this.cmd_reserved1;
		this.cmd_map.set(this.cmd_reserved1, new Command(msg, callback));
		this.cmd_reserved1++;
		
		if(this.on_sending_msg != null) this.on_sending_msg(msg);
		this.robot_web_sock.send(msg.buffer);
	}
}

var robot = new Robot();
robot.connect();

export default robot;
