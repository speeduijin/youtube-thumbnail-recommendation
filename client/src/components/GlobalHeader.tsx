import React, { FC } from 'react';

interface P {
  handleLogout: () => Promise<void>;
}

const GlobalHeader: FC<P> = ({ handleLogout }) => {
  return (
    <header className="global-header">
      <div className="button-group">
        <>
          <button
            type="button"
            onClick={handleLogout}
            className="btn btn-logout"
          >
            Logout
          </button>
        </>
      </div>
    </header>
  );
};

export default GlobalHeader;
