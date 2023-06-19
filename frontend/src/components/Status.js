import React from 'react';
import '../style/status.css'

export function Completed() {
    return (
        <div className='completed'>Completed</div>
    );
}

export function OnGoing() {
    return (
        <div className='onGoing'>OnGoing</div>
    );
}

export function Stuck() {
    return (
        <div className='stuck'>Stuck</div>
    );
}
