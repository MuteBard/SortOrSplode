import React, {Component} from 'react';
import VideoCover from 'react-video-cover'
import VideoBackground from '../components/VideoBackground' 
import '../styles/Home.css'

class Game extends Component{

    
    componentDidMount() {
        const canvas = this.refs.sos
        const ctx = canvas.getContext("2d")
        const img = this.refs.image
        img.onload = () => {
            ctx.drawImage(img, 0, 0)
            ctx.font = "40px Courier"
            ctx.fillText("this.props.text", 210, 75)
        }
      }


    render(){
        console.log(this.props)
        console.log(this.props.text)
        return(
          <div>
              <canvas ref="sos" width={800} height={725}/>
              <img ref="image" src={"https://cdn.discordapp.com/attachments/562790526307270656/564611008937590804/SmartSelect_20190407-204226_Gallery.png"}/>
          </div>
        )
    }
}

export default Game;


