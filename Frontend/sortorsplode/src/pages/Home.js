import React, {Component} from 'react';
import VideoCover from 'react-video-cover'
import VideoBackground from '../components/VideoBackground' 
import '../styles/Home.css'

class Home extends Component{
    constructor(props){
        super(props)
        this.state = {
            username : "",
            password : "",
            remember : false,             
        }
    }

    render(){
        return(
            <div>
                {/* <VideoBackground> */}
                    <form className="AuthenticationContainer">
                        <div className="ACHeader">
                            LOGIN
                        </div>
                        <div className="ACUsername">
                            <input className="inputField" type="text" name="username" placeholder="Username"/>
                        </div>
                        <div className="ACPassword">
                            <input className="inputField" type="text" name="password" placeholder="Password"/>
                        </div>
                        <div className="ACRememberForgot">
                            <div className="ACCheckboxContainer">
                                <input className="ACCheckbox" type="checkbox" name="remember"/>
                                <div className="ACCheckboxText">Remember me</div>
                            </div>
                            <div className="ACFogot">
                                Forgot?
                            </div>
                        </div>
                        <div className="ACProceed">
                            <button submit="button">LOGIN</button>
                        </div> 
                    </form>
                {/* </VideoBackground> */}
            </div>
        )
    }
}


export default Home;
// render (){
//     const { handleSubmit } = this.props;
//     return(
//         <form onSubmit={handleSubmit(this.onSubmit)}>
//             <fieldset>
//                 <label>Email</label>
//                 <Field
//                     name="email"
//                     type="text"
//                     component="input"
//                     autoComplete="none"/>  
//             </fieldset>
//             <fieldset>
//                 <label>Password</label>
//                 <Field
//                     name="password"
//                     type="password"
//                     component="input"
//                     autoComplete="none"
//                     />
//             </fieldset>
//             <div>{this.props.errorMessage}</div>
//             <button>Sign in</button>
//         </form>