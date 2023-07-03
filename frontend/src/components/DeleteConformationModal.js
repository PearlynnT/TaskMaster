import React from 'react';
import '../style/deleteConformationModal.css';

function DeleteConformationModal({isOpen, onCancel,onConfirm}) {
    return (
        <div className={`${isOpen ? 'modal--open' : 'modal--close'}`}>
            <p>Are you sure you want to delete this item ?</p>
            <div className="modal--actions">
                <button onClick = {onCancel} className="modal--cancel">Cancel</button>
                <button onClick = {onConfirm} className="modal--delete">Confirm Delete</button>
            </div>
        </div>
    )
}

export default DeleteConformationModal;