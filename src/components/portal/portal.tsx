



import { useState } from 'react';
import './portal.scss';



export function PortalHeader({ title }: { title: string }) {

  return (
    <h2>{title}</h2>
  );
}

export function Portal({ headerContent, navContent, footerContent, children }: { headerContent?: any, navContent?: any, footerContent?: any, children: any }) {

  const hasNav = navContent ? true : false;

  const [showNav, setShowNav] = useState(false);



  return (
    <div className={`portal ${showNav ? '' : 'hidden-nav'}`}>
      <header>{headerContent && headerContent}</header>
      {hasNav && showNav && <nav>{navContent}</nav>}
      <main>{children}</main>
      <footer>Copyrights</footer>
    </div>
  );

}
