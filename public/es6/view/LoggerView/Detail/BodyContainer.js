/**
 * Created by Ellery1 on 16/6/10.
 */
import React from 'react';
import fixTextarea from './fixTextarea';

export default React.createClass({
    componentDidUpdate(){

        fixTextarea();
    },
    render(){

        const {body}=this.props;

        return (
            body ?
                <textarea
                    ref={component=>this.textarea=component}
                    resize={false}
                    disabled={true}
                    value={JSON.stringify(body, null, 4)}
                    className="body-textarea panel-body">
                </textarea> :
                <div className="panel-body">无</div>
        )
    }
});