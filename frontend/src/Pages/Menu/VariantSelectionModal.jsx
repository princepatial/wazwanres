import React from 'react';
import { X } from 'lucide-react';
import './VariantSelectionModal.css';

const VariantSelectionModal = ({ isOpen, onClose, variants, onVariantSelect, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="variant-modal-overlay">
      <div className="variant-modal">
        <div className="variant-modal-header">
          <h3 className="variant-modal-title">{itemName}</h3>
          <button onClick={onClose} className="variant-modal-close">
            <X size={24} />
          </button>
        </div>
        <div className="variant-options">
          {variants.map((variant) => (
            <button
              key={variant.name}
              onClick={() => {
                onVariantSelect(variant);
                onClose();
              }}
              className="variant-option"
            >
              <span>{variant.name}</span>
              <span className="variant-price">₹{variant.price}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VariantSelectionModal;