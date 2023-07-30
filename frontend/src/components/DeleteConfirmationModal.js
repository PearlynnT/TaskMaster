import React from 'react';
import { Button, Modal } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi'; // Assuming you have imported this icon

function DeleteConfirmationModal({ isOpen, onCancel, onConfirm }) {
  return (
    <Modal show={isOpen} size="md" popup onClose={onCancel}>
      <Modal.Body>
        <div className="text-center">
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            Are you sure you want to delete this item?
          </h3>
          <div className="flex justify-center gap-4">
            <Button color="gray" onClick={onCancel}>
              Cancel
            </Button>
            <Button color="failure" onClick={onConfirm}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default DeleteConfirmationModal;
