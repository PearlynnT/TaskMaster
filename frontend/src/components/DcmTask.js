import React from 'react';
import '../style/dcmTask.css';

function DcmTask({isOpen, onCancel, onConfirm}) {
    return (
        <div className={`${isOpen ? 'modal--open--task' : 'modal--close'}`}>
            <p>Are you sure you want to delete this item ?</p>
            <div className="modal--actions">
                <button className="modal--cancel" onClick={onCancel} >Cancel</button>
                <button className="modal--delete" onClick={onConfirm} >Confirm Delete</button>
            </div>
        </div>
    )
}

export default DcmTask;