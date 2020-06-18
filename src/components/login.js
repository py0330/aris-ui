import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default Login;

var md5 = require('md5');

function Login(props) {
	const [state , setState] = useState({
        username : "",
        password : ""
    })
    const handleChange = (e) => {
        const {id , value} = e.target;
        setState(prevState => ({
            ...prevState,
            [id] : value
        }))
    }
	const handleSubmit = async function(event){
		// prevent refresh //
		event.preventDefault();
		
		// send user //
		let user = {
		  username: state.username
		};
		
		let response1 = await fetch('/api/login/fetch', {
		  method: 'POST',
		  cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		  headers: {
			'Content-Type': 'application/json;charset=utf-8',
		  },
		  body: JSON.stringify(user)
		});
		
		// get realm & nonce //
		let authenticate = response1.headers.get('WWW-Authenticate')
		
		let realm = authenticate.substr(authenticate.indexOf('realm="') + 7);
		realm = realm.substr(0, realm.indexOf('"'));
		if(realm === ""){
			alert("用户名不存在");
			return;
		}
		
		let nonce = authenticate.substr(authenticate.indexOf('nonce="') + 7);
		nonce = nonce.substr(0, nonce.indexOf('"'));
		
		
		// login //
		const HA1 = md5(state.username + ":" + realm + ":" + state.password);
		const HA2 = md5("POST:/api/login");

		const auth_hash = md5( HA1 + ':' + nonce + ':00000001:afa71bfbf04e0b4f:auth:' + HA2	);
		
		const auth_reply = 'Digest username="'+ state.username + '", realm="' + realm + '", nonce="' + nonce +
    	  '", uri="/api/login", response="' + auth_hash + '", qop=auth, nc=00000001, cnonce="afa71bfbf04e0b4f"';
		
 		let response2 = await fetch('/api/login', {
		  method: 'POST',
		  cache: 'no-cache',
		  headers: {
			'Content-Type': 'application/json;charset=utf-8',
			'Authorization': auth_reply
		  },
		});
		
		if(response2.status === 200){
			alert("账号或密码错误");
			return;
		}
		else if(response2.status === 202){
			document.cookie = 'Authorization='+ auth_reply +'; path=/';
			props.onLogin(state.username);
			return;
		}
		else{
			alert("登录错误");
			return;
		}
    }
  
	return(
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
            <form onSubmit={handleSubmit}>
                <div className="form-group text-left">
                <label htmlFor="username">用户名：</label>
                <input type="text" 
                       className="form-control" 
                       id="username" 
                       placeholder="请输入用户名"
					   onChange={handleChange} 
                />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="password">密码：</label>
                    <input type="password" 
                        className="form-control" 
                        id="password" 
                        placeholder="请输入密码"
						onChange={handleChange} 
                    />
                </div>
                <button type='submit' className="btn btn-primary">登录</button>
            </form>
        </div>
	);
}