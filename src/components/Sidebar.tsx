import React from "react";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/buyers">Buyers</Link></li>
        <li><Link to="/landowners">Landowners</Link></li>
        <li><Link to="/lands">Lands</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
