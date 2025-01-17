

import RactDom from 'react-dom';
export default function Modal(props) {

  const{childrenm , handleCloseModal} = props

  return ReactDOM.createPortal(
    <div className='modal-container'>
      <button onClick={handleCloseModal} className={'moal-underlay'}>
      </button>
      <div className='modal-content'>
        {children}
      </div>
    </div>,
    document.getElementById('portal')
  );
}
