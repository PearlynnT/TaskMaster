import React from 'react';
import '../style/priority.css'

export default function Priority(props) {
    return (
        <div data-testid='priority'>
            {props.priority === 'High' 
            ? <High />
            : props.priority === 'Medium'
            ? <Medium />
            : <Low />}
        </div>
    )
}

export function High() {
    return (
        <div className='High'>High</div>
    );
}

export function Medium() {
    return (
        <div className='Medium'>Medium</div>
    );
}

export function Low() {
    return (
        <div className='Low'>Low</div>
    );
}


