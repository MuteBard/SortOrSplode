import React, {Component} from 'react';
import VideoCover from 'react-video-cover'
import '../styles/Video.css'

export default ({children}) =>  {

    const videoOptions = {
        src: './imagination/imagination.mp4',
        autoPlay: true,
        loop: true,
        muted: true
    }

    return(
        <div className="videoContainer"> 
            <VideoCover
                videoOptions={videoOptions}
                remeasureOnWindowResize
                getResizeNotifier={resizeNotifier => {
                    this.setState({
                        resizeNotifier,
                    });
                }}
            />
            {children}
        </div>
    )
}

