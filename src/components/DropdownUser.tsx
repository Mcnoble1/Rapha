import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

const DropdownUser = () => {

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);
  const navigate = useNavigate();

  // const { logout } = useContext(Web5Context);

  const logout = () => {
    localStorage.removeItem('userType');
    localStorage.setItem('userType', '');
    navigate('/homepage')
  }

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  return (
    <div className="relative">
      <button

        className="flex items-center gap-4"
        onClick={() => logout()}
      >
        <span className="hidden text-right lg:block">
          <span className="block text-xs">Logout</span>
        </span>
      </button>
    </div>
  );
};

export default DropdownUser;
